using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace Hoyvik.API.Endpoints.Payment;

public class CheckoutEndpoint : IEndpoint
{
	public void MapEndpoint(RouteGroupBuilder app) =>
		app.MapPost("/payment/create-checkout-session", CreateCheckoutSession);


    /*Stripe test cards:
	 * Payment Succeed: 4242 4242 4242 4242
	 * Require 3DS Auth: 4000 0025 0000 3155
	 * Payment Declined: 4000 0000 0000 9995
	 */


    async Task<IResult> CreateCheckoutSession(ILogger<CheckoutEndpoint> logger, Database db,CancellationToken ct)
	{
		//calculate checkin -> checkout price


		var orderIndex = await db.Bookings.CountAsync(ct);


		var checkinDate = DateTime.UtcNow;
		var checkoutDate = DateTime.UtcNow.AddDays(5);

		var options = new SessionCreateOptions
		{
			Mode = "payment",
			SuccessUrl = $"http://localhost:54131/payment/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
			CancelUrl = "http://localhost:54131/payment/payment-cancel",
			Currency = "nok",
			Metadata = new() {
				{"BookingId", orderIndex.ToString()},
				{"CheckIn", checkinDate.ToString() },
				{"CheckOut", checkoutDate.ToString() },

			},
			LineItems = [
				new SessionLineItemOptions(){
					PriceData = new(){
						Currency = "nok",
						ProductData = new (){
							Name = "Hoyvika"
						},
						UnitAmount = 2500,
					},
					Quantity = 1,
				}
			]
		};

		var service = new SessionService();


		var session = await service.CreateAsync(options);

		return Results.Ok(new
		{
			//send the frontend the url to visit to finalize the order
			url = session.Url
		});
	}

	record CreateSessionRequest(
		DateTime? Checkin,
		DateTime? Checkout
		);
}


public class StripeWebhook : IEndpoint
{
	public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/payment/webhook", Webhook);

	async Task<IResult> Webhook(HttpRequest request, IConfiguration config, Database db, ILogger<StripeWebhook> logger)
	{
		var json = await new StreamReader(request.Body).ReadToEndAsync();

		var stripeSignature = request.Headers["Stripe-Signature"];

		Event stripeEvent;

		try
		{
			stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, config["Stripe:WebhookSecret"] ?? throw new Exception("Stripe:WebhookSecret is missing"));
		}
		catch(Exception ex)
		{
			logger.LogError(ex, "EventUtility.ConstructEvent");
			return Results.BadRequest();
		}

		logger.LogInformation("StripEevent: {type}", stripeEvent.Type);

		if(stripeEvent.Type == "checkout.session.completed")
		{
			var session = stripeEvent.Data.Object as Session;

			if(session is not null)
			{
				logger.LogInformation("Stripe Payment completed: {id}", session.Id);

				foreach(var md in session.Metadata)
				{
					logger.LogInformation("Metadata Key: {key} Value: {value}", md.Key, md.Value ?? "empty");
				}
			}
		}
		return Results.Ok();
	}
}