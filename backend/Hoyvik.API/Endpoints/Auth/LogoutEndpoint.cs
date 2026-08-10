using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

public class LogoutEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => 
        app.MapPost("/auth/logout", Logout);


    async Task<IResult> Logout(SignInManager<ApplicationUser> signInManager)
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    }
}
