using Hoyvik.API.Common;
using Hoyvik.API.Services.Abstractions;

using static Hoyvik.API.Common.ResultExtensions;
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
        if (request.NewPassword != request.ConfirmPassword)
        {
            return ValidationFailure("Auth:PasswordMismatch", "Passwords do not match.");
        }
        var result = await passwordService.ChangePasswordAsync(context.User, request.CurrentPassword, request.NewPassword);
        return result.ToHttpResult();
    }


}

