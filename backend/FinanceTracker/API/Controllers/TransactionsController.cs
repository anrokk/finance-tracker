using BLL.Contracts;
using BLL.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController(ITransactionService transactionService) : ControllerBase
{
    // GET /api/transactions/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSingleTransaction(Guid id)
    {
        var transaction = await transactionService.GetByIdAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }

        return Ok(transaction);
    }
    
    // GET /api/transactions
    [HttpGet]
    public async Task<IActionResult> GetAllUserTransactions()
    {
        var userId = new Guid("11111111-1111-1111-1111-111111111111");  // for now
        var transactions = await transactionService.GetAllByUserIdAsync(userId);
        return Ok(transactions);
    }
    
    // POST /api/transactions
    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionBllDto createDto)
    {
        createDto.UserId = new Guid("11111111-1111-1111-1111-111111111111"); // for now

        var newTransaction = await transactionService.AddAsync(createDto);
        return CreatedAtAction(nameof(GetSingleTransaction), new { id = newTransaction.Id }, newTransaction);
    }
    
    // PUT /api/transactions/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] CreateTransactionBllDto updateDto)
    {
        updateDto.UserId = new Guid("11111111-1111-1111-1111-111111111111"); // for now

        await transactionService.UpdateAsync(id, updateDto);
        return NoContent();
    }
    
    // DELETE /api/transactions/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        await transactionService.DeleteAsync(id);
        return NoContent();
    }
}