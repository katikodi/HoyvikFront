using System.Security.Claims;

namespace Hoyvik.API.Services.Abstractions;

public interface IPasswordService
{
    Task<Result> ChangePasswordAsync(
        ClaimsPrincipal user,
        string currentPassword,
        string newPassword);
}