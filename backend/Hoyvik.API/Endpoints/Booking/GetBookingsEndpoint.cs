using System.Security.Claims;
using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Booking;

/// <summary>
/// TODO: Add projection instead of anonymous objects
/// </summary>
internal sealed class GetBookingsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapGet("/me/bookings", Get).RequireAuthorization(Roles.USER);
    }

    static async Task<IResult> Get(HttpContext ctx, Database db, CancellationToken ct = default)
    {
        var userId = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);

        var bookings = await db.Bookings
            .Where(x => x.UserId == userId)
            .Select(x => new
            {
                x.Id,
                x.StripeSessionId,
                x.Status,
                x.CheckIn,
                x.CheckOut,
                x.NumberOfGuests,
                x.Price
            })
            .ToListAsync(ct);

        return Results.Ok(bookings);

    }
}
