using MiniPayPlatform.Server.Models;

namespace MiniPayPlatform.Server.Services
{
    public interface IPaymentProviderService
    {
        Task<List<PaymentProvider>> GetAllProvidersAsync();
        Task<PaymentProvider> GetProviderByIdAsync(int id);
        Task<PaymentProvider> AddProviderAsync(PaymentProvider paymentProvider); // return added payment provider
        Task UpdateProviderAsync(PaymentProvider provider);
        Task DeleteProviderAsync(int id);
        Task SetProviderActiveStatusAsync(int id, bool isActive); // deactivate payment provider
    }
}
