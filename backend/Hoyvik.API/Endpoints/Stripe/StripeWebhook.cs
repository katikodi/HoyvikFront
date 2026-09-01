using Hoyvik.API.Data;
using Stripe;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
namespace Hoyvik.API.Endpoints.Stripe;

public class StripeWebhook : IEndpoint
{

    /*
     *stripe listen --forward-to localhost:5200/api/payment/webhook
     * */

    public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/payment/webhook", Webhook);

    async Task<IResult> Webhook(HttpRequest request, IConfiguration config, Database db, ILogger<StripeWebhook> logger)
    {
        var json = await new StreamReader(request.Body).ReadToEndAsync();

        var stripeSignature = request.Headers["Stripe-Signature"];

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                config["Stripe:WebhookSecret"]
                    ?? throw new Exception("Stripe:WebhookSecret is missing"));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Invalid Stripe webhook");

            return Results.BadRequest();
        }

        logger.LogInformation("Stripe event: {Type}", stripeEvent.Type);

        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Session;

            if (session is null)
                return Results.BadRequest();

            if (!session.Metadata.TryGetValue("BookingId", out var bookingIdString))
            {
                logger.LogError(
                    "Stripe session {SessionId} has no BookingId",
                    session.Id);

                return Results.BadRequest();
            }

            if (!int.TryParse(bookingIdString, out var bookingId))
            {
                logger.LogError(
                    "Invalid BookingId {BookingId}",
                    bookingIdString);

                return Results.BadRequest();
            }

            var booking = await db.Bookings
                .SingleOrDefaultAsync(x => x.Id == bookingId);

            if (booking is null)
            {
                logger.LogError(
                    "Booking {BookingId} not found",
                    bookingId);

                return Results.BadRequest();
            }

            // Prevent processing the same event/session twice
            if (booking.Status == BookingStatus.Confirmed)
            {
                return Results.Ok();
            }

            booking.Status = BookingStatus.Confirmed;
            booking.StripeSessionId = session.Id;

            await db.SaveChangesAsync();

            logger.LogInformation(
                "Booking {BookingId} confirmed. Stripe session {SessionId}",
                booking.Id,
                session.Id);
        }

        return Results.Ok();
    }
}