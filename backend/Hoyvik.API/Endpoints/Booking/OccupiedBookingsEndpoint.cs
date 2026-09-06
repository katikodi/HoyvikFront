using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Hoyvik.API.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Booking;

internal sealed class OccupiedBookingsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapGet("/bookings/occupied", GetOccupiedBookings);


    static async Task<IResult> GetOccupiedBookings(Database db)
    {
        var bookings = await db
            .Bookings
            .Where(x => x.Status == BookingStatus.Confirmed)
            .ToListAsync();

        var occupied = bookings.Select(x => new OccupiedResponse(x.CheckIn, x.CheckOut, x.Status)).ToList();

        return Results.Ok(occupied);
    }

}

