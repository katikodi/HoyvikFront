using FluentValidation;
using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Hoyvik.API.Services;
using Hoyvik.API.Services.Abstractions;
using Hoyvik.API.Validators;
using Microsoft.AspNetCore.Identity;
using Stripe;

namespace Hoyvik.API;

public static class Startup
{

	public static void AddApplication(this WebApplicationBuilder builder)
	{

		builder.AddServiceDefaults();
		builder.Services.AddProblemDetails();

		builder.Services.AddCors(options => options.AddPolicy("frontend",
			p => p.WithOrigins("http://localhost:54131")
				.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowCredentials()));

		builder.Services.AddAuthorizationBuilder()
			.AddDefaultPolicy("Guest", p => p.RequireRole("guest"))
			.AddPolicy("User", p => p.RequireRole("user"))
			.AddPolicy("Admin", p => p.RequireRole("admin"));


		builder.Services.AddScoped<ImageUploaderService>();
		builder.Services.AddScoped<IBookingService, BookingService>();
        builder.Services.AddScoped<IStripePaymentService, StripePaymentService>();
		builder.Services.AddValidatorsFromAssemblyContaining<CreateSessionValidator>();
		builder.Services.AddHostedService<BookingExpirationService>();




		builder.Services.AddOptions<BookingConfiguration>()
			.BindConfiguration("BookingSettings")
			.ValidateDataAnnotations()
			.ValidateOnStart();

        builder.Services.AddOptions<FrontendConfiguration>()
            .BindConfiguration("Frontend")
            .ValidateDataAnnotations()
            .ValidateOnStart();

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
	}
}
