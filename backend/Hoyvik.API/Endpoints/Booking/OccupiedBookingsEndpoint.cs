using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Hoyvik.API.Endpoints.Booking;

public class OccupiedBookingsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapGet("/bookings/occupied", GetOccupiedBookings);


    async Task<IResult> GetOccupiedBookings(Database db)
    {
        var bookings = await db
            .Bookings
            .Where(x => x.Status == BookingStatus.Confirmed)
            .ToListAsync();

        var occupied = bookings.Select(x => new OccupiedResponse (x.CheckIn, x.CheckOut, x.Status)).ToList();

        return Results.Ok(occupied);
    }


}


record OccupiedResponse(DateOnly CheckIn, DateOnly CheckOut, BookingStatus Status);