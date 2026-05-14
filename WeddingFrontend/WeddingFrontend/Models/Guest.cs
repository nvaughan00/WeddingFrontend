using System.Data;


namespace WeddingFrontend.Models
{
    public class Guest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsAttending { get; set; }
        public int PlusOnes { get; set; }
    }
}
