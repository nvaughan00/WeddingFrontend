using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingFrontend.Migrations
{
    /// <inheritdoc />
    public partial class SeedTestData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Guests",
                columns: new[] { "Name", "IsAttending", "Entree", "HouseholdName" },
                values: new object[,]
                {
                { "James Smith",   true,  "Chicken", "Smith Family"    },
                { "Laura Smith",   true,  "Fish",    "Smith Family"    },
                { "Dan Smith",   true,  "Chicken", "Smith Family"    },
                { "Quivon Smith",   true,  "Fish",    "Smith Family"    },
                { "Ja'Letrice Smith",   true,  "Chicken", "Smith Family"    },
                { "Bob Smith",   true,  "Fish",    "Smith Family"    },
                { "Tom Baker",     true,  "Beef",    "Baker Family" },
                { "Sarah Baker",   false, "",        "Baker Family" },
                { "Chris Johnson", true,  "Chicken", "Johnson Family"  },
                { "Emma Johnson",  true,  "Vegetarian", "Johnson Family" },
                { "Mike Davis",    true,  "Beef",    "Davis Family" },
                { "Rachel Davis",  true,  "Fish",    "Davis Family" },
                { "Paul Wilson",   false, "",        "Wilson Family"   },
                { "Anna Wilson",   true,  "Chicken", "Wilson Family"   }
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Guests",
                keyColumn: "Name",
                keyValues: new object[]
                {
                "James Smith", "Laura Smith", "Tom Baker", "Sarah Baker",
                "Chris Johnson", "Emma Johnson", "Mike Davis", "Rachel Davis",
                "Paul Wilson", "Anna Wilson"
                }
            );
        }
    }
}
