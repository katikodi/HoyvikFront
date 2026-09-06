using System.Security.Claims;
using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

internal sealed class MeEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapGet("/auth/me", Get);

    static async Task<IResult> Get(ClaimsPrincipal principal, UserManager<ApplicationUser> userManager)
    {
        var user = await userManager.GetUserAsync(principal);

        if (user is null)
        {
            return Results.Ok(null);
        }

        var roles = await userManager.GetRolesAsync(user);

        return Results.Ok(new
        {
            user.FullName,
            user.Id,
            user.UserName,
            user.Email,
            roles
        });
    }
}
