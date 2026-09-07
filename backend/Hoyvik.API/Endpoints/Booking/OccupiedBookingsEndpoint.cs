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


        var blockedBookings = await db.BlockedPeriods.ToListAsync();

        var occupied = bookings.Select(x => new OccupiedResponse(x.CheckIn, x.CheckOut, x.Status)).ToList();
        var blocked = blockedBookings.Select(x => new OccupiedResponse(x.CheckIn, x.CheckOut, BookingStatus.Confirmed)).ToList();

        var x = occupied.Concat(blocked).ToList();
        return Results.Ok(x);
    }

}

