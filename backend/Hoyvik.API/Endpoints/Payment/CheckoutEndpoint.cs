using Hoyvik.API.Data;
using Hoyvik.API.Models;
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


    async Task<IResult> CreateCheckoutSession(CreateSessionRequest request,ILogger<CheckoutEndpoint> logger,Database db,CancellationToken ct)
	{
        //calculate checkin -> checkout price


		if (request.Checkin >= request.Checkout) 
			return Results.BadRequest("Checkout must be after check-in.");
		

		if (request.NumberOfGuests < 1)
			return Results.BadRequest("There must be atleast one guest.");


		var booking = new Models.Booking {
			CheckIn = request.Checkin.Value,
			CheckOut = request.Checkout.Value,
			Price = 2500m,
			Status = Models.BookingStatus.Pending,
            UserId = "fa6aeae2-069d-44e5-80a2-93090be34e0e",
            NumberOfGuests = 1,
            
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
			LineItems = [
				new SessionLineItemOptions(){
					PriceData = new(){
						Currency = "nok",
						ProductData = new (){
							Name = $"Hoyvika - {request.NumberOfGuests} guests"
						},
						UnitAmount = 250000,
                    },
					Quantity = 1,
				}
			]
		};

		var service = new SessionService();


		var session = await service.CreateAsync(options, cancellationToken: ct);

		booking.StripeSessionId = session.Id;

		return Results.Ok(new
		{
			//send the frontend the url to visit to finalize the order
			url = session.Url
		});
	}

	record CreateSessionRequest(DateOnly? Checkin,DateOnly? Checkout, int NumberOfGuests);
}


