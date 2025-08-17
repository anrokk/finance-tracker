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
    // GET /api/transactions
    [HttpGet]
    public async Task<IActionResult> GetAllUserTransactions()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized();
        }
        var userId = new Guid(userIdString);  
        var transactions = await transactionService.GetAllByUserIdAsync(userId);
        return Ok(transactions);
    }
    
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
    
    // POST /api/transactions
    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionBllDto createDto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized();
        }
        createDto.UserId = new Guid(userIdString); 
        var newTransaction = await transactionService.AddAsync(createDto);
        return CreatedAtAction(nameof(GetSingleTransaction), new { id = newTransaction.Id }, newTransaction);
    }
    
    // PUT /api/transactions/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] CreateTransactionBllDto updateDto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized();
        }

        var existingTransaction = await transactionService.GetByIdAsync(id);
        
        if (existingTransaction == null)
        {
            return NotFound();
        }
        
        updateDto.UserId = new Guid(userIdString); 

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