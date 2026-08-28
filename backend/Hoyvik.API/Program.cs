using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Hoyvik.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options => {
	options.AddPolicy("http://localhost:54131", p => {
		p.WithOrigins("")
		.AllowAnyHeader()
		.AllowAnyMethod().AllowCredentials();
	});
});
builder.Services.AddAuthorizationBuilder()
	.AddDefaultPolicy("Guest", p => p.RequireRole("guest"))
	.AddPolicy("User", p => p.RequireRole("user"))
	.AddPolicy("Admin", p => p.RequireRole("admin"));


builder.Services.AddScoped<ImageUploaderService>();

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
	x.Cookie.SameSite = SameSiteMode.Lax;
    x.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.None
        : CookieSecurePolicy.Always;


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


Directory.CreateDirectory(Path.Combine(app.Environment.WebRootPath!, "uploads"));

app.UseFileServer(new FileServerOptions
{
	RequestPath = "/content/uploads",
	EnableDirectoryBrowsing = true,
	EnableDefaultFiles = true,
	FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath, "uploads")),

});


app.Run();

