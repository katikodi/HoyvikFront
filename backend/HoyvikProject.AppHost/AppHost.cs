using Aspire.Hosting.Docker.Resources.ServiceNodes;
using Projects;

var builder = DistributedApplication.CreateBuilder(args);


var env = builder.AddDockerComposeEnvironment("env");
var stripeSecretKey = builder.AddParameter("stripe-secret-key", secret: true);
var stripeWebhookKey = builder.AddParameter("stripe-webhook-key", secret: true);
var resendKey = builder.AddParameter("resend-api-key", secret: true);

env.ConfigureComposeFile(compose =>
{
    compose.AddVolume(new Volume { Name = "backend_uploads" });
});



var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume("hoyvik_data")
    .WithPgWeb(x => x.WithLifetime(ContainerLifetime.Persistent))
    .WithEndpoint(targetPort: 5432, port: 5432, name: "postgres")
    //.WithHttpEndpoint(port: 5400, targetPort: 5400)
    .WithLifetime(ContainerLifetime.Persistent);

var db = postgres.AddDatabase("database", "hoyvika");

//var migrations = builder.AddProject<Hoyvik_MigrationService>("migrations")
//    .WithReference(db)
//    .WaitFor(db);

var api = builder.AddProject<Hoyvik_API>("backend")
    .WithEnvironment("Stripe__SecretKey", stripeSecretKey)
    .WithEnvironment("Resend__ApiKey", resendKey)
    .WithEnvironment("Stripe__Webhook", stripeWebhookKey)
    .WithReference(db)
    .WaitFor(db)
    //.WithReference(migrations)
    //.WaitForCompletion(migrations)
    .WithExternalHttpEndpoints()
    .PublishAsDockerComposeService((resource, service) =>
    {
        service.AddVolume(new Volume
        {
            Name = "backend_uploads",
            Type = "volume",
            Source = "backend_uploads",
            Target = "/app/wwwroot/uploads"
        });
        service.Name = "backend";
    });

var caddy = builder
    .AddContainer("caddy", "caddy", "2")
    .WithEntrypoint("/usr/bin/caddy")
    .WithArgs(
        "reverse-proxy",
        "--from", "hoyvik.home.arpa",
        "--to", "backend:8080",
        "--internal-certs")
    .WithVolume("caddy_data", "/data")
    .WithVolume("caddy_config", "/config")
    .WithHttpEndpoint(port: 80, targetPort: 80)
    .WithHttpsEndpoint(port: 443, targetPort: 443)
    .PublishAsDockerComposeService((resource, service) =>
    {
        service.Ports.Add("80:80");
        service.Ports.Add("443:443");
    });




var frontend = builder
   .AddViteApp("frontend", "../../frontend")
   .WithHttpEndpoint(port: 54131, name: "http")
   .WithReference(api)
   .WaitFor(api);


//api.PublishWithContainerFiles(frontend, "wwwroot");

builder.Build().Run();
