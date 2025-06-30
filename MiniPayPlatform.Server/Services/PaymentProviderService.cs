using MiniPayPlatform.Server.Models;
using MiniPayPlatform.Server.Repositories;

namespace MiniPayPlatform.Server.Services
{
    public class PaymentProviderService : IPaymentProviderService
    {
        private IPaymentProviderRepository _repository;

        public PaymentProviderService(IPaymentProviderRepository repository)
        {
            _repository = repository;
        }



        public async Task<IEnumerable<PaymentProvider>> GetAllProvidersAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<PaymentProvider> GetProviderByIdAsync(int id)
        {
            return await _repository.GetAsync(id);
        }

        public async Task<PaymentProvider> AddProviderAsync(PaymentProvider paymentProvider)
        {
            await _repository.AddAsync(paymentProvider);
            return paymentProvider;
        }

        public async Task UpdateProviderAsync(PaymentProvider provider)
        {
            await _repository.UpdateAsync(provider);
        }

        public async Task DeleteProviderAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task SetProviderActiveStatusAsync(int id, bool isActive)
        {
            PaymentProvider paymentProvider = await GetProviderByIdAsync(id);
            paymentProvider.IsActive = isActive;
            await UpdateProviderAsync(paymentProvider);
        }
    }
}
