using Hoyvik.API.Services.Abstractions;
using Stripe;
using Stripe.Checkout;
namespace Hoyvik.API.Endpoints.Payment.Stripe;

public class StripeWebhook : IEndpoint
{

	/*
     *stripe listen --forward-to localhost:5200/api/payment/webhook
     * */

	public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/payment/webhook", Webhook);

	async Task<IResult> Webhook(HttpRequest request, IConfiguration config, IBookingService bookingService, ILogger<StripeWebhook> logger, CancellationToken ct)
	{
		var json = await new StreamReader(request.Body).ReadToEndAsync(ct);

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
		catch(Exception ex)
		{
			logger.LogError(ex, "Invalid Stripe webhook");
			return Results.BadRequest();
		}

		logger.LogInformation("Stripe event: {Type}", stripeEvent.Type);

		if(stripeEvent.Type is not
			("checkout.session.completed" or "checkout.session.expired"))
		{
			return Results.Ok();
		}

		if(stripeEvent.Data.Object is not Session session)
			return Results.BadRequest();

		if(!session.Metadata.TryGetValue("BookingId", out var bookingIdString))
		{
			logger.LogError("Stripe session {SessionId} has no BookingId", session.Id);

			return Results.BadRequest();
		}

		if(!int.TryParse(bookingIdString, out var bookingId))
		{
			logger.LogError("Invalid BookingId {BookingId}", bookingIdString);

			return Results.BadRequest();
		}

		switch(stripeEvent.Type)
		{
			case "checkout.session.completed":

			if(session.PaymentStatus != "paid")
			{
				logger.LogWarning(
					"Session {SessionId} completed but payment status is {PaymentStatus}",
					session.Id,
					session.PaymentStatus);

				return Results.Ok();
			}

			await bookingService.ConfirmBooking(
				bookingId,
				session.Id,
				ct);

			break;

			case "checkout.session.expired":

			await bookingService.ExpireBooking(
				bookingId,
				session.Id,
				ct);

			break;
		}

		return Results.Ok();
	}
}