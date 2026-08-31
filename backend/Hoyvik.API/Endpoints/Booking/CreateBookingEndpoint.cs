using Hoyvik.API.Services;

namespace Hoyvik.API.Endpoints.Booking;

public class CreateBookingEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/booking", CreateBooking);
    }


    async Task<IResult> CreateBooking(CreateBookingRequest request, BookingService bookingService)
    {
        if(await bookingService.CheckAvailability(request.BookingId, request.CheckIn, request.CheckOut))
        {
            Console.WriteLine();
        }
        return Results.Ok();
    }
}

record CreateBookingRequest(string BookingId, DateOnly CheckIn, DateOnly CheckOut);
