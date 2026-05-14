using Microsoft.EntityFrameworkCore;
using WeddingFrontend.Models;

namespace WeddingFrontend.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Guest> Guests { get; set; }
    }
}
