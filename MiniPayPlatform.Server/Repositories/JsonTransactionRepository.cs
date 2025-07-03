using MiniPayPlatform.Server.Models;
using System.Text.Json;

namespace MiniPayPlatform.Server.Repositories
{
    public class JsonTransactionRepository : ITransactionRepository
    {
        private string _filePath;
        private int _nextId;


        public JsonTransactionRepository()
        {
            var dataDirectory = Path.Combine(AppContext.BaseDirectory, "Data");
            Directory.CreateDirectory(dataDirectory);
            _filePath = Path.Combine(dataDirectory, "transactions.json");
            _nextId = 0;

        }

        public JsonTransactionRepository(string customPath)
        {
            _filePath = customPath;
            var directory = Path.GetDirectoryName(customPath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            _nextId = 0;

        }

        private async Task SaveTransactionsAsync(List<Transaction> transactions)
        {
            var json = JsonSerializer.Serialize(transactions);
            await File.WriteAllTextAsync(_filePath, json);
        }

        public async Task<Transaction> AddAsync(Transaction transaction)
        {
            var transactions = await GetAllAsync();
            transaction.Id = _nextId + 1;

            transactions.Add(transaction);
            await SaveTransactionsAsync(transactions);
            return transaction;
        }

        public async Task DeleteAsync(int id)
        {
            var transactions = await GetAllAsync();
            var existingTransaction = transactions.FirstOrDefault(t => t.Id == id);
            if (existingTransaction != null)
            {
                transactions.Remove(existingTransaction);
                await SaveTransactionsAsync(transactions);
            }
        }

        public async Task<List<Transaction>> GetAllAsync()
        {
            if (!File.Exists(_filePath))
            {
                return await Task.FromResult(new List<Transaction>());
            }

            else
            {
                // Get transactions from file
                var json = await File.ReadAllTextAsync(_filePath);
                var transactions = JsonSerializer.Deserialize<List<Transaction>>(json);

                if (transactions != null)
                {
                    _nextId = transactions.Max(p => p.Id);
                }

                return await Task.FromResult(transactions);
            }
        }

        public async Task<Transaction?> GetAsync(int id)
        {
            var transactions = await GetAllAsync();
            return transactions.FirstOrDefault(t => t.Id == id);
        }

        public async Task UpdateAsync(Transaction updatedTransaction)
        {
            var transactions = await GetAllAsync();
            var existingTransaction = transactions.FirstOrDefault(t => t.Id == updatedTransaction.Id);

            existingTransaction.Amount = updatedTransaction.Amount;
            existingTransaction.Currency = updatedTransaction.Currency;
            existingTransaction.Status = updatedTransaction.Status;
            existingTransaction.TransactionDate = updatedTransaction.TransactionDate;
            existingTransaction.PaymentProviderId = updatedTransaction.PaymentProviderId;
            existingTransaction.Description = updatedTransaction.Description;
            existingTransaction.Reference = updatedTransaction.Reference;

            await SaveTransactionsAsync(transactions);
        }
    }
}