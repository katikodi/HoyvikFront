using System.Security.Claims;
using Hoyvik.API;
using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Hoyvik.API.Services.Abstractions;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.AddApplication();
var app = builder.Build();


#region Middleware

app.UseCors("frontend");
app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseExceptionHandler("/error");
    app.UseDeveloperExceptionPage();
    using var scope = app.Services.CreateScope();
    await IdentitySeeder.SeedAsync(scope.ServiceProvider);
}

if (app.Environment.IsProduction())
    app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseStatusCodePages();

app.MapApiEndpoints();
app.MapGet("/test-email", async (
    IEmailService emailService,
    CancellationToken ct) =>
{
    await emailService.Send(
        "elias96.kodehode@gmail.com",
        "Hoyvik test email",
        """
        <h1>Hello!</h1>
        <p>This email was sent from Hoyvik.</p>
        """,
        ct);

    return Results.Ok();
});

Directory.CreateDirectory(Path.Combine(app.Environment.WebRootPath!, "uploads"));

app.UseFileServer(new FileServerOptions
{
    RequestPath = "/content/uploads",
    EnableDirectoryBrowsing = true,
    EnableDefaultFiles = true,
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath, "uploads")),

});


app.Run();
#endregion

//assembly marker
internal partial class Program;