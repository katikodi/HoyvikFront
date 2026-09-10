using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Booking;

internal sealed class GetBookingByBookingId : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapGet("/bookings/payment/{sessionId}", Get);
    }

    static async Task<IResult> Get(string sessionId, Database db)
    {

        var result = await db
            .Bookings
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.StripeSessionId  == sessionId);


        if(result is not null)
        {
            return Results.Ok(new {
                result.StripeSessionId,
                result.Status,
                result.CheckIn,
                result.CheckOut,
                result.NumberOfGuests,
                result.Price,
                result.Id,
                result.User!.Email
            });
        }

        return Results.NotFound();
    }
}
