using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Exceptions;
using Hoyvik.API.Models;
using Hoyvik.API.Models.Requests;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Hoyvik.API.Services;

internal sealed class BookingService(
    Database db,
    IOptionsMonitor<BookingConfiguration> bookingConfiguration, 
    IStripePaymentService stripePaymentService,
    UserManager<ApplicationUser> userManager,
    ILogger<BookingService> logger
    ) : IBookingService
{

    /// <summary>
    /// Status: Confirmed blocks availability
    /// Status: Pending + not expired blocks availability
    /// Status: Pending + expired does not block
    /// Status: Cancelled Does not block
    /// </summary>
    /// <param name="checkIn"></param>
    /// <param name="checkOut"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    public async Task<bool> CheckAvailability(DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        logger.LogInformation("Checking availability: {CheckIn} -> {CheckOut}", checkIn, checkOut);


        var bookingExists = await db.Bookings.AnyAsync(x =>
        (
            x.Status == BookingStatus.Confirmed || (x.Status == BookingStatus.Pending && x.ExpiresAt > now)
        ) && x.CheckIn < checkOut && x.CheckOut > checkIn, ct);

        if (bookingExists)
            return false;

        var blocked = await db.BlockedPeriods.AnyAsync(x => x.CheckIn < checkOut && x.CheckOut > checkIn, ct);
        return !blocked;
    }

    public async Task<bool> ConfirmBooking(int bookingId, string stripeSessionId, CancellationToken ct = default)
    {
        var booking = await db.Bookings
            .Include(x => x.User)
            .SingleOrDefaultAsync(x => x.Id == bookingId, ct);

        if (booking is null)
        {
            logger.LogWarning(
                "Booking {BookingId} not found",
                bookingId);

            return false;
        }

        // Make sure this Stripe session belongs to this booking
        if (booking.StripeSessionId != null && booking.StripeSessionId != stripeSessionId)
        {
            logger.LogError(
                "Booking {BookingId} has Stripe session {ExistingSessionId}, " +
                "but webhook contains {WebhookSessionId}",
                booking.Id,
                booking.StripeSessionId,
                stripeSessionId);

            return false;
        }

        // Already confirmed
        if (booking.Status == BookingStatus.Confirmed)
        {
            return true;
        }

        // Don't confirm cancelled/expired bookings
        if (booking.Status != BookingStatus.Pending)
        {
            logger.LogWarning(
                "Booking {BookingId} has status {Status}, cannot confirm",
                booking.Id,
                booking.Status);

            return false;
        }

        var now = DateTime.UtcNow;

        if (booking.ExpiresAt <= now)
        {
            logger.LogWarning(
                "Booking {BookingId} expired before payment confirmation",
                booking.Id);

            return false;
        }

        booking.Status = BookingStatus.Confirmed;
        booking.ConfirmedAt = now;
        booking.StripeSessionId = stripeSessionId;

        var email = booking.User?.Email;

        if (!string.IsNullOrWhiteSpace(email))
        {
            db.EmailOutbox.Add(new EmailOutbox
            {
                To = email,
                Subject = $"Booking confirmation #{booking.Id}",
                Body = CreateBookingConfirmationEmail(booking),
                CreatedAt = now,
                NextAttemptAt = now
            });
        }
        else
        {
            logger.LogWarning(
                "Booking {BookingId} has no email address",
                booking.Id);
        }

        await db.SaveChangesAsync(ct);

        
        logger.LogInformation("Booking {BookingId} confirmed", booking.Id);

        return true;
    }

    public async Task<bool> ExpireBooking(int bookingId, string stripeSessionId, CancellationToken ct = default)
    {
        var booking = await db.Bookings
            .SingleOrDefaultAsync(x => x.Id == bookingId, ct);

        if (booking is null)
        {
            logger.LogWarning(
                "Booking {BookingId} not found",
                bookingId);

            return false;
        }

        // Make sure this Stripe session belongs to this booking
        if (booking.StripeSessionId != null &&
            booking.StripeSessionId != stripeSessionId)
        {
            logger.LogError(
                "Booking {BookingId} has Stripe session {ExistingSessionId}, " +
                "but webhook contains {WebhookSessionId}",
                booking.Id,
                booking.StripeSessionId,
                stripeSessionId);

            return false;
        }

        if (booking.Status != BookingStatus.Pending)
        {
            return false;
        }

        booking.Status = BookingStatus.Expired;

        await db.SaveChangesAsync(ct);

        logger.LogInformation(
            "Booking {BookingId} expired",
            booking.Id);

        return true;
    }

    /// <summary>
    /// when the customer has added everything to the basket and decide to pay, this will be called and they will be re-directed to stripe
    /// to finalize the purchase
    /// this will also reserve the dates for X amount of time
    /// </summary>
    /// <param name="request"></param>
    /// <param name="userId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    public async Task<string> CreateBookingPaymentSession(
        CreateSessionRequest request,
        string? userId,
        CancellationToken ct = default)
    {
        var booking = await CreatePendingBooking(request, userId, ct);

        try
        {
            var stripeSession = await stripePaymentService.CreateCheckoutSession(booking, ct);

            booking.StripeSessionId = stripeSession.SessionId;

            await db.SaveChangesAsync(ct);

            //send the checkout url to the customer
            return stripeSession.Url;
        }
        catch(Exception ex)
        {
            logger.LogError(
                ex,
                "Removing booking {BookingId} because checkout session creation failed",
                booking.Id);
            db.Bookings.Remove(booking);

            await db.SaveChangesAsync(ct);

            throw;
        }
    }
    private async Task<Booking> CreatePendingBooking(
        CreateSessionRequest request, 
        string userId,
        CancellationToken ct)
    {
        var available = await CheckAvailability(request.CheckIn, request.CheckOut, ct);

        if (!available) throw new BookingNotAvailableException();

        var config = bookingConfiguration.CurrentValue;

        var numberOfNights = request.CheckOut.DayNumber - request.CheckIn.DayNumber;

        var totalPrice = numberOfNights * config.PricePerNight;

        var now = DateTime.UtcNow;


        ApplicationUser? user = null;

        user = await db.Users.SingleOrDefaultAsync(x => x.Id == userId, ct)
            ?? throw new InvalidOperationException("User not found.");

        var booking = new Booking
        {
            CheckIn = request.CheckIn,
            CheckOut = request.CheckOut,
            Price = totalPrice,
            Status = BookingStatus.Pending,
            UserId = user.Id,
            User = user,
            NumberOfGuests = request.NumberOfGuests,
            CreatedAt = now,
            ExpiresAt = now.AddMinutes(config.ExpirationTime)
        };

        try
        {
            db.Bookings.Add(booking);

            await db.SaveChangesAsync(ct);

            return booking;
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.ExclusionViolation)
        {
            throw new BookingNotAvailableException();
        }
    }


    private static string CreateBookingConfirmationEmail(Booking booking)
    {
        return $"""
        <html>
        <body>
            <h2>Booking confirmed</h2>

            <p>Thank you for your booking!</p>

            <p>
                <strong>Booking:</strong> #{booking.Id}<br />
                <strong>Check-in:</strong> {booking.CheckIn:dd.MM.yyyy}<br />
                <strong>Check-out:</strong> {booking.CheckOut:dd.MM.yyyy}<br />
                <strong>Guests:</strong> {booking.NumberOfGuests}<br />
                <strong>Total:</strong> {booking.Price:N2} NOK
            </p>

            <p>
                Check-in is available after 15:00.
            </p>

            <p>
                We look forward to welcoming you!
            </p>

            <p>
                Hoyvik
            </p>
        </body>
        </html>
        """;
    }
}
