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

        [Fact]
        public async Task UpdateProviderAsync_UpdateOldFields_OldProviderEqualsNewProvider()
        {
            // Arrange
            var mockRepository = new Mock<IPaymentProviderRepository>();
            var existingProvider = new PaymentProvider { Id = 1, Name = "Old Name", Url = "old.com", IsActive = true, Currency = "USD" };
            var updatedProvider = new PaymentProvider { Id = 1, Name = "New Name", Url = "new.com", IsActive = true, Currency = "USD" };


            mockRepository.Setup(repo => repo.GetAsync(existingProvider.Id)).ReturnsAsync(existingProvider);
            var service = new PaymentProviderService(mockRepository.Object);

            // Act
            await service.UpdateProviderAsync(updatedProvider);

            // Assert
            Assert.Equal(updatedProvider.Name, existingProvider.Name);
        }

        [Fact]
        public async Task DeleteProviderAsync_DeleteProvider_NoProviderLeft()
        {
            // Arrange
            var mockRepository = new Mock<IPaymentProviderRepository>();
            var providerToDelete = new PaymentProvider{ Id = 1, Name = "Klarna", IsActive = true, Currency = "EUR" };

            // Mock setup for the service's internal GetByIdAsync call before delete
            mockRepository.Setup(repo => repo.GetAsync(1)).ReturnsAsync(providerToDelete);
            // Mock setup for the DeleteAsync call
            mockRepository.Setup(repo => repo.DeleteAsync(1)).Returns(Task.CompletedTask);

            var service = new PaymentProviderService(mockRepository.Object);

            // Act
            await service.DeleteProviderAsync(1);
            var result = await service.GetProviderByIdAsync(1);

            // Assert
            Assert.Null(result);
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
