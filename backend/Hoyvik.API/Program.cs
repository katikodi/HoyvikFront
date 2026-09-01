using Hoyvik.API;
using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.AddApplication();






var app = builder.Build();



app.UseCors("frontend");
app.MapDefaultEndpoints();

if(app.Environment.IsDevelopment())
{
	app.MapOpenApi();
	app.UseExceptionHandler("/error");
	app.UseDeveloperExceptionPage();
	using var scope = app.Services.CreateScope();
	await IdentitySeeder.SeedAsync(scope.ServiceProvider);
}

if(app.Environment.IsProduction())
	app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseStatusCodePages();

app.MapApiEndpoints();


Directory.CreateDirectory(Path.Combine(app.Environment.WebRootPath!, "uploads"));

app.UseFileServer(new FileServerOptions
{
	RequestPath = "/content/uploads",
	EnableDirectoryBrowsing = true,
	EnableDefaultFiles = true,
	FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath, "uploads")),

});


app.Run();

