using System.ComponentModel.DataAnnotations;
using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;

namespace Hoyvik.API.Endpoints.User;

public class ProfileEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPatch("/auth/me/", UpdateProfile)
            .RequireAuthorization(Roles.USER);
    }


    static async Task<IResult> UpdateProfile(
        UpdateProfileRequest request,
        HttpContext context,
        IMemoryCache cache,
        UserManager<ApplicationUser> userManager)
    {
        var user = await userManager.GetUserAsync(context.User);

        if(user is null)
        {
            return Results.Unauthorized();
        }

        if (request.FirstName is not null) {
            user.FirstName = request.FirstName;
        }
        if (request.LastName is not null) {
            user.LastName = request.LastName;
        }

        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return Results.BadRequest(result.Errors);
        }

        var userId = userManager.GetUserId(context.User);

        if(userId is not null)
        {
            //invalidate the cache so the user sees the updated state right away
            cache.Remove($"auth:me:{userId}");
        }
        return Results.NoContent();
    }
}

record UpdateProfileRequest(
    [property: MaxLength(100)]string? FirstName,
    [property: MaxLength(100)]string? LastName
);
