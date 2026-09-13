using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Data;

internal static class IdentitySeeder
{
    internal static async Task SeedAsync(IServiceProvider services)
    {
        var config = services.GetRequiredService<IConfiguration>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var db = services.GetRequiredService<Database>();

        const string adminEmail = "admin@admin.com";
        const string adminPassword = "admin@admin.com";

        
        if (!await roleManager.RoleExistsAsync(Roles.ADMIN))
        {
            await roleManager.CreateAsync(new IdentityRole(Roles.ADMIN));
        }

        if (!await roleManager.RoleExistsAsync(Roles.USER))
        {
            await roleManager.CreateAsync(new IdentityRole(Roles.USER));

        }

        var admin = await userManager.FindByEmailAsync(adminEmail);


        if (config["PersonalAccount"] is not null)
        {
            var personalAccount = await userManager.FindByEmailAsync(config["PersonalAccount:Email"] ?? throw new NullReferenceException(""));


            if (personalAccount is null)
            {
                
                personalAccount = new ApplicationUser
                {
                    FullName = config["PersonalAccount:FullName"] ?? throw new NullReferenceException(""),
                    UserName = config["PersonalAccount:Email"] ?? throw new NullReferenceException(""),
                    Email = config["PersonalAccount:Email"] ?? throw new NullReferenceException(""),
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(personalAccount, config["PersonalAccount:Password"] ?? throw new NullReferenceException(""));

                if (!result.Succeeded)
                {
                    throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            if (!await userManager.IsInRoleAsync(personalAccount, Roles.ADMIN))
            {
                await userManager.AddToRoleAsync(personalAccount, Roles.ADMIN);
            }
        }
 
        if (admin is null)
        {
            admin = new ApplicationUser
            {
                FullName = adminEmail,
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, adminPassword);

            if (!result.Succeeded)
            {
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        if (!await userManager.IsInRoleAsync(admin, Roles.ADMIN))
        {
            await userManager.AddToRoleAsync(admin, Roles.ADMIN);
        }


    }
}
