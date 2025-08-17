using System.Security.Claims;
using BLL.Contracts;
using BLL.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountsController(IAccountService accountService) : ControllerBase
{
    private Guid UserId => new(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET /api/accounts
    [HttpGet]
    public async Task<IActionResult> GetUserAccounts()
    {
        var accounts = await accountService.GetAllByUserIdAsync(UserId);
        return Ok(accounts);
    }

    // GET /api/accounts/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSingleAccount(Guid id)
    {
        var account = await accountService.GetAccountByIdAsync(id, UserId);

        if (account == null || account.UserId != UserId)
        {
            return NotFound();
        }

        return Ok(account);
    }

    // POST /api/accounts
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountBllDto createDto)
    {
        createDto.UserId = UserId;

        var newAccount = await accountService.AddAsync(createDto);

        return CreatedAtAction(nameof(GetSingleAccount), new { id = newAccount.Id }, newAccount);
    }

    // PUT /api/accounts/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccount(Guid id, [FromBody] CreateAccountBllDto updateDto)
    {
        var account = await accountService.GetAccountByIdAsync(id, UserId);

        if (account == null || account.UserId != UserId)
        {
            return NotFound();
        }

        updateDto.UserId = UserId;
        await accountService.UpdateAsync(id, updateDto);

        return NoContent();
    }
    
    // DELETE /api/accounts/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(Guid id)
    {
        var account = await accountService.GetAccountByIdAsync(id, UserId);
        
        if (account == null || account.UserId != UserId)
        {
            return NotFound();
        }
        
        await accountService.DeleteAsync(id);
        return NoContent();
    }
}