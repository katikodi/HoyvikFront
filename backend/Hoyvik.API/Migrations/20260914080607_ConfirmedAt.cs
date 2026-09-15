using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoyvik.API.Migrations
{
    /// <inheritdoc />
    public partial class ConfirmedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ConfirmedAt",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConfirmedAt",
                table: "Bookings");
        }
    }
}
