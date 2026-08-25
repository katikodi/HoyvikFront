using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API;

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
            //using var scope = app.Services.CreateScope();
            //var db = scope.ServiceProvider.GetRequiredService<Database>();

            //db.Database.EnsureDeleted();
            //db.Database.EnsureCreated();

            //if (!db.Database.GetMigrations().Any())
            //	await db.Database.MigrateAsync();

            //await IdentitySeeder.SeedAsync(scope.ServiceProvider);
        });
    }
}
