namespace Hoyvik.API.Endpoints;

internal interface IEndpoint
{
    void MapEndpoint(RouteGroupBuilder app);
}


internal static class EndpointDiscoveryExtensions
{

    internal static IServiceCollection RegisterEndpoints(this IServiceCollection services) => services
        .Scan(scan => scan
        .FromAssemblyOf<IEndpoint>()
        .AddClasses(x => x.AssignableTo<IEndpoint>(), publicOnly: false)
        .AsImplementedInterfaces()
        .WithSingletonLifetime());

    internal static WebApplication MapApiEndpoints(this WebApplication app, string prefix = "/api")
    {
        var api = app.MapGroup(prefix);


        using var scope = app.Services.CreateScope();

        var logger = scope.ServiceProvider
            .GetRequiredService<ILoggerFactory>()
            .CreateLogger("EndpointRegistration");

        var endpoints = scope.ServiceProvider.GetServices<IEndpoint>();

        foreach (var endpoint in endpoints)
        {
            endpoint.MapEndpoint(api);
            logger?.LogInformation("Registered {endpoint}", endpoint.GetType().Name);
        }
        return app;
    }
}
