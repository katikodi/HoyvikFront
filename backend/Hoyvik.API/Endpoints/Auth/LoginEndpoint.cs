using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

public class LoginEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/auth/login", Login);


    async Task<IResult> Login(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is not null)
        {
            await signInManager.SignInAsync(user, true);
            return Results.Ok();
        }


        return Results.BadRequest();
    }

    record LoginRequest(
		string Email,
		string Password);
}
