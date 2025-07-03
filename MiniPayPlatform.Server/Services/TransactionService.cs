using MiniPayPlatform.Server.Models;
using MiniPayPlatform.Server.Repositories;

namespace MiniPayPlatform.Server.Services
{
    public class TransactionService : ITransactionService
    {
        private ITransactionRepository _transactionRepository;
        private IPaymentProviderRepository _paymentProviderRepository;

        public TransactionService(ITransactionRepository transactionRepository, IPaymentProviderRepository paymentProviderRepository)
        {
            _transactionRepository = transactionRepository;
            _paymentProviderRepository = paymentProviderRepository;
        }

        public async Task<Transaction> AddTransactionAsync(Transaction transaction)
        {
            var provider = await _paymentProviderRepository.GetAsync(transaction.PaymentProviderId);

            if (transaction.TransactionDate == default)
            {
                transaction.TransactionDate = DateTime.UtcNow;
            }
            if (string.IsNullOrEmpty(transaction.Status))
            {
                transaction.Status = "Pending";
            }

            return await _transactionRepository.AddAsync(transaction);
        }

        public async Task<bool> DeleteTransactionAsync(int id)
        {
            var existingTransaction = await _transactionRepository.GetAsync(id);
            if (existingTransaction == null)
            {
                return false;
            }
            await _transactionRepository.DeleteAsync(id);
            return true;
        }

        public async Task<List<Transaction>> GetAllTransactionsAsync()
        {
            return await _transactionRepository.GetAllAsync();
        }

        public async Task<Transaction?> GetTransactionByIdAsync(int id)
        {
            return await _transactionRepository.GetAsync(id);
        }

        public async Task<bool> UpdateTransactionAsync(Transaction transaction)
        {
            var existingTransaction = await _transactionRepository.GetAsync(transaction.Id);
            if (existingTransaction == null)
            {
                return false;
            }

            var provider = await _paymentProviderRepository.GetAsync(transaction.PaymentProviderId);
            await _transactionRepository.UpdateAsync(transaction);
            return true;
        }
    }
}