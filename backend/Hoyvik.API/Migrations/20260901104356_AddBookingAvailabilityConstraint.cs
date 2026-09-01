using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoyvik.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingAvailabilityConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
            CREATE EXTENSION IF NOT EXISTS btree_gist;
            """);

            migrationBuilder.Sql("""
            ALTER TABLE "Bookings"
            ADD CONSTRAINT "NoOverlappingBookings"
            EXCLUDE USING gist
            (
                daterange("CheckIn", "CheckOut", '[)') WITH &&
            )
            WHERE ("Status" IN ('Pending', 'Confirmed'));
            """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
            ALTER TABLE "Bookings"
            DROP CONSTRAINT IF EXISTS "NoOverlappingBookings";
            """);
        }
    }
}
