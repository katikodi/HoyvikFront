using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin;

public class BlockBookingEndpoints : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        var group = app
            .MapGroup("/admin")
            .RequireAuthorization(Roles.ADMIN);

        group.MapPost("/blocked-dates", Create);
        group.MapGet("/blocked-dates", GetAll);
        group.MapGet("/blocked-dates/{date}", GetByDate);
        group.MapDelete("/blocked-dates", Delete);
    }

    async Task<IResult> Create(CreateBlockedDateRequest request, Database db, CancellationToken ct)
    {
        if (request.BlockedDates.Count == 0)
        {
            return Results.BadRequest("Array is empty.");
        }

        var dates = request.BlockedDates.Distinct().ToList();

        var existingDates = await db.BlockedDates
            .Where(x => dates.Contains(x.Date))
            .Select(x => x.Date)
            .ToListAsync(ct);

        var blockedDates = dates
            .Except(existingDates)
            .Select(date => new BlockedDate
            {
                Date = date,
                CreatedAt = DateTime.UtcNow,
            })
            .ToList();


        if (blockedDates.Count == 0)
        {
            return Results.Ok(blockedDates);
        }

        await db.AddRangeAsync(blockedDates, ct);

        await db.SaveChangesAsync(ct);

        return Results.Ok(blockedDates);
    }

    async Task<IResult> GetAll(Database db, CancellationToken ct)
    {
        var blocked = await db.BlockedDates.ToListAsync(ct);
        return Results.Ok(blocked);
    }
    async Task<IResult> GetByDate(DateOnly date, Database db, CancellationToken ct)
    {
        var blocked = await db.BlockedDates
            .FindAsync([date], ct);

        if (blocked is null)
        {
            return Results.NotFound($"{date} not found");
        }
        return Results.Ok(blocked);
    }



    async Task<IResult> Delete([FromBody] DeleteBlockedDateRequest request, Database db, CancellationToken ct)
    {
        var blockedDates = await db.BlockedDates
            .Where(x => request.BlockedDates.Contains(x.Date))
            .ToListAsync(ct);

        db.BlockedDates.RemoveRange(blockedDates);

        await db.SaveChangesAsync(ct);

        return Results.NoContent();
    }


}

record DeleteBlockedDateRequest(List<DateOnly> BlockedDates);
record CreateBlockedDateRequest(List<DateOnly> BlockedDates);
