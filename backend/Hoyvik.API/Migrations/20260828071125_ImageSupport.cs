using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoyvik.API.Migrations
{
    /// <inheritdoc />
    public partial class ImageSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Images");

            migrationBuilder.RenameColumn(
                name: "PublicPath",
                table: "Images",
                newName: "FileName");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Images",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Images",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Images");

            migrationBuilder.RenameColumn(
                name: "FileName",
                table: "Images",
                newName: "PublicPath");

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "Images",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
