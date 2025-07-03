using MiniPayPlatform.Server.Models;
using System.Text.Json;

namespace MiniPayPlatform.Server.Repositories
{
    public class JsonPaymentProviderRepository : IPaymentProviderRepository
    {
        private string _filePath;
        private int _nextId;


        public JsonPaymentProviderRepository() 
        {
            var dataDirectory = Path.Combine(AppContext.BaseDirectory, "Data");
            Directory.CreateDirectory(dataDirectory);
            _filePath = Path.Combine(dataDirectory, "paymentproviders.json");

            _nextId = 0;
        }


        public JsonPaymentProviderRepository(string customPath)
        {
            _filePath = customPath;
            _nextId = 0;
        }


        public async Task SaveProvidersAsync(List<PaymentProvider> providers) 
        {
            var json = JsonSerializer.Serialize(providers);
            await File.WriteAllTextAsync(_filePath, json);
        }


        public async Task<PaymentProvider> AddAsync(PaymentProvider paymentProvider)
        {
            var providers = await GetAllAsync();
            paymentProvider.Id = _nextId + 1;

           providers.Add(paymentProvider);
           await SaveProvidersAsync(providers);
           return paymentProvider;
        }

        public async Task DeleteAsync(int id)
        {
            var providers = await GetAllAsync();
            var existingProvider =  providers.FirstOrDefault(p => p.Id == id);
            if (existingProvider != null)
            {
                providers.Remove(existingProvider);
            }

            await SaveProvidersAsync(providers);
        }

        public async Task<List<PaymentProvider>> GetAllAsync()
        {
            if (!File.Exists(_filePath))
            {
                return await Task.FromResult(new List<PaymentProvider>());
            }

            else
            {
                // Get providers from file
                var json = await File.ReadAllTextAsync(_filePath);
                var providers = JsonSerializer.Deserialize<List<PaymentProvider>>(json);

                if (providers != null)
                {
                    _nextId = providers.Max(p => p.Id);
                }

                return await Task.FromResult(providers);
            }
        }

        public async Task<PaymentProvider> GetAsync(int id)
        {
            var providers = await GetAllAsync();
            return providers.FirstOrDefault(p => p.Id == id);

        }

        public async Task UpdateAsync(PaymentProvider updatedPaymentProvider)
        {
            var providers = await GetAllAsync();
            var exixtingProvider = providers.FirstOrDefault(p => p.Id == updatedPaymentProvider.Id);

            exixtingProvider.Name = updatedPaymentProvider.Name;
            exixtingProvider.Url = updatedPaymentProvider.Url;
            exixtingProvider.IsActive = updatedPaymentProvider.IsActive;
            exixtingProvider.Currency = updatedPaymentProvider.Currency;
            exixtingProvider.Description = updatedPaymentProvider.Description; await SaveProvidersAsync(providers);

            SaveProvidersAsync(providers);

        }
    }
}
