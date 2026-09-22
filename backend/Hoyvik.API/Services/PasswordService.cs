using Hoyvik.API.Common;
using Hoyvik.API.Data;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Services;

public class PasswordService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager
    ) : IPasswordService
{
    public async Task<Result> ChangePasswordAsync(
        ApplicationUser user,
        string currentPassword,
        string newPassword)
    {
        var results = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);

        if (!results.Succeeded)
        {

            var errors = results.Errors.Select(x =>
            {
                return new
                {
                    error = x.Code,
                    message = x.Description
                };
            });

            return Result.Failure(new Error { 

            });
        }

        await signInManager.RefreshSignInAsync(user);

        return Result.Success();
    }
}
