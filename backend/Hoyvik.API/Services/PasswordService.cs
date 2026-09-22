using System.Security.Claims;
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
        ClaimsPrincipal claimsPrincipal,
        string currentPassword,
        string newPassword)
    {
        var user = await userManager.GetUserAsync(claimsPrincipal);

        if (user is null)
        {
            return Result.Failure(error: new("Auth:UserNotFound", "how did u get here?", ErrorType.Validation));
        }

        var results = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);

        if (!results.Succeeded)
        {
            return results.ToResult();
        }

        await signInManager.RefreshSignInAsync(user);

        return Result.Success();
    }
}
