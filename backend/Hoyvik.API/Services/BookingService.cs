
using Hoyvik.API.Data;
using Hoyvik.API.Exceptions;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace Hoyvik.API.Services;

public class BookingService(Database db, ILogger<BookingService> logger) : IBookingService
{
    public async Task<bool> CheckAvailability(DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default) =>  
        !await db.Bookings.AnyAsync(
            x =>  x.Status != Models.BookingStatus.Cancelled && 
            x.CheckIn < checkOut &&
            x.CheckOut > checkIn, ct);
    

    public async Task<string> CreateCheckoutSession(
        CreateSessionRequest request, 
        string? userId, 
        CancellationToken ct)
    {

        var available = await CheckAvailability(request.CheckIn, request.CheckOut, ct);

        if (!available)
            throw new BookingNotAvailableException();


        var numberOfNights = request.CheckOut.DayNumber - request.CheckIn.DayNumber;
        var pricePerNight = 1050m;

        var totalPrice = numberOfNights * pricePerNight * request.NumberOfGuests;


        var booking = new Models.Booking
        {
            CheckIn = request.CheckIn,
            CheckOut = request.CheckOut,
            Price = totalPrice, //1050kr
            Status = BookingStatus.Pending,
            UserId = userId,
            NumberOfGuests = request.NumberOfGuests
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync(ct);

        var options = new SessionCreateOptions
        {
            Mode = "payment",
            SuccessUrl = $"http://localhost:54131/payment/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            CancelUrl = "http://localhost:54131/payment/payment-cancel",
            Currency = "nok",
            Metadata = new() {
                {"BookingId", booking.Id.ToString()},
                {"CheckIn", booking.CheckIn.ToString("O") },
                {"CheckOut", booking.CheckOut.ToString("O") },
            },
            LineItems =
            [
                new SessionLineItemOptions
                {
                    PriceData = new()
                    {
                        Currency = "nok",

                        ProductData = new()
                        {
                            Name =
                                $"Hoyvika Stay — " +
                                $"{booking.CheckIn:dd MMM} to " +
                                $"{booking.CheckOut:dd MMM}",

                            Description =
                                $"{request.NumberOfGuests} guests • " +
                                "Check-in after 15:00"
                        },

                        UnitAmount = (long)(booking.Price * 100)
                    },

                    Quantity = 1
                }
            ]
        };

        var service = new SessionService();

        Session session;

        try
        {
            session = await service.CreateAsync(options, cancellationToken: ct);
        }
        catch (StripeException ex)
        {
            logger.LogError(
                ex,
                "Failed to create Stripe checkout session for booking {BookingId}",
                booking.Id);

            db.Bookings.Remove(booking);
            await db.SaveChangesAsync(ct);
            throw;
        }

        booking.StripeSessionId = session.Id;
        await db.SaveChangesAsync(ct);
        return session.Url;
    }
}
