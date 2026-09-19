using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin.Db;

public class ResetDatabaseEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/admin/database/reset", ResetDatabase)
            .RequireAuthorization(Roles.ADMIN);
    }


    static async Task<IResult> ResetDatabase(Database db, IServiceProvider services, CancellationToken ct = default)
    {
        await db.Database.EnsureDeletedAsync(ct);
        await db.Database.MigrateAsync(ct);
        await IdentitySeeder.SeedAsync(services);
        return Results.Ok("database has been reset");
    }
}
