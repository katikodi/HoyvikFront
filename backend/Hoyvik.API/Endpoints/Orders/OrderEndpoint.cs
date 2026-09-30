namespace Hoyvik.API.Endpoints.Orders;

public class OrderEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        var group = app.MapGroup("/orders")
            .RequireAuthorization(Roles.USER);
    }
}
