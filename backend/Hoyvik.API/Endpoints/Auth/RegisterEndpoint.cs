using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

public class RegisterEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/auth/register", Register);


    async Task<IResult> Register(
        RegisterRequest request,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        if (request.Password != request.ConfirmPassword)
        {
            return Results.BadRequest();
        }


        var user = new ApplicationUser
        {
            FullName = request.FullName,
            UserName = request.Email,
            Email = request.Email,
        };

        var result = await userManager.CreateAsync(user, request.ConfirmPassword);

        if (result.Succeeded)
        {
            var roleResult = await userManager.AddToRoleAsync(user, "user");

            if (roleResult.Succeeded)
            {
                await signInManager.SignInAsync(user, true);
                return Results.Ok();
            }

            Results.BadRequest(result.Errors.Select(x => x.Description));
        }
        return Results.BadRequest(result.Errors.Select(x => x.Description));

    }

    record RegisterRequest(
        string FullName,
        string Email,
        string Password,
        string ConfirmPassword);
}
