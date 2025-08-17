using System.Security.Claims;
using BLL.Contracts;
using BLL.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    // GET /api/categories
    [HttpGet]
    public async Task<IActionResult> GetAllUserCategories()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized();
        }
        
        var userId = new Guid(userIdString); 
        var categories = await categoryService.GetAllByUserIdAsync(userId);
        
        return Ok(categories);
    }
    
    // POST /api/categories
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryBllDto createDto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized();
        }
        createDto.UserId = new Guid(userIdString); 
        var newCategory = await categoryService.AddAsync(createDto);
        return Ok(newCategory);
    }
    
    // DELETE /api/categories/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        await categoryService.DeleteAsync(id);
        return NoContent();
    }
}