using Hoyvik.API.Data;
using Stripe;
using Stripe.Checkout;

namespace Hoyvik.API.Endpoints.Payment;

public class CheckoutEndpoint : IEndpoint
{
	public void MapEndpoint(RouteGroupBuilder app) =>
		app.MapPost("/payment/create-checkout-session", CreateCheckoutSession);

	async Task<IResult> CreateCheckoutSession(ILogger<CheckoutEndpoint> logger)
	{
		//calculate checkin -> checkout price


		var options = new SessionCreateOptions
		{
			Mode = "payment",
			SuccessUrl = $"http://localhost:54131/payment/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
			CancelUrl = "http://localhost:54131/payment/payment-cancel",
			Currency = "nok",
			Metadata = new() {
				{"BookingId", ""},
				{"CheckIn", "" }
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
				logger.LogInformation("Payment completed: {id}", session.Id);
				var bookingId = session.Metadata["BookingId"];
			}

		}



		return Results.Ok();
	}
}