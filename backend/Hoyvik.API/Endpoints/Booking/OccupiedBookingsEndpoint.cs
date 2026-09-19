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
            .Where(x => x.Status == BookingStatus.Confirmed || x.Status == BookingStatus.Pending)
            .Select(x => new OccupiedResponse(x.CheckIn, x.CheckOut, x.Status))
            .ToListAsync();


        var blockedBookings = await db.BlockedPeriods
            .Select(x => new OccupiedResponse(x.StartDate, x.EndDate, BookingStatus.Confirmed))
            .ToListAsync();
        return Results.Ok(bookings.Concat(blockedBookings));
    }

}

