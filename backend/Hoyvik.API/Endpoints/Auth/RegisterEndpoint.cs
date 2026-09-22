using Hoyvik.API.Common;
using Hoyvik.API.Data;
using Hoyvik.API.Services;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity;
using static Hoyvik.API.Common.ResultExtensions;
namespace Hoyvik.API.Endpoints.Auth;

internal sealed class RegisterEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/auth/register", Register).WithName("Register");

        app.MapGet("/auth/verify-email", VerifyEmail).WithName("VerifyEmail");

        app.MapPost("/auth/resend-verification", ResendVerification)
            .RequireRateLimiting("email-sending")
            .WithName("ResendVerification");
    }

    static async Task<IResult> Register(
        RegisterRequest request,
        IEmailService emailService,
        EmailLinkFactory linkFactory,
        UserManager<ApplicationUser> userManager,
        CancellationToken ct = default)
    {
        if (request.Password != request.ConfirmPassword)
        {
            return ValidationFailure("Auth:PasswordMismatch", "Passwords do not match.");
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
            return result.ToResult().ToHttpResult();
        }

        var roleResult = await userManager.AddToRoleAsync(user, Roles.USER);

        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            return roleResult.ToResult().ToHttpResult();
        }

        var emailVerificationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);


        var link = linkFactory.CreateVerifyEmailLink(user.Id, emailVerificationToken);

        await emailService.Send(
            user.Email,
            "Verify Email",
            $"""<a href="{link}">Click here to verify</a>""",
        ct);

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
            return ValidationFailure("Auth:InvalidVerificationLink", "Invalid or expired verification link.");
        }

        if (user.EmailConfirmed)
        {
            return Results.Ok();
        }

        var result = await userManager.ConfirmEmailAsync(user, token);

        if (!result.Succeeded)
        {
            return ValidationFailure("Auth:InvalidVerificationLink", "Invalid or expired verification link.");
        }

        return Results.Ok();
    }

    static async Task<IResult> ResendVerification(
        ResendVerificationRequest request,
        IEmailService emailService,
        EmailLinkFactory linkFactory,
        UserManager<ApplicationUser> userManager,
        CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null || user.EmailConfirmed)
        {
            return Results.Ok();
        }


        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var link = linkFactory.CreateVerifyEmailLink(user.Id, token);

        await emailService.Send(
             user.Email!,
             "Verify Email",
             $"""<a href="{link}">Click here to verify</a>""",
             ct);

        return Results.Ok();
    }


    internal sealed record ResendVerificationRequest(string Email);
    internal sealed record RegisterRequest(
        string FullName,
        string Email,
        string Password,
        string ConfirmPassword);
}