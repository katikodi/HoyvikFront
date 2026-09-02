using Hoyvik.API.Configuration;
using Hoyvik.API.Models;
using Hoyvik.API.Services.Abstractions;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace Hoyvik.API.Services;

public class StripePaymentService(IOptions<FrontendConfiguration> frontendConfig, ILogger<StripePaymentService> logger) : IStripePaymentService
{
    public async Task<StripeCheckoutSession> CreateCheckoutSession(Booking booking, CancellationToken ct = default)
    {
        var frontendUrl = frontendConfig.Value.Url;

        if (string.IsNullOrWhiteSpace(frontendUrl))
        {
            throw new InvalidOperationException(
                "Frontend URL is missing.");
        }

        var options = new SessionCreateOptions
        {
            Mode = "payment",
            SuccessUrl = $"{frontendUrl}/payment/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            CancelUrl = $"{frontendUrl}/payment/payment-cancel", 
            Currency = "nok",
            Metadata = new()
            {
                ["BookingId"] = booking.Id.ToString()
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
                            Name = $"Hoyvika {booking.CheckIn:dd MMM} to {booking.CheckOut:dd MMM}",

                            Description = $"{booking.NumberOfGuests} guests • " + "Check-in after 15:00"
                        },
                        UnitAmount = (long)(booking.Price * 100)
                    }, 
                    Quantity = 1
                }
            ]
        };

        var service = new SessionService();

        try
        {
            var session = await service.CreateAsync(
                options,
                cancellationToken: ct);

            return new StripeCheckoutSession(
                session.Id,
                session.Url);
        }
        catch (StripeException ex)
        {
            logger.LogError(
                ex,
                "Failed to create Stripe checkout session for booking {BookingId}",
                booking.Id);

            throw;
        }
    }
}
