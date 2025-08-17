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
    
    //GET /api/accounts
    [HttpGet]
    public async Task<IActionResult> GetUserAccounts()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized();
        }

        var userId = new Guid(userIdString);
        var accounts = await accountService.GetAllByUserIdAsync(userId);
        
        return Ok(accounts);
    }
    
    //POST /api/accounts
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountBllDto createDto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized();
        }
        
        createDto.UserId = new Guid(userIdString);

        var newAccount = await accountService.AddAsync(createDto);
        return Ok(newAccount);
    }
}