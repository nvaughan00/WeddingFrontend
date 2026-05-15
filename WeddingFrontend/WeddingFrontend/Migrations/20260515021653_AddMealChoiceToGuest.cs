using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingFrontend.Migrations
{
    /// <inheritdoc />
    public partial class AddMealChoiceToGuest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlusOnes",
                table: "Guests");

            migrationBuilder.AddColumn<string>(
                name: "Entree",
                table: "Guests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Entree",
                table: "Guests");

            migrationBuilder.AddColumn<int>(
                name: "PlusOnes",
                table: "Guests",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
