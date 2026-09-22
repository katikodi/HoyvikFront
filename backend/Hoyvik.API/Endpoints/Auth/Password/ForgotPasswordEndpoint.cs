using Hoyvik.API.Data;
using Hoyvik.API.Services;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Endpoints.Auth.Password;

record ForgotPasswordRequest(string Email);
public class ForgotPasswordEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/auth/forgot-password", ForgotPassword)
            .RequireRateLimiting("password-reset");
    }
    static async Task<IResult> ForgotPassword(
        ForgotPasswordRequest request,
        IEmailService emailService,
        UserManager<ApplicationUser> userManager,
        EmailLinkFactory linkFactory,
        CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is not null && await userManager.IsEmailConfirmedAsync(user))
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var link = linkFactory.CreatePasswordResetLink(token);



            await emailService.Send(
                "elias96.kodehode@gmail.com",
                "Password Reset",
                $"""
                <h1>Password Reset</h1>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    <a href="{link}">Reset your password</a>
                </p>

                <p>
                    If you did not request this, you can safely ignore this email.
                </p>
                """,
                ct);
        }

        return Results.Ok(new
        {
            message =
                "If an account exists for that email address, " +
                "a password reset link has been sent."
        });
    }
}
