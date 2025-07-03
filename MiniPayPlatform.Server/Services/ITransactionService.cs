using MiniPayPlatform.Server.Models;

namespace MiniPayPlatform.Server.Services
{
    public interface ITransactionService
    {
        Task<List<Transaction>> GetAllTransactionsAsync();
        Task<Transaction?> GetTransactionByIdAsync(int id);
        Task<Transaction> AddTransactionAsync(Transaction transaction);
        Task<bool> UpdateTransactionAsync(Transaction transaction);
        Task<bool> DeleteTransactionAsync(int id);
    }
}