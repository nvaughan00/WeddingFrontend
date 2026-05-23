using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingFrontend.Migrations
{
    /// <inheritdoc />
    public partial class OneMoreGuestColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Desert",
                table: "Guests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Desert",
                table: "Guests");
        }
    }
}
