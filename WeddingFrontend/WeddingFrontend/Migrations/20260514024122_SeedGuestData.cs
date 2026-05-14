using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingFrontend.Migrations
{
    /// <inheritdoc />
    public partial class SeedGuestData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Guests",
                columns: new[] { "Id", "Name", "IsAttending", "PlusOnes" },
                values: new object[] { 1, "John Smith", false, 0 }
            );

            migrationBuilder.InsertData(
                table: "Guests",
                columns: new[] { "Id", "Name", "IsAttending", "PlusOnes" },
                values: new object[] { 2, "Jane Doe", false, 0 }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
               table: "Guests",
               keyColumn: "Id",
               keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Guests",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
