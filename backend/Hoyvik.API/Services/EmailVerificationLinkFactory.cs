namespace Hoyvik.API.Services;

public class EmailVerificationLinkFactory(IHttpContextAccessor httpContextAccessor, LinkGenerator linkGenerator)
{
    public string Create(string userId, string token)
    {
        string? verificationLink = linkGenerator.GetUriByName(
            httpContextAccessor.HttpContext!,
            "VerifyEmail",
            new {  userId,token}
            );

        return verificationLink ?? throw new Exception("could not create email verification token");
    }
}
