using Hoyvik.API.Data;
using Hoyvik.MigrationService;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddHostedService<Worker>();
builder.Services.AddOpenTelemetry().WithTracing(tracing => tracing.AddSource(Worker.ActivitySourceName));
builder.AddNpgsqlDbContext<Database>("database");


var host = builder.Build();
host.Run();
