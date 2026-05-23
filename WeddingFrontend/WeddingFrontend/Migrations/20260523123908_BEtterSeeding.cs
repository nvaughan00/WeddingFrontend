using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingFrontend.Migrations
{
    /// <inheritdoc />
    public partial class BEtterSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Guests",
                columns: new[] { "Name", "IsAttending", "Entree", "HouseholdName", "IsChild", "Desert" },
                values: new object[,]
                {
                    { "Nick Vaughan", false,  "", "Nick Vaughan & Family", false, "" },
                    { "Whitney Vaughan", false,  "", "Nick Vaughan & Family", false, "" },
                    { "Eloise Vaughan", false,  "", "Nick Vaughan & Family", true, "" },
                    { "Jacob Edwards", false,  "", "Jacob Edwards & Family", false, "" },
                    { "Kelsey Edwards", false,  "", "Jacob Edwards & Family", false, "" },
                    { "Finley Edwards", false,  "", "Jacob Edwards & Family", true, "" },
                    { "Rowan Edwards", false,  "", "Jacob Edwards & Family", true, "" },
                    { "Piper Edwards", false,  "", "Jacob Edwards & Family", true, "" },
                    { "Emily Ganson", false,  "", "Ganson Family", false, "" },
                    { "Corey Ganson", false,  "", "Ganson Family", false, "" },
                    { "Cooper Ganson", false,  "", "Ganson Family", true, "" },
                    { "Henry Ganson", false,  "", "Ganson Family", true, "" },
                    { "Suzie Q Edwards", false, "", "Sue Edwards", false, ""  },
                    { "Jordan Tomlin", false,  "", "Tomlin Family", false, ""  },
                    { "Matthew Tomlin", false,  "", "Tomlin Family", false, ""  },
                    { "Ashley Cave", false,  "",    "Cave Family", false, "" },
                    { "Kyle Cave", false,  "",    "Cave Family", false, "" },
                    { "Maddie Dusselier", false,  "",    "Pallo-Dusselier Family", false, "" },
                    { "Nick Pallo", false,  "",    "Pallo-Dusselier Family", false, "" },
                    { "Hannah Wilder", false,  "",    "Wilder Family", false, "" },
                    { "Brad Wilder", false,  "",    "Wilder Family", false, "" },
                    { "Aunt 'Scary'", false,  "",    "Krebbs-Whitney Family", false, "" },
                    { "John Krebbs", false,  "",    "Krebbs-Whitney Family", false, "" },
                    { "Wayne Whitney", false,  "",    "Wayne Whitney & Family", false, "" },
                    { "Debbie Whitney", false,  "",    "Wayne Whitney & Family", false, "" },
                    { "Dave Whitney", false,  "",    "Dave Whitney & Family", false, "" },
                    { "Donna Whitney", false,  "",    "Dave Whitney & Family", false, "" },
                    { "Peggy Edwards", false,  "",    "Don Edwards & Family", false, "" },
                    { "Don Edwards", false,  "",    "Don Edwards & Family", false, "" },
                    { "Melissa Ressler", false,  "",    "Ressler Family", false, "" },
                    { "Tim Ressler", false,  "",    "Ressler Family", false, "" },
                    { "Anne Marie Vaughan", false,  "",    "Kevin Vaughan & Family", false, "" },
                    { "Kevin Vaughan", false,  "",    "Kevin Vaughan & Family", false, "" },
                    { "Aidan Vaughan", false,  "",    "Kevin Vaughan & Family", false, "" },
                    { "Ben Vaughan", false,  "",    "Ben Vaughan & +1", false, "" },
                    { "Nyesha Washington", false,  "",    "Ben Vaughan & +1", false, "" },
                    { "Annette 'Nettyballs' Simonson", false,  "",    "Annette Simonson", false, "" },
                    { "Steven 'The Hog' McCormick", false,  "",    "Steven McCormick", false, "" },
                    { "David Breese", false,  "",    "David Breese", false, "" },
                    { "Max Frost", false,  "",    "Max Frost", false, "" },
                    { "Parker Day", false,  "",    "Parker Day & +1", false, "" },
                    { "Lexi Kennett", false,  "",    "Parker Day & +1", false, "" },
                    { "Mike Eilers", false,  "",    "Eilers Family", false, "" },
                    { "Amy Eilers", false,  "",    "Eilers Family", false, "" },
                    { "Tony Day", false,  "",    "Day Family", false, "" },
                    { "Sindi Day", false,  "",    "Day Family", false, "" },
                    { "Penny Harrison", false,  "",    "Harrison Family", false, "" },
                    { "Scott Harrison", false,  "",    "Harrison Family", false, "" },
                    { "Lynn McCormick", false,  "",    "McCormick Family", false, "" },
                    { "Dave McCormick", false,  "",    "McCormick Family", false, "" },
                    { "Mary Jo Vaughan", false,  "",    "Mary Jo Vaughan", false, "" },
                    { "Hunter Poling", false,  "",    "Hunter Poling & +1", false, "" },
                    { "Natalie Idontknowyourlastname", false,  "",    "Hunter Poling & +1", false, "" },
                    { "Cliff Poling", false,  "",    "Poling Family", false, "" },
                    { "Angie Poling", false,  "",    "Poling Family", false, "" },
                    { "Lauren Poling", false,  "",    "Poling Family", false, "" },
                    { "Atticus Poling", false,  "",    "Poling Family", false, "" },
                    { "Sawyer Poling", false,  "",    "Poling Family", false, "" },
                    { "Kelsey Vaughan", false,  "",    "Kelsey Vaughan & Family", false, "" },
                    { "Danay Vaughan", false,  "",    "Kelsey Vaughan & Family", false, "" },
                    { "Adalyn Vaughan", false,  "",    "Kelsey Vaughan & Family", true, "" },
                    { "Shawn Vaughan", false,  "",    "Shawn Vaughan & Family", false, "" },
                    { "Janet Vaughan", false,  "",    "Shawn Vaughan & Family", false, "" },
                    { "Duffy Vaughan", false,  "",    "Duffy Vaughan & Family", false, "" },
                    { "Kim Vaughan", false,  "",    "Duffy Vaughan & Family", false, "" },
                    { "Natalie Vaughan", false,  "",    "Duffy Vaughan & Family", false, "" },
                    { "Leo Vaughan", false,  "",    "Duffy Vaughan & Family", false, "" },
                    { "Grace Vaughan", false,  "",    "Duffy Vaughan & Family", false, "" },
                    { "Theresa Vaughan", false, "", "Theresa Vaughan", false, "" },
                    { "Matt Ring", false,  "",    "Ring Family", false, "" },
                    { "Jenny Ring", false,  "",    "Ring Family", false, "" },
                    { "Olivia Trafton", false,  "",    "Trafton Family", false, "" },
                    { "Christopher Trafton", false,  "",    "Trafton Family", false, "" },
                    { "Mark Laffoon", false,  "",    "Laffoon Family", false, "" },
                    { "Leslie Laffoon", false,  "",    "Laffoon Family", false, "" },
                    { "Jeremy Pothast", false,  "",    "Pothast Family", false, "" },
                    { "Kristin Pothast", false,  "",    "Pothast Family", false, "" },
                    { "Karen Baker", false,  "",    "Baker Family", false, "" },
                    { "Husband Of Karen Baker", false,  "",    "Baker Family", false, "" },
                    { "Landiep Bui", false,  "",    "Bui Family", false, "" },
                    { "Husband Of Landiep Bui", false,  "",    "Bui Family", false, "" },
                    { "Shirley Grandstaff", false,  "",    "Grandstaff Family", false, "" },
                    { "Husband Of Shirley Grandstaff", false,  "",    "Grandstaff Family", false, "" },
                    { "Jeff Simonson", false,  "",    "Simonson Family", false, "" },
                    { "Jamie Simonson", false,  "",    "Simonson Family", false, "" },

                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
