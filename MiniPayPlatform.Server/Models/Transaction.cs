
namespace MiniPayPlatform.Server.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; //  "Pending", "Completed", "Failed"
        public DateTime TransactionDate { get; set; }
        public int PaymentProviderId { get; set; } 
        public string Description { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
    }
}