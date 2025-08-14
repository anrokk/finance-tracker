using BLL.DTOs;

namespace BLL.Contracts;

public interface ICategoryService
{
    Task<CategoryBllDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<CategoryBllDto>> GetAllByUserIdAsync(Guid userId);
    Task<CategoryBllDto> AddAsync(CreateCategoryBllDto categoryDto);
    Task UpdateAsync(Guid id, CreateCategoryBllDto categoryDto);
    Task DeleteAsync(Guid id);
}