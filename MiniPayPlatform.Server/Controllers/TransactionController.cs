using Microsoft.AspNetCore.Mvc;
using MiniPayPlatform.Server.Models;
using MiniPayPlatform.Server.Services;

namespace MiniPayPlatform.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        // GET: api/transactions
        [HttpGet]
        public async Task<ActionResult<Transaction>> GetTransactions()
        {
            var transactions = await _transactionService.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        // GET: api/transactions/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }
            return Ok(transaction);
        }

        // POST: api/transactions
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newTransaction = await _transactionService.AddTransactionAsync(transaction);
                return CreatedAtAction(nameof(GetTransaction), new { id = newTransaction.Id }, newTransaction);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error during transaction creation.");
            }
        }

        // PUT: api/transactions/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (id != transaction.Id)
            {
                return BadRequest("Transaction ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var success = await _transactionService.UpdateTransactionAsync(transaction);
                if (!success)
                {
                    return NotFound($"Transaction with ID {id} not found.");
                }
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error during transaction update.");
            }
        }

        // DELETE: api/transactions/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var success = await _transactionService.DeleteTransactionAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}