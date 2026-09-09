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
            return Results.Unauthorized();

        if (!await userManager.CheckPasswordAsync(user, request.Password))
            return Results.Unauthorized();



        await userManager.AddToRoleAsync(user, Roles.USER);
        await signInManager.SignInAsync(user, true);

        return Results.NoContent();
    }

    internal sealed record LoginRequest(string Email, string Password);
}
