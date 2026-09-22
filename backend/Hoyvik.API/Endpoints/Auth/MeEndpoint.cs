using System.Security.Claims;
using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using static Hoyvik.API.Common.ResultExtensions;
namespace Hoyvik.API.Endpoints.Auth;

internal sealed class MeEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapGet("/auth/me", Get);

    static async Task<IResult> Get(ClaimsPrincipal principal, IMemoryCache cache, UserManager<ApplicationUser> userManager, ILogger<MeEndpoint> logger)
    {
        var userId = userManager.GetUserId(principal);

        if (userId is null)
            return Unauthorized("Auth:Unauthorized", "You must be signed in to access this resource.");

        var key = $"auth:me:{userId}";

        if (cache.TryGetValue(key, out MeResponse? value))
        {
            logger.LogDebug("Auth/me cache hit for user {UserId}", userId);
            return Results.Ok(value);
        }
        logger.LogDebug("Auth/me cache miss for user {UserId}", userId);


        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
            return Unauthorized("Auth:Unauthorized", "You must be signed in to access this resource.");

        var roles = await userManager.GetRolesAsync(user);

        var me = new MeResponse(
            user.FullName,
            user.Id,
            user.UserName!,
            user.Email!,
            [.. roles]
            );

        cache.Set(key, me, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        });

        return Results.Ok(me);
    }

    record MeResponse(
        string FullName,
        string Id,
        string UserName,
        string Email,
        List<string> Roles
        );
}