using Hoyvik.API.Data;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

public class PasswordEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/auth/forgotten-password", ForgotPassword);
        app.MapPost("/auth/change-password", ChangePassword).RequireAuthorization(Roles.USER);
    }


    static async Task<IResult> ChangePassword(
        ChangePasswordRequest request,
        HttpContext context,
        Database db,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        var user = await userManager.GetUserAsync(context.User);

        if(user is null)
        {
            return Results.BadRequest();
        }


        if (!request.NewPassword.Equals(request.ConfirmPassword))
        {
            return Results.BadRequest(new {
                error = "password_mismatch",
                message = "Your new password and confirm passwords must be the same."
            });
        }


        var results = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.ConfirmPassword);

        if (results.Succeeded)
        {
            await signInManager.RefreshSignInAsync(user);
            return Results.Ok();
        }

        var errors = results.Errors.Select(x => {
            return new {
                error = x.Code,
                message = x.Description
            };
        }).ToList();

        return Results.BadRequest(errors);
    }

    static async Task<IResult> ForgotPassword(
        ForgotPasswordRequest request,
        IEmailService emailService)
    {


        return Results.Ok();
    }
}


record ChangePasswordRequest(string CurrentPassword, string NewPassword, string ConfirmPassword);

record ForgotPasswordRequest(string Email);