using System.Security.Claims;
using FluentValidation;
using Hoyvik.API.Exceptions;
using Hoyvik.API.Models.Requests;
using Hoyvik.API.Services;
using Stripe;

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


    async Task<IResult> CreateCheckoutSession(
        HttpContext ctx,
        CreateSessionRequest request,
        IValidator<CreateSessionRequest> validator,
        IBookingService bookingService,
        ILogger<CheckoutEndpoint> logger,
        CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(request, ct);

        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }
        var userId = ctx.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;


        try
        {
            var checkoutUrl = await bookingService.CreateCheckoutSession(request, userId, ct);

            return Results.Ok(new { 
                url = checkoutUrl
            });
        }
        catch (BookingNotAvailableException ex)
        {
            return Results.Conflict(new
            {
                message = ex.Message
            });
        }
        catch(StripeException ex)
        {
            logger.LogError(ex, "Failed to create Stripe checkout session");

            return Results.Problem(
                statusCode: StatusCodes.Status502BadGateway,
                title: "Unable to create payment session.");
        }
    }
}