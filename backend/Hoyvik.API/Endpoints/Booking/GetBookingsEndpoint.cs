using System.Security.Claims;
using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Booking;

public class GetBookingsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapGet("/me/bookings", Get);//.RequireAuthorization("user", "User", "admin", "Admin");
    }

    static async Task<IResult> Get(HttpContext ctx, Database db, CancellationToken ct = default)
    {
        var user = ctx.User;
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        var bookings = await db.Bookings.Where(x => x.UserId == userId).ToListAsync(ct);

        return Results.Ok(bookings ?? []);

    }
}
