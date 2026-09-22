using Hoyvik.API.Common;
using Hoyvik.API.Data;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth.Password;

record ChangePasswordRequest(string CurrentPassword, string NewPassword, string ConfirmPassword);

public class ChangePasswordEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/auth/change-password", ChangePassword)
            .RequireAuthorization(Roles.USER);
    }


    static async Task<IResult> ChangePassword(
        ChangePasswordRequest request,
        HttpContext context,
        IPasswordService passwordService)
    {
        var user = await userManager.GetUserAsync(context.User);

        if(user is null)
        {
            return Results.Unauthorized();
        }


        if (!request.NewPassword.Equals(request.ConfirmPassword))
        {
            return Results.BadRequest(new {
                error = "password_mismatch",
                message = "Your new password and confirm passwords must be the same."
            });
        }



        await passwordService.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        var results = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if (!results.Succeeded)
        {



            return Results.BadRequest(errors);

        }
        await signInManager.RefreshSignInAsync(user);
        return Results.Ok();
    }


}



