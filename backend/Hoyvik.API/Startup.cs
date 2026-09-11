using FluentValidation;
using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Endpoints;
using Hoyvik.API.Services;
using Hoyvik.API.Services.Abstractions;
using Hoyvik.API.Validators;
using Microsoft.AspNetCore.Identity;
using Resend;
using Stripe;

namespace Hoyvik.API;

internal static class Startup
{

    internal static void AddApplication(this WebApplicationBuilder builder)
    {

        builder.AddServiceDefaults();
        builder.Services.AddProblemDetails();

        builder.Services.AddMemoryCache();
        builder.Services.AddOptions();
        builder.Services.AddCors(options => options.AddPolicy("frontend",
            p => p.WithOrigins("http://localhost:54131")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()));

        builder.Services.AddAuthorizationBuilder()
            .AddDefaultPolicy(Roles.GUEST, p => p.RequireRole(Roles.GUEST))
            .AddPolicy(Roles.USER, p => p.RequireRole(Roles.ADMIN, Roles.USER))
            .AddPolicy(Roles.ADMIN, p => p.RequireRole(Roles.ADMIN));


        builder.Services.AddScoped<ImageUploaderService>();
        builder.Services.AddScoped<IBookingService, BookingService>();
        builder.Services.AddScoped<IStripePaymentService, StripePaymentService>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreateSessionValidator>();
        builder.Services.AddHostedService<BookingExpirationService>();
        builder.Services.AddHostedService<EmailBackgroundService>();
        builder.Services.AddScoped<IEmailService, ResendEmailService>();
        builder.Services.AddSingleton<IBusinessClock, BusinessClock>();
        builder.Services.AddScoped<EmailVerificationLinkFactory>();

        builder.Services.AddOptions<BookingConfiguration>()
            .BindConfiguration("BookingSettings")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        builder.Services.AddOptions<FrontendConfiguration>()
            .BindConfiguration("Frontend")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        builder.Services.AddHttpClient<ResendClient>();

        builder.Services.Configure<ResendClientOptions>(options =>
        {
            options.ApiToken =
                builder.Configuration["Resend:ApiKey"]
                ?? throw new InvalidOperationException(
                    "Resend API key is not configured.");
        });


        builder.Services
            .AddOptions<ResendConfiguration>()
            .Bind(builder.Configuration.GetSection("Resend"))
            .Validate(x => !string.IsNullOrWhiteSpace(x.ApiKey),
                "Resend API key is required.")
            .Validate(x => !string.IsNullOrWhiteSpace(x.From),
                "Resend from address is required.")
            .ValidateOnStart();

        builder.Services.AddTransient<IResend, ResendClient>();

        StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"] ?? throw new Exception("Stripe:SecretKey is missing");


        builder.Services
            .AddIdentity<ApplicationUser, IdentityRole>(x =>
            {
                x.Password.RequireDigit = false;
                x.Password.RequireUppercase = false;
                //x.Password.RequiredLength = 0;
                x.User.RequireUniqueEmail = true;
                x.SignIn.RequireConfirmedEmail = true;
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
