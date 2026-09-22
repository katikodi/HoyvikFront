using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Common;

public static class IdentityResultExtensions
{
    public static Result ToResult(this IdentityResult identityResult)
    {
        if (identityResult.Succeeded)
            return Result.Success();

        var errors = identityResult.Errors
            .Select(x => Error.Validation(x.Code, x.Description))
            .ToArray();

        return Result.Failure(errors);
    }
}
