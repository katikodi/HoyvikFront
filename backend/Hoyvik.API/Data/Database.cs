using Hoyvik.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Data;

public class Database(DbContextOptions<Database> options) : IdentityDbContext<ApplicationUser>(options)
{

	public DbSet<Booking> Bookings { get; set; }
	public DbSet<Image> Images { get; set; }

    public DbSet<BlockedPeriod> BlockedPeriods { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);

		builder.Entity<Booking>()
			.HasOne(booking => booking.User)
			.WithMany(user => user.Bookings)
			.HasForeignKey(booking => booking.UserId);


		builder.Entity<Booking>()
			.Property(x => x.Status)
			.HasConversion<string>();

		builder.Entity<Booking>()
			.HasIndex(x => x.StripeSessionId)
			.IsUnique();
	}
}



//public partial class AddBookingAvailabilityConstraint : Migration
//{
//    /// <inheritdoc />
//    protected override void Up(MigrationBuilder migrationBuilder)
//    {
//        migrationBuilder.Sql("""
//                CREATE EXTENSION IF NOT EXISTS btree_gist;
//                """);

//        migrationBuilder.Sql("""
//            ALTER TABLE "Bookings"
//            ADD CONSTRAINT "NoOverlappingBookings"
//            EXCLUDE USING gist
//            (
//                daterange("CheckIn", "CheckOut", '[)') WITH &&
//            )
//            WHERE ("Status" IN (0, 1));
//            """);
//    }

//    /// <inheritdoc />
//    protected override void Down(MigrationBuilder migrationBuilder)
//    {
//        migrationBuilder.Sql("""
//            ALTER TABLE "Bookings"
//            DROP CONSTRAINT IF EXISTS "NoOverlappingBookings";
//            """);
//    }
//}
