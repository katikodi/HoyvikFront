using Hoyvik.API.Data;
using Hoyvik.API.Services;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth;

internal sealed class RegisterEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/auth/register", Register).WithName("Register");
        app.MapGet("/auth/verify-email", VerifyEmail).WithName("VerifyEmail");
        //app.MapPost("/auth/resend-verification", null);
    }

    static async Task<IResult> Register(
        RegisterRequest request,
        IEmailService emailService,
        EmailVerificationLinkFactory linkFactory,
        UserManager<ApplicationUser> userManager, 
        SignInManager<ApplicationUser> signInManager,
        CancellationToken ct = default)
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

        var roleResult = await userManager.AddToRoleAsync(user, Roles.USER);

        if (!roleResult.Succeeded)
        {
            return Results.BadRequest(
                roleResult.Errors.Select(x => x.Description));
        }

        var emailVerificationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);


        var link = linkFactory.Create(user.Id,emailVerificationToken);

        await emailService.Send(
            user.Email, 
            "Verify Email",
            $"""<a href="{link}">Click here to verify</a>""",
        ct);

        //await signInManager.SignInAsync(user, true);

        return Results.Ok();

    }


    static async Task<IResult> VerifyEmail(
        string userId, 
        string token,
        UserManager<ApplicationUser> userManager)
    {
        var user = await userManager.FindByIdAsync(userId);


        if (user is null)
        {
            return Results.BadRequest("Invalid verification link.");
        }

        if (user.EmailConfirmed)
        {
            return Results.Ok("Email is already verified.");
        }

        var result = await userManager.ConfirmEmailAsync(user, token);

        if (!result.Succeeded)
        {
            return Results.BadRequest(
                result.Errors.Select(x => x.Description));
        }

        return Results.Ok("Email verified successfully.");
    }


    internal sealed record RegisterRequest(
        string FullName,
        string Email,
        string Password,
        string ConfirmPassword);
}
