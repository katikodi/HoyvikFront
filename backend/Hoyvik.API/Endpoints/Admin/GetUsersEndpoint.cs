using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Admin;

public class GetUsersEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) 
        => app.MapGet("/admin/users", GetUsers)
        .RequireAuthorization("admin", "Admin");


    async Task<IResult> GetUsers(Database db)
    {
        var users = await db.Users.ToListAsync();

        return Results.Ok(new {
            users = users.Select(x => new {
                x.Id,
                x.UserName,
                x.Email,
                x.PhoneNumber,
            }).ToList()
        });
    }
}
