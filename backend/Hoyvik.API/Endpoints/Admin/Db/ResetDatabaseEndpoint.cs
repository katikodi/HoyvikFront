using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin.Db;

public class ResetDatabaseEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/admin/database/reset", ResetDatabase)
            .RequireAuthorization("Admin", "admin");
    }


    static async Task<IResult> ResetDatabase(Database db, CancellationToken ct = default)
    {
        await db.Database.EnsureDeletedAsync(ct);
        await db.Database.MigrateAsync(ct);
        return Results.Ok("database has been reset");
    }
}
