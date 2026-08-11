using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin;

public class GetBookingsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
        => app.MapGet("/admin/users/{id}", GetBookings)
        .RequireAuthorization("admin", "Admin");


    async Task<IResult> GetBookings(string id,Database db)
    {

        var bookings = await db.Bookings.Where(x => x.UserId == id.ToString()).ToListAsync();

        return Results.Ok(new
        {
            bookings = bookings
        });
    }
}
