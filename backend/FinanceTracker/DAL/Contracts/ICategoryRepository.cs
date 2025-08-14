using DAL.DTOs;

namespace DAL.Contracts;

public interface ICategoryRepository
{
    Task<CategoryDalDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<CategoryDalDto>> GetAllByUserIdAsync(Guid userId);
    Task<CategoryDalDto> AddAsync(CreateCategoryDalDto categoryDto);
    Task UpdateAsync(Guid id, CreateCategoryDalDto categoryDto);
    Task DeleteAsync(Guid id);
}