using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin;

public class BlockBookingEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/admin/blocked-periods", Create);
        app.MapGet("/admin/blocked-periods", Get);
        app.MapDelete("/admin/blocked-periods", Delete);
    }

    async Task<IResult> Get(Database db, CancellationToken ct)
    {
        var blocked = await db.BlockedPeriods.ToListAsync();
        return Results.Ok(blocked);
    }

    async Task<IResult> Delete(int id, Database db, CancellationToken ct)
    {
        var blockedPeriod = await db.BlockedPeriods
            .FindAsync([id], ct);

        if (blockedPeriod is null)
            return Results.NotFound();

        db.BlockedPeriods.Remove(blockedPeriod);
        await db.SaveChangesAsync(ct);

        return Results.NoContent();
    }

    async Task<IResult> Create(CreateBlockedPeriodRequest request, Database db,CancellationToken ct)
    {
        var blockedPeriod = new BlockedPeriod { 
            CheckIn = request.CheckIn,
            CheckOut = request.CheckOut,
            CreatedAt = DateTime.UtcNow,
            Reason = request.Reason,
        };

        db.BlockedPeriods.Add(blockedPeriod);

        await db.SaveChangesAsync(ct);

        return Results.Ok(blockedPeriod);
    }
}

public record CreateBlockedPeriodRequest(
    DateOnly CheckIn,
    DateOnly CheckOut,
    string? Reason);