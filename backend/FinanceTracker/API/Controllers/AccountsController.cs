using BLL.Contracts;
using BLL.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController(IAccountService accountService) : ControllerBase
{
    
    //GET /api/accounts
    [HttpGet]
    public async Task<IActionResult> GetUserAccounts()
    {
        var userId = new Guid("11111111-1111-1111-1111-111111111111");

        var accounts = await accountService.GetAllByUserIdAsync(userId);
        return Ok(accounts);
    }
    
    //POST /api/accounts
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountBllDto createDto)
    {
        createDto.UserId = new Guid("11111111-1111-1111-1111-111111111111");

        var newAccount = await accountService.AddAsync(createDto);
        return Ok(newAccount);
    }
}