using Microsoft.Extensions.Configuration;
using Projects;

var builder = DistributedApplication.CreateBuilder(args);



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

var api = builder.AddProject<Hoyvik_API>("backend")
	.WithReference(db)
	.WaitFor(db)
	.WithReference(migrations)
	.WaitForCompletion(migrations)
	.WithExternalHttpEndpoints();


var frontend = builder
	.AddViteApp("frontend", "../../frontend")
	.WithHttpEndpoint(port: 54131, name: "http")
	.WithReference(api)
	.WaitFor(api);


builder.Build().Run();
