using MiniPayPlatform.Server.Models;

namespace MiniPayPlatform.Server.Repositories
{
    public interface IPaymentProviderRepository
    {
        Task<IEnumerable<PaymentProvider>> GetAllAsync();
        Task<PaymentProvider> GetAsync (int id);
        Task<PaymentProvider> AddAsync (PaymentProvider paymentProvider);
        Task DeleteAsync (int id);
        Task UpdateAsync (PaymentProvider paymentProvider);
    }
}
