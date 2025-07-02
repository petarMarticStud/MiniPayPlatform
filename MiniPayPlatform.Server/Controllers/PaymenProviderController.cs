using Microsoft.AspNetCore.Mvc;
using MiniPayPlatform.Server.Models;
using MiniPayPlatform.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MiniPayPlatform.Server.Controllers
{
    [ApiController] // Defintion API-Controller
    [Route("api/[controller]")] // Route: /api/paymentprovider
    public class PaymentProviderController : ControllerBase
    {
        private readonly IPaymentProviderService _paymentProviderService;

        public PaymentProviderController(IPaymentProviderService paymentProviderService)
        {
            _paymentProviderService = paymentProviderService;
        }

        // GET: api/PaymentProvider
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentProvider>>> GetAllPaymentProviders()
        {
            var providers = await _paymentProviderService.GetAllProvidersAsync();
            return Ok(providers); 
        }

        // GET: api/PaymentProvider/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentProvider>> GetPaymentProvider(int id)
        {
            var provider = await _paymentProviderService.GetProviderByIdAsync(id);
            if (provider == null)
            {
                return NotFound();
            }
            return Ok(provider); 
        }

        // POST: api/PaymentProvider
        [HttpPost]
        public async Task<ActionResult<PaymentProvider>> AddPaymentProvider([FromBody] PaymentProvider provider)
        {
            await _paymentProviderService.AddProviderAsync(provider);
            return CreatedAtAction(nameof(GetPaymentProvider), new { id = provider.Id }, provider);
        }

        // PUT: api/PaymentProvider/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaymentProvider(int id, [FromBody] PaymentProvider provider)
        {
            if (id != provider.Id)
            {
                return BadRequest("ID in der URL stimmt nicht mit der ID im Body überein.");
            }

            try
            {
                await _paymentProviderService.UpdateProviderAsync(provider);
            }
            catch (ArgumentException ex) 
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Interner Serverfehler beim Aktualisieren.");
            }

            return NoContent(); 
        }

        // DELETE: api/PaymentProvider/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentProvider(int id)
        {
            try
            {
                await _paymentProviderService.DeleteProviderAsync(id);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message); 
            }
            catch (Exception) 
            {
                return StatusCode(500, "Interner Serverfehler beim Löschen."); 
            }

            return NoContent(); // 204 No Content
        }

        // PUT: api/PaymentProvider/{id}/status?isActive=true
        [HttpPut("{id}/status")]
        public async Task<IActionResult> SetPaymentProviderActiveStatus(int id, [FromQuery] bool isActive)
        {
            try
            {
                await _paymentProviderService.SetProviderActiveStatusAsync(id, isActive);
            }
            catch (ArgumentException ex) 
            {
                return NotFound(ex.Message); 
            }
            catch (Exception) 
            {
                return StatusCode(500, "Interner Serverfehler beim Aktualisieren des Status.");
            }

            return NoContent();
        }
    }
}