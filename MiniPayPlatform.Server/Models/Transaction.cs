
namespace MiniPayPlatform.Server.Models
{
    public class Transaction
    {
        private int _id;
        private decimal _amount;
        private string _currency;
        private string _status;
        private DateTime _transactionDate;
        private int _paymentProviderId;
        private string _description;
        private string _reference;

        public int Id { get => _id; set => _id = value; }
        public decimal Amount { get => _amount; set => _amount = value; }
        public string Currency { get => _currency; set => _currency = value; }
        public string Status { get => _status; set => _status = value; } //"Pending", "Completed", "Failed"
        public DateTime TransactionDate { get => _transactionDate; set => _transactionDate = value; }
        public int PaymentProviderId { get => _paymentProviderId; set => _paymentProviderId = value; }
        public string Description { get => _description; set => _description = value; }
        public string Reference { get => _reference; set => _reference = value; }
    }
}