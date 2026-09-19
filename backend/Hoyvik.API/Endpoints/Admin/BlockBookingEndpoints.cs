using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin;

public class BlockBookingEndpoints : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        var group = app
            .MapGroup("/admin")
            .RequireAuthorization(Roles.ADMIN);

        group.MapPost("/blocked-periods", Create);
        group.MapGet("/blocked-periods", Get);
        group.MapDelete("/blocked-periods", Delete);
    }

    async Task<IResult> Get(Database db, CancellationToken ct)
    {
        var blocked = await db.BlockedPeriods.ToListAsync(ct);
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

    async Task<IResult> Create(CreateBlockedPeriodRequest request, Database db, CancellationToken ct)
    {
        if (request.BlockedPeriods.Count <= 0)
        {
            return Results.BadRequest("Array is empty.");
        }

        var blockedPeriods = request.BlockedPeriods.Select(r => new BlockedPeriod
        {
            CheckIn = r.CheckIn,
            CheckOut = r.CheckOut,
            CreatedAt = DateTime.UtcNow,
            Reason = r.Reason,
        });


        await db.AddRangeAsync(blockedPeriods, ct);

        await db.SaveChangesAsync(ct);

        return Results.Ok(blockedPeriods);
    }
}

record CreateBlockedPeriodRequest(List<BlockedPeriodData> BlockedPeriods);

record BlockedPeriodData(
    DateOnly CheckIn,
    DateOnly? CheckOut,
    string? Reason);