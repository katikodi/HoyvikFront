using Hoyvik.API.Data;
using Hoyvik.API.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin;

internal sealed class GetBookingsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
        => app.MapGet("/admin/bookings/", GetBookings)
        .RequireAuthorization("admin", "Admin");


    async Task<IResult> GetBookings(Database db)
    {
        var bookings = await db
            .Bookings
            .ToListAsync();

        return Results.Ok(bookings.Select(x => new OccupiedResponse(x.CheckIn, x.CheckOut, x.Status)).ToList());
    }
}
