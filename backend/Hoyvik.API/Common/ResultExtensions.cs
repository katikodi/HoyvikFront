using Microsoft.AspNetCore.Mvc;
namespace Hoyvik.API.Common;

public static class ResultExtensions
{
    public static IResult ToHttpResult(this Result result) =>
        result.IsSuccess ? TypedResults.Ok() : MapError(result.Error);

    public static IResult ToHttpResult<T>(this Result<T> result) =>
        result.IsSuccess ? TypedResults.Ok(result.Value) : MapError(result.Error);

    public static IResult Unauthorized(string code, string description) =>
        Result.Failure(Error.Unauthorized(code, description)).ToHttpResult();

    public static IResult NotFound(string code, string description) =>
        Result.Failure(Error.NotFound(code, description)).ToHttpResult();

    public static IResult Conflict(string code, string description) =>
        Result.Failure(Error.Conflict(code, description)).ToHttpResult();

    public static IResult ValidationFailure(string code, string description) =>
        Result.Failure(Error.Validation(code, description)).ToHttpResult();

    private static IResult MapFailure(Result result)
    {
        if (result.Error.Type == ErrorType.Validation)
        {
            var validationErrors = result.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.Description).ToArray()
                );

            return TypedResults.ValidationProblem(validationErrors);
        }

        return MapError(result.Error);
    }

    private static IResult MapError(Error error) => error.Type switch
    {
        ErrorType.Validation => TypedResults.BadRequest(new ProblemDetails
        {
            Title = error.Code,
            Detail = error.Description,
            Status = StatusCodes.Status400BadRequest
        }),
        ErrorType.NotFound => TypedResults.NotFound(new ProblemDetails
        {
            Title = error.Code,
            Detail = error.Description,
            Status = StatusCodes.Status404NotFound
        }),
        ErrorType.Conflict => TypedResults.Conflict(new ProblemDetails
        {
            Title = error.Code,
            Detail = error.Description,
            Status = StatusCodes.Status409Conflict
        }),
        ErrorType.Unauthorized => TypedResults.Json(new ProblemDetails
        {
            Title = error.Code,
            Detail = error.Description,
            Status = StatusCodes.Status401Unauthorized
        }, statusCode: StatusCodes.Status401Unauthorized),
        _ => TypedResults.Problem(
            title: error.Code,
            detail: error.Description,
            statusCode: StatusCodes.Status500InternalServerError)
    };
}