namespace WeddingFrontend.Models
{
    public class Guest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsAttending { get; set; }
        public string Entree { get; set; } = string.Empty;
        public string HouseholdName { get; set; } = string.Empty;
        public bool IsChild { get; set; }
    }
}
