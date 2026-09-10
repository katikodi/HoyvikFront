using Hoyvik.API.Services.Abstractions;
using Stripe;
using Stripe.Checkout;
namespace Hoyvik.API.Endpoints.Payment.Stripe;

internal sealed class StripeWebhook : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) =>
        app.MapPost("/payment/webhook", Webhook);

    static async Task<IResult> Webhook(
        HttpRequest request,
        IConfiguration config,
        IBookingService bookingService,
        ILogger<StripeWebhook> logger,
        CancellationToken ct)
    {
        var json = await new StreamReader(request.Body)
            .ReadToEndAsync(ct);

        var stripeSignature = request.Headers["Stripe-Signature"];

        var webhookSecret = config["Stripe:WebhookSecret"];

        if (string.IsNullOrWhiteSpace(webhookSecret))
        {
            logger.LogCritical("Stripe webhook secret is not configured");

            return Results.Problem(
                statusCode: StatusCodes.Status500InternalServerError);
        }

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                webhookSecret);
        }
        catch (StripeException ex)
        {
            logger.LogWarning(
                ex,
                "Invalid Stripe webhook signature");

            return Results.BadRequest();
        }

        logger.LogInformation(
            "Received Stripe event {EventId} of type {EventType}",
            stripeEvent.Id,
            stripeEvent.Type);

        if (stripeEvent.Type is not
            ("checkout.session.completed" or "checkout.session.expired"))
        {
            return Results.Ok();
        }

        if (stripeEvent.Data.Object is not Session session)
        {
            logger.LogWarning(
                "Stripe event {EventId} did not contain a Checkout Session",
                stripeEvent.Id);

            return Results.BadRequest();
        }

        if (!session.Metadata.TryGetValue(
                "BookingId",
                out var bookingIdString))
        {
            logger.LogError(
                "Stripe session {SessionId} has no BookingId",
                session.Id);

            return Results.BadRequest();
        }

        if (!int.TryParse(bookingIdString, out var bookingId))
        {
            logger.LogError(
                "Stripe session {SessionId} contains invalid BookingId {BookingId}",
                session.Id,
                bookingIdString);

            return Results.BadRequest();
        }

        switch (stripeEvent.Type)
        {
            case "checkout.session.completed":

                if (session.PaymentStatus != "paid")
                {
                    logger.LogWarning(
                        "Session {SessionId} completed with payment status {PaymentStatus}",
                        session.Id,
                        session.PaymentStatus);

                    return Results.Ok();
                }

                var confirmed = await bookingService.ConfirmBooking(
                    bookingId,
                    session.Id,
                    ct);

                if (!confirmed)
                {
                    logger.LogWarning(
                        "Could not confirm booking {BookingId} from Stripe session {SessionId}",
                        bookingId,
                        session.Id);
                }

                break;

            case "checkout.session.expired":

                var expired = await bookingService.ExpireBooking(
                    bookingId,
                    session.Id,
                    ct);

                if (!expired)
                {
                    logger.LogWarning(
                        "Could not expire booking {BookingId} from Stripe session {SessionId}",
                        bookingId,
                        session.Id);
                }

                break;
        }

        return Results.Ok();
    }
}