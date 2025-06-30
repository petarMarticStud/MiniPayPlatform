namespace MiniPayPlatform.Server.Models
{
    public class PaymentProvider
    {

        //Properties and Fields
        private int id;
        private string name;
        private string description;
        private string url;
        private string currency;
        private bool isActive;

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Description { get => description; set => description = value; }
        public string Url { get => url; set => url = value; }
        public string Currency { get => currency; set => currency = value; }
        public bool IsActive { get => isActive; set => isActive = value; }
    }
}
