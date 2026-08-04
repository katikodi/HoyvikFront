using Hoyvik.API.Data;
using Stripe;
using Stripe.Checkout;

namespace Hoyvik.API.Endpoints.Payment;

public class CheckoutEndpoint : IEndpoint
{
	public void MapEndpoint(RouteGroupBuilder app) =>
		app.MapPost("/payment/create-checkout-session", CreateCheckoutSession);

	async Task<IResult> CreateCheckoutSession()
	{
		var options = new SessionCreateOptions
		{
			Mode = "payment",
			SuccessUrl = "http://localhost:54131/payment/payment-success",
			CancelUrl = "http://localhost:54131/payment/payment-cancel",
			LineItems = [
				new SessionLineItemOptions(){
					PriceData = new(){
						Currency = "nok",
						ProductData = new (){
							Name = "Hoyvika"
						},
						UnitAmount = 2500,
					},
					Quantity = 1
				}
			]
		};

		var service = new SessionService();

		var session = await service.CreateAsync(options);


		return Results.Ok(new
		{
			url = session.Url
		});
	}
}


public class StripeWebhook : IEndpoint
{
	public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/payment/webhook", Webhook);

	async Task<IResult> Webhook(HttpRequest request, IConfiguration config, UserDbContext db, ILogger<StripeWebhook> logger)
	{
		var json = await new StreamReader(request.Body).ReadToEndAsync();

		var stripeSignature = request.Headers["Stripe-Signature"];

		Event stripeEvent;

		try
		{
			stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, config["Stripe:WebhookSecret"] ?? throw new Exception("missing webhook secret"));
		}
		catch(Exception ex)
		{
			logger.LogError("EventUtility.ConstruEvent: {ex}", ex);
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