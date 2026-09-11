using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

internal sealed class LoginEndpoint : IEndpoint
{

    //CURL: curl.exe -c cookies.txt -X POST https://localhost:7170/api/auth/login -d '{\"email\":\"admin@admin.com\",\"password\":\"admin@admin.com\"}' -H "Content-Type: application/json"
    public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/auth/login", Login);


    static async Task<IResult> Login(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null)
            return Results.BadRequest(new { error = "invalid_credentials", message = "Invalid email or password." });

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            if (result.IsNotAllowed)
                return Results.BadRequest(new { error = "email_not_confirmed", message = "Please confirm your email before logging in." });

            if (result.IsLockedOut)
                return Results.BadRequest(new { error = "locked_out", message = "Account locked out. Try again later." });

            return Results.BadRequest(new { error = "invalid_credentials", message = "Invalid email or password." });
        }

        await signInManager.SignInAsync(user, isPersistent: true);

        return Results.NoContent();
    }

    internal sealed record LoginRequest(string Email, string Password);
}
