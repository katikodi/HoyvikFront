using Projects;

var builder = DistributedApplication.CreateBuilder(args);


var stripeSecret = builder.Configuration["Stripe:SecretKey"];

#region Database
var postgres = builder
	.AddPostgres("postgres")
	.WithDataVolume("hoyvik_data")
	.WithPgAdmin()
	.WithHttpEndpoint(port: 5400, targetPort: 5400)
	.WithLifetime(ContainerLifetime.Persistent);

var db = postgres.AddDatabase("database", "hoyvika");


var migrations = builder.AddProject<Hoyvik_MigrationService>("migrations")
	.WithReference(db)
	.WaitFor(db);
#endregion


var api = builder.AddDockerfile("api", "../../")
	.WithReference(db)
	.WaitFor(db)
	.WithReference(migrations)
	.WaitForCompletion(migrations)
	.WithExternalHttpEndpoints()
	.WithEnvironment("Stripe__SecretKey", stripeSecret)
	.WithHttpEndpoint(targetPort: 8080, name: "http")
	.WithHttpsEndpoint(targetPort: 8081, name: "https");
;
//var api = builder.AddProject<Hoyvik_API>("backend")
//	.WithReference(db)
//	.WaitFor(db)
//	.WithReference(migrations)
//	.WaitForCompletion(migrations)
//	.WithExternalHttpEndpoints();


//var frontend = builder
//	.AddViteApp("frontend", "../../frontend")
//	.WithHttpEndpoint(port: 54131, name: "http")
//	.WithReference(api)
//	.WaitFor(api);
var frontend = builder
	.AddViteApp("frontend", "../../frontend")
	.WithHttpEndpoint(port: 54131, name: "http")
	.WithEnvironment("VITE_API_URL", api.GetEndpoint("http"))
	.WithEnvironment("VITE_API_URL_SECURE", api.GetEndpoint("https"))
	.WaitFor(api);

builder.Build().Run();
