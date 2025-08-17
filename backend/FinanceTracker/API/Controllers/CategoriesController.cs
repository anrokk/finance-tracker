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
    private Guid UserId => new(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    
    
    // GET /api/categories
    [HttpGet]
    public async Task<IActionResult> GetUserCategories()
    {
        var categories = await categoryService.GetAllByUserIdAsync(UserId);
        return Ok(categories);
    }
    
    // GET /api/categories/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(Guid id)
    {
        var category = await categoryService.GetByIdAsync(id);
        
        if (category == null || category.UserId != UserId)
        {
            return NotFound();
        }

        return Ok(category);
    }
    
    // POST /api/categories
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryBllDto createDto)
    {
        createDto.UserId = UserId;

        var newCategory = await categoryService.AddAsync(createDto);
        return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, newCategory);
    }
    
    // PUT /api/categories/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryBllDto updateDto)
    {
        var category = await categoryService.GetByIdAsync(id);

        if (category == null || category.UserId != UserId)
        {
            return NotFound();
        }

        updateDto.UserId = UserId;
        await categoryService.UpdateAsync(id, updateDto);

        return NoContent();
    }
    
    // DELETE /api/categories/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await categoryService.GetByIdAsync(id);

        if (category == null || category.UserId != UserId)
        {
            return NoContent();
        }

        await categoryService.DeleteAsync(id);
        return NoContent();
    }
}