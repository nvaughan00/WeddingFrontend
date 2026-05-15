namespace WeddingFrontend.Models
{
    public class Household
    {
        public int Id { get; set; }
        public List<Guest> Family { get; set; } = new List<Guest>();
    }
}
