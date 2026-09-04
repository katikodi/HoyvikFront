
using System.Threading.Tasks.Dataflow;
using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Exceptions;
using Hoyvik.API.Models;
using Hoyvik.API.Models.Requests;
using Hoyvik.API.Services.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;
using Stripe;
using Stripe.Checkout;

namespace Hoyvik.API.Services;

public class BookingService(
    Database db,
    IOptionsMonitor<BookingConfiguration> bookingConfiguration,
    IStripePaymentService stripePaymentService,
    ILogger<BookingService> logger) : IBookingService
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
		   .SingleOrDefaultAsync(x => x.Id == bookingId, ct);

		if(booking is null)
		{
			logger.LogWarning(
				"Booking {BookingId} not found",
				bookingId);

			return false;
		}

		// Make sure this Stripe session belongs to this booking
		if(booking.StripeSessionId != null &&
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

		// Already confirmed
		if(booking.Status == BookingStatus.Confirmed)
		{
			return true;
		}

		// Don't confirm cancelled/expired bookings
		if(booking.Status != BookingStatus.Pending)
		{
			logger.LogWarning(
				"Booking {BookingId} has status {Status}, cannot confirm",
				booking.Id,
				booking.Status);

			return false;
		}

		booking.Status = BookingStatus.Confirmed;
		booking.StripeSessionId = stripeSessionId;

		await db.SaveChangesAsync(ct);

		logger.LogInformation("Booking {BookingId} confirmed", booking.Id);

		return true;
	}

	public async Task<bool> ExpireBooking(int bookingId, string stripeSessionId, CancellationToken ct = default)
	{
		var booking = await db.Bookings
			.SingleOrDefaultAsync(x => x.Id == bookingId, ct);

		if(booking is null)
		{
			logger.LogWarning(
				"Booking {BookingId} not found",
				bookingId);

			return false;
		}

		// Make sure this Stripe session belongs to this booking
		if(booking.StripeSessionId != null &&
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

		if(booking.Status != BookingStatus.Pending)
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

    public async Task<string> CreateBookingPaymentSession(CreateSessionRequest request, string? userId, CancellationToken ct = default)
    {
        var booking = await CreatePendingBooking(request, userId, ct);

        try
        {
            var stripeSession = await stripePaymentService.CreateCheckoutSession(booking, ct);

            booking.StripeSessionId = stripeSession.SessionId;

            await db.SaveChangesAsync(ct);

            return stripeSession.Url;
        }
        catch
        {
            logger.LogError("Removing booking {BookingId} because checkout session creation failed", booking.Id);

            db.Bookings.Remove(booking);

            await db.SaveChangesAsync(ct);

            throw;
        }
    }


    private async Task<Booking> CreatePendingBooking(CreateSessionRequest request,string? userId, CancellationToken ct)
    {
        var available = await CheckAvailability(request.CheckIn, request.CheckOut, ct);

        if (!available)
            throw new BookingNotAvailableException();

        var config = bookingConfiguration.CurrentValue;

        var numberOfNights =
            request.CheckOut.DayNumber -
            request.CheckIn.DayNumber;

        var totalPrice =
            numberOfNights * config.PricePerNight;

        var now = DateTime.UtcNow;

        var booking = new Booking
        {
            CheckIn = request.CheckIn,
            CheckOut = request.CheckOut,
            Price = totalPrice,
            Status = BookingStatus.Pending,
            UserId = userId,
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
        catch (PostgresException ex)
            when (ex.SqlState == PostgresErrorCodes.ExclusionViolation)
        {
            throw new BookingNotAvailableException();
        }
    }
}
