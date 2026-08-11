var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder
	.AddPostgres("postgres")
	.WithDataVolume("hoyvik_data")
	.WithPgAdmin()
	.WithHttpEndpoint(port: 5432, targetPort: 5432)
	.WithLifetime(ContainerLifetime.Persistent);

var db = postgres.AddDatabase("database", "hoyvika");


var api = builder.AddProject<Projects.Hoyvik_API>("backend")
	.WithReference(db)
	.WaitFor(db)
	.WithExternalHttpEndpoints();


var frontend = builder
	.AddViteApp("frontend", "../../frontend")
	.WithHttpEndpoint(port: 54131, name: "http")
	.WithReference(api)
	.WaitFor(api);

builder.Build().Run();
