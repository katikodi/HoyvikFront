using Hoyvik.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Data;

public class Database(DbContextOptions<Database> options) : IdentityDbContext<ApplicationUser>(options)
{

	public DbSet<Booking> Bookings { get; set; }
	public DbSet<Image> Images { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
		builder.Entity<Booking>()
			.HasOne(booking => booking.User)
			.WithMany(user => user.Bookings)
			.HasForeignKey(booking => booking.UserId);


		builder.Entity<Booking>()
			.HasIndex(x => x.StripeSessionId)
			.IsUnique();
	}
}
