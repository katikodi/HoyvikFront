using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Data;

public static class IdentitySeeder
{
	public static async Task SeedAsync(IServiceProvider services)
	{
		var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
		var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var db = services.GetRequiredService<Database>();


		const string adminRole = "admin";
        const string userRole = "user";
        const string adminEmail = "admin@admin.com";
		const string adminPassword = "admin@admin.com";


		if(!await roleManager.RoleExistsAsync(adminRole))
		{
			await roleManager.CreateAsync(new IdentityRole(adminRole));
		}

		if (!await roleManager.RoleExistsAsync(userRole))
		{
            await roleManager.CreateAsync(new IdentityRole(userRole));

        }

        var admin = await userManager.FindByEmailAsync(adminEmail);

		if(admin == null)
		{
			admin = new ApplicationUser
			{
				UserName = adminEmail,
				Email = adminEmail,
				EmailConfirmed = true
			};

			var result = await userManager.CreateAsync(admin, adminPassword);

            db.Bookings.Add(new Models.Booking
            {
                CheckIn = DateTime.UtcNow.AddDays(1),
                CheckOut = DateTime.UtcNow.AddDays(7),
                NumberOfGuests = 1,
                Status = Models.BookingStatus.Pending,
				UserId = admin.Id

            });

            if (!result.Succeeded)
			{
				throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
			}
		}

		if(!await userManager.IsInRoleAsync(admin, adminRole))
		{
			await userManager.AddToRoleAsync(admin, adminRole);
		}
	}
}
