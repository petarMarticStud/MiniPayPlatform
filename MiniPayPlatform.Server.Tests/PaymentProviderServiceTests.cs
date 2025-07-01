using MiniPayPlatform.Server.Models;
using MiniPayPlatform.Server.Repositories;
using MiniPayPlatform.Server.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Xunit;


namespace MiniPayPlatform.Server.Tests
{
    public class PaymentProviderServiceTests
    {
        [Fact]
        public async Task GetAllProvidersAsync_ReturnAllProvidersFromRepository_Returns2Entries() 
        {
            // Arrange
            var mockRepository = new Mock<IPaymentProviderRepository>();
            var providers = new List<PaymentProvider>
            {
                new PaymentProvider { Id = 1, Name = "Stripe", IsActive = true, Currency = "USD" },
                new PaymentProvider { Id = 2, Name = "PayPal", IsActive = false, Currency = "EUR" }
            };

            //Set up mock
            mockRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(providers);

            var service = new PaymentProviderService(mockRepository.Object); // create instance of service with moc

            // Act
            var result = await service.GetAllProvidersAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }


        [Fact]
        public async Task GetProviderByIdAsync_ReturnsProviderWhenProviderExists_ReturnsProvider()
        {
            // Arrange
            var mockRepository = new Mock<IPaymentProviderRepository>();
            var expectedProvider = new PaymentProvider { Id = 1, Name = "Klarna", IsActive = true, Currency = "EUR" };

            mockRepository.Setup(repo => repo.GetAsync(1)).ReturnsAsync(expectedProvider);

            var service = new PaymentProviderService(mockRepository.Object);

            // Act
            var result = await service.GetProviderByIdAsync(1);

            // Assert
            Assert.Equal("Klarna", result.Name);
        }

        [Fact]
        public async Task AddProviderAsync_AddsNewProvider_ReturnsProvider()
        {
            // Arrange
            var mockRepository = new Mock<IPaymentProviderRepository>();
            var newProvider = new PaymentProvider { Id = 1, Name = "NewProvider", Url = "http://example.com", IsActive = true, Currency = "USD" };

            // Set up mock: It should just complete successfully when called with any PaymentProvider.
            mockRepository.Setup(repo => repo.AddAsync(It.IsAny<PaymentProvider>())).ReturnsAsync((PaymentProvider p) => p);
            var service = new PaymentProviderService(mockRepository.Object);

            // Act
            var result = await service.AddProviderAsync(newProvider);

            // Assert
            Assert.Equal(newProvider.Name, result.Name);
        }


        private JsonPaymentProviderRepository CreateTestRepository(string testFileName)
        {
            var dataPath = Path.Combine(AppContext.BaseDirectory, "Data");
            Directory.CreateDirectory(dataPath);

            var filePath = Path.Combine(dataPath, testFileName);
            if (File.Exists(filePath))
                File.Delete(filePath);

            return new JsonPaymentProviderRepository(filePath);
        }

        [Fact]
        public async Task UpdateProviderAsync_UpdateOldFields_OldProviderEqualsNewProvider()
        {
            // Arrange
            var repo = CreateTestRepository("test-update.json");
            var service = new PaymentProviderService(repo);

            var provider = new PaymentProvider
            {
                Name = "Original",
                Url = "original.com",
                Currency = "USD",
                IsActive = true
            };

            var added = await service.AddProviderAsync(provider);

            // Act
            added.Name = "Updated";
            added.Url = "updated.com";
            added.Currency = "EUR";
            added.IsActive = false;

            await service.UpdateProviderAsync(added);

            var result = await service.GetProviderByIdAsync(added.Id);

            // Assert
            Assert.Equal("Updated", result.Name);
            Assert.Equal("updated.com", result.Url);
            Assert.Equal("EUR", result.Currency);
            Assert.False(result.IsActive);
        }

        [Fact]
        public async Task DeleteProviderAsync_DeleteProvider_OneProviderLeft()
        {
            // Arrange
            var repo = CreateTestRepository("test-delete.json");
            var service = new PaymentProviderService(repo);

            var providerA = await service.AddProviderAsync(new PaymentProvider { Name = "A", Currency = "USD", IsActive = true });
            var providerB = await service.AddProviderAsync(new PaymentProvider { Name = "B", Currency = "EUR", IsActive = false });

            // Act
            await service.DeleteProviderAsync(providerA.Id);

            var result = await service.GetAllProvidersAsync();

            // Assert
            Assert.Single(result);
        }



        [Fact]
        public async Task SetProviderActiveStatusAsync_UpdatesStatusToTrue_True()
        {
            // Arrange
            var mockRepository = new Mock<IPaymentProviderRepository>();
            var provider = new PaymentProvider { Id = 1, Name = "Test Provider", IsActive = false }; // Starts as inactive

            // Mock the repository to return the provider when GetByIdAsync is called
            mockRepository.Setup(repo => repo.GetAsync(1)).ReturnsAsync(provider);

            var service = new PaymentProviderService(mockRepository.Object);

            // Act
            await service.SetProviderActiveStatusAsync(1, true); // Set status to active

            // Assert
            Assert.True(provider.IsActive);
        }
    }
}
