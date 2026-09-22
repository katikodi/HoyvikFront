namespace Hoyvik.API.Endpoints.Auth.Password;

public class ResetPasswordEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/auth/reset-password", ResetPassword);
    }

    static async Task<IResult> ResetPassword(

        ) 
    {
        return Results.Ok();
    }
}
