using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddAuthorizationBuilder()
	.AddDefaultPolicy("Guest", p => p.RequireRole("guest"))
	.AddPolicy("User", p => p.RequireRole("user"))
	.AddPolicy("Admin", p => p.RequireRole("admin"));


StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"] ?? throw new Exception("Stripe:SecretKey is missing");


builder.Services
	.AddIdentity<ApplicationUser, IdentityRole>(x =>
	{
		x.Password.RequireDigit = false;
		x.Password.RequireUppercase = false;
		//x.Password.RequiredLength = 0;
		x.Password.RequireLowercase = false;
		x.Password.RequireNonAlphanumeric = false;
	})
	.AddDefaultTokenProviders()
	.AddEntityFrameworkStores<Database>();


builder.Services.RegisterEndpoints();

builder.AddNpgsqlDbContext<Database>("database");


builder.Services.ConfigureApplicationCookie(x =>
{
	x.Cookie.HttpOnly = true;
	x.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
	x.Cookie.SameSite = SameSiteMode.Lax;

	x.Events.OnRedirectToLogin = ctx =>
	{
		ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
		return Task.CompletedTask;
	};

	x.Events.OnRedirectToAccessDenied = ctx =>
	{
		ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
		return Task.CompletedTask;
	};

});



var app = builder.Build();



app.MapDefaultEndpoints();

if(app.Environment.IsDevelopment())
{
	app.MapOpenApi();

	using var scope = app.Services.CreateScope();
	var db = scope.ServiceProvider.GetRequiredService<Database>();

	db.Database.EnsureDeleted();
	db.Database.EnsureCreated();

	if (!db.Database.GetMigrations().Any())
		await db.Database.MigrateAsync();

	await IdentitySeeder.SeedAsync(scope.ServiceProvider);
}

if(app.Environment.IsProduction())
	app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapApiEndpoints();
app.UseFileServer(new FileServerOptions {
	RequestPath = "/content",
	EnableDirectoryBrowsing = true,
	EnableDefaultFiles = true
});

app.Run();

