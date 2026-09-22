using Hoyvik.API.Common;
using Hoyvik.API.Data;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Services.Abstractions;

public interface IPasswordService
{
    Task<Result> ChangePasswordAsync(
        ApplicationUser user,
        string currentPassword,
        string newPassword);
}