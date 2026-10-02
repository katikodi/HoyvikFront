using System.Diagnostics;
using Aspire.Hosting.Docker.Resources.ComposeNodes;
using Aspire.Hosting.Docker.Resources.ServiceNodes;

using Microsoft.Extensions.Hosting;
using Projects;

var builder = DistributedApplication.CreateBuilder(args);

#pragma warning disable ASPIRECOMPUTE003

var registry = builder.AddContainerRegistry(
    "ghcr",
    "ghcr.io",
    "kodehode-2026/hoyvikfront"
);

if (builder.Environment.IsDevelopment())
{
    var dockerHost = Environment.GetEnvironmentVariable("DOCKER_HOST");
    var dockerContext = RunCommand("docker", "context show");
    if (dockerContext != "default")
    {
        throw new InvalidOperationException(
            $"DEVELOPMENT BLOCKED: Docker context is '{dockerContext}'. " +
            "Development requires the 'default' Docker context. \n Please run the command 'docker context use default'");
    }

    if (!string.IsNullOrWhiteSpace(dockerHost))
    {
        throw new InvalidOperationException(
            $"DEVELOPMENT BLOCKED: DOCKER_HOST is set to '{dockerHost}'.");
    }
}


var stripeSecretKey = builder.AddParameter("stripe-secret-key", secret: true);
var stripeWebhookKey = builder.AddParameter("stripe-webhook-key", secret: true);
var resendKey = builder.AddParameter("resend-api-key", secret: true);

var env = builder.AddDockerComposeEnvironment("env")
    .WithDashboard(true);


env.ConfigureComposeFile(compose =>
{
    compose.Name = "hoyvik";

    compose.AddVolume(new Volume
    {
        Name = "backend_uploads",
        External = true
    });


    var postgresVolume = compose.Volumes["hoyvik_data"];
    postgresVolume.External = true;
    postgresVolume.Driver = null;

    compose.AddNetwork(new Network
    {
        Name = "web",
        Driver = "bridge",
        External = true
    });

    var dashboard = compose.Services["env-dashboard"];
    dashboard.Ports.Clear();
    dashboard.Ports.Add("127.0.0.1:18888:18888");

    var postgresService = compose.Services["postgres"];
    postgresService.Ports.Clear();
    postgresService.Ports.Add("127.0.0.1:5432:5432");
});



var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume("hoyvik_data")
    .WithPgWeb(x => x.WithLifetime(ContainerLifetime.Persistent))
    .WithEndpoint(targetPort: 5432, port: 5432, name: "postgres")
    .WithLifetime(ContainerLifetime.Persistent);

var db = postgres.AddDatabase("database", "hoyvika");



var api = builder.AddProject<Hoyvik_API>("backend")
    .WithEnvironment("Stripe__SecretKey", stripeSecretKey)
    .WithEnvironment("Resend__ApiKey", resendKey)
    .WithEnvironment("Stripe__WebhookSecret", stripeWebhookKey)
    .WithReference(db)
    .WaitFor(db)
    //.WithReference(migrations)
    //.WaitForCompletion(migrations)
    //.WithExternalHttpEndpoints()
    //.WithHttpEndpoint(targetPort: 5127,  name: "http")
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
        service.Networks = ["aspire", "web"];
        service.Ports.Clear();
    }).WithContainerRegistry(registry);

if (builder.Environment.IsDevelopment())
{
    var migrations = builder.AddProject<Hoyvik_MigrationService>("migrations")
       .WithReference(db)
       .WaitFor(db);

    api.WithReference(migrations);
    api.WaitForCompletion(migrations);
}


if (builder.Environment.IsDevelopment())
{
    var frontend = builder
       .AddViteApp("frontend", "../../frontend")
       .WithHttpEndpoint(port: 54131, name: "http")
       .WithReference(api)
       .WaitFor(api);
}

builder.Build().Run();









static string RunCommand(string fileName, string arguments)
{
    using var process = Process.Start(new ProcessStartInfo
    {
        FileName = fileName,
        Arguments = arguments,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    });

    if (process is null)
        throw new InvalidOperationException("Could not start Docker.");

    var output = process.StandardOutput.ReadToEnd().Trim();
    process.WaitForExit();

    if (process.ExitCode != 0)
        throw new InvalidOperationException("Could not determine Docker context.");

    return output;
}