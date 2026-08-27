using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin;

public class MigrationsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/admin/migrate", async (Database db, IServiceProvider services) => {

            await db.Database.EnsureDeletedAsync();
            await db.Database.EnsureCreatedAsync();

            if (!db.Database.GetMigrations().Any())
            {
                await db.Database.MigrateAsync();
            }

            await IdentitySeeder.SeedAsync(services);
        }).RequireAuthorization("Admin", "admin");
    }
}
