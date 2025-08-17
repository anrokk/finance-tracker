using System.Security.Claims;
using BLL.Contracts;
using BLL.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController(ITransactionService transactionService) : ControllerBase
{
    private Guid UserId => new(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET /api/transactions
    [HttpGet]
    public async Task<IActionResult> GetAllUserTransactions()
    {
        var transactions = await transactionService.GetAllByUserIdAsync(UserId);
        return Ok(transactions);
    }

    // GET /api/transactions/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSingleTransaction(Guid id)
    {
        var transaction = await transactionService.GetByIdAsync(id);
        
        if (transaction == null || transaction.UserId != UserId)
        {
            return NotFound();
        }

        return Ok(transaction);
    }

    // POST /api/transactions
    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionBllDto createDto)
    {
        createDto.UserId = UserId;
        var newTransaction = await transactionService.AddAsync(createDto);
        return CreatedAtAction(nameof(GetSingleTransaction), new { id = newTransaction.Id }, newTransaction);
    }

    // PUT /api/transactions/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] CreateTransactionBllDto updateDto)
    {
        var transaction = await transactionService.GetByIdAsync(id);

        if (transaction == null || transaction.UserId != UserId)
        {
            return NotFound();
        }

        updateDto.UserId = UserId;
        await transactionService.UpdateAsync(id, updateDto);
        return NoContent();
    }

    // DELETE /api/transactions/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        var transaction = await transactionService.GetByIdAsync(id);

        if (transaction == null || transaction.UserId != UserId)
        {
            return NoContent();
        }

        await transactionService.DeleteAsync(id);
        return NoContent();
    }
}