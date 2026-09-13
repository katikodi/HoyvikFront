using Microsoft.AspNetCore.WebUtilities;

namespace Hoyvik.API.Services;

public class EmailVerificationLinkFactory(IHttpContextAccessor httpContextAccessor)
{
    public string Create(string userId, string token)
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
}