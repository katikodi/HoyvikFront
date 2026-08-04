var builder = DistributedApplication.CreateBuilder(args);

var db = builder
	.AddPostgres("postgres")
	.WithDataVolume("hoyvik_data")
	.WithPgAdmin()
	.AddDatabase("database", "hoyvika");


var api = builder.AddProject<Projects.Hoyvik_API>("backend")
	.WithReference(db)
	.WithExternalHttpEndpoints();


var frontend = builder
	.AddViteApp("frontend", "../../frontend")
	.WithHttpEndpoint(port: 54131, name: "http")
	.WithReference(api)
	.WaitFor(api);

builder.Build().Run();
