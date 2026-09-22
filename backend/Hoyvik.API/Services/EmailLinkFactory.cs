using Microsoft.AspNetCore.WebUtilities;

namespace Hoyvik.API.Services;

public class EmailLinkFactory(IHttpContextAccessor httpContextAccessor)
{
    public string CreateVerifyEmailLink(string userId, string token)
    {
        var request = httpContextAccessor.HttpContext!.Request;

        var baseUrl = $"{request.Scheme}://{request.Host}";

        return QueryHelpers.AddQueryString(
            $"{baseUrl}/verify-email",
            new Dictionary<string, string?>
            {
                ["userId"] = userId,
                ["token"] = token
            });
    }

    public string CreatePasswordResetLink(string token)
    {
        var request = httpContextAccessor.HttpContext!.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";

        return QueryHelpers.AddQueryString(
            $"{baseUrl}/reset-password",
            new Dictionary<string, string?> {
                ["token"] = token
            });
    }
}