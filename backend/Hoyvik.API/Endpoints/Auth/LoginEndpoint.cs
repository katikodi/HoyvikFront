using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;
using static Hoyvik.API.Common.ResultExtensions;
namespace Hoyvik.API.Endpoints.Auth;

internal sealed class LoginEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/auth/login", Login)
            .RequireRateLimiting("login-attempts");
    }

    static async Task<IResult> Login(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null)
            return Unauthorized("Auth:InvalidCredentials", "Invalid email or password.");

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            if (result.IsNotAllowed)
                return Unauthorized("Auth:EmailNotConfirmed", "Please confirm your email before logging in.");

            if (result.IsLockedOut)
                return Unauthorized("Auth:LockedOut", "Account locked out. Try again later.");

            return Unauthorized("Auth:InvalidCredentials", "Invalid email or password.");
        }

        await signInManager.SignInAsync(user, isPersistent: true);

        return Results.NoContent();
    }

    internal sealed record LoginRequest(string Email, string Password);
}