using Hoyvik.API;
using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Hoyvik.API.Services.Abstractions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddApplication();




#region Middleware
var app = builder.Build();


app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseExceptionHandler("/error");
    app.UseDeveloperExceptionPage();
}

app.UseDefaultFiles();
app.UseStaticFiles();


// app.UseCors();
app.MapDefaultEndpoints();


using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<Database>();
await db.Database.MigrateAsync();
await IdentitySeeder.SeedAsync(scope.ServiceProvider);


//if (app.Environment.IsProduction())
//    app.UseHttpsRedirection();

app.UseRateLimiter();


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

//Directory.CreateDirectory(Path.Combine(app.Environment.WebRootPath!, "uploads"));

//app.UseFileServer(new FileServerOptions
//{
//    RequestPath = "/content/uploads",
//    EnableDirectoryBrowsing = true,
//    EnableDefaultFiles = true,
//    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath, "uploads")),

//});

app.MapFallbackToFile("/index.html");

app.Run();
#endregion

//assembly marker
internal partial class Program;