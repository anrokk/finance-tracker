using DAL.Contracts;
using DAL.DTOs;
using DAL.Mappers;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public async Task<CategoryDalDto?> GetByIdAsync(Guid id)
    {
        var category = await context.Categories.FindAsync(id);
        return category == null ? null : CategoryDalMapper.ToDalDto(category);
    }

    public async Task<IEnumerable<CategoryDalDto>> GetAllByUserIdAsync(Guid userId)
    {
        var categories = await context.Categories
            .Where(c => c.UserId == userId)
            .ToListAsync();

        return categories.Select(CategoryDalMapper.ToDalDto);
    }

    public async Task<CategoryDalDto> AddAsync(CreateCategoryDalDto categoryDto)
    {
        var category = CategoryDalMapper.ToDomain(categoryDto);
        await context.Categories.AddAsync(category);
        await context.SaveChangesAsync();
        return CategoryDalMapper.ToDalDto(category);
    }

    public async Task UpdateAsync(Guid id, CreateCategoryDalDto categoryDto)
    {
        var existingCategory = await context.Categories.FindAsync(id);
        if (existingCategory != null)
        {
            existingCategory.Name = categoryDto.Name;

            context.Categories.Update(existingCategory);
            await context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category != null)
        {
            context.Categories.Remove(category);
            await context.SaveChangesAsync();
        }
    }
}