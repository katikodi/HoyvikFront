using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

internal sealed class RegisterEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app) => app.MapPost("/auth/register", Register);


    static async Task<IResult> Register(RegisterRequest request, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
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

        var result = await userManager.CreateAsync(
            user,
            request.Password);

        if (!result.Succeeded)
        {
            return Results.BadRequest(
                result.Errors.Select(x => x.Description));
        }

        var roleResult = await userManager.AddToRoleAsync(user, "user");

        if (!roleResult.Succeeded)
        {
            return Results.BadRequest(
                roleResult.Errors.Select(x => x.Description));
        }

        await signInManager.SignInAsync(user, true);

        return Results.Ok();

    }

    internal sealed record RegisterRequest(
        string FullName,
        string Email,
        string Password,
        string ConfirmPassword);
}
