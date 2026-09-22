using Hoyvik.API.Common;
using Hoyvik.API.Services.Abstractions;

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
            return Result.Failure(Error.Validation("PasswordMismatch", "Passwords do not match")).ToHttpResult();
        }
        var result = await passwordService.ChangePasswordAsync(context.User, request.CurrentPassword, request.NewPassword);
        return result.ToHttpResult();
    }


}

