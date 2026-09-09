using System.Security.Claims;
using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;

namespace Hoyvik.API.Endpoints.Auth;

internal sealed class MeEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapGet("/auth/me", Get);

    static async Task<IResult> Get(ClaimsPrincipal principal, IMemoryCache cache, UserManager<ApplicationUser> userManager, ILogger<MeEndpoint> logger)
    {
        var userId = userManager.GetUserId(principal);

        if (userId is null)
            return Results.Unauthorized();

        var key = $"auth:me:{userId}";

        if(cache.TryGetValue(key, out MeResponse? value))
        {
            logger.LogInformation("Auth/me cache hit for user {UserId}", userId);
            return Results.Ok(value);
        }
        logger.LogInformation("Auth/me cache miss for user {UserId}", userId);


        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
            return Results.Unauthorized();

        var roles = await userManager.GetRolesAsync(user);

        var me = new MeResponse(
            user.FullName,
            user.Id, 
            user.UserName, 
            user.Email, 
            [..roles]
            );

        cache.Set(key, me, new MemoryCacheEntryOptions {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        });

        return Results.Ok(me);

        //var result = await cache.GetOrCreateAsync($"auth:me:{userId}", 
        //    async entry => {
        //        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

        //        var user = await userManager.FindByIdAsync(userId);

        //        if(user is null)
        //            return null;
        //        var roles = await userManager.GetRolesAsync(user);

        //        return Results.Ok(new
        //        {
        //            user.FullName,
        //            user.Id,
        //            user.UserName,
        //            user.Email,
        //            roles
        //        });
        //    });

        //return result ?? Results.BadRequest();
    }

    record MeResponse(
        string FullName,
        string Id,
        string UserName,
        string Email,
        List<string> Roles
        );

    //static async Task<IResult> Get(ClaimsPrincipal principal, IMemoryCache cache,UserManager<ApplicationUser> userManager)
    //{
    //    var user = await userManager.GetUserAsync(principal);

    //    if (user is null)
    //    {
    //        return Results.Ok(null);
    //    }

    //    var roles = await userManager.GetRolesAsync(user);


    //    return Results.Ok(new
    //    {
    //        user.FullName,
    //        user.Id,
    //        user.UserName,
    //        user.Email,
    //        roles
    //    });
    //}
}
