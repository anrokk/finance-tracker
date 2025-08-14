using BLL.Contracts;
using BLL.DTOs;
using BLL.Mappers;
using DAL.Contracts;

namespace BLL.Service;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public async Task<CategoryBllDto?> GetByIdAsync(Guid id)
    {
        var dalDto = await categoryRepository.GetByIdAsync(id);
        return dalDto == null ? null : CategoryBllMapper.ToBllDto(dalDto);
    }

    public async Task<IEnumerable<CategoryBllDto>> GetAllByUserIdAsync(Guid userId)
    {
        var dalDtos = await categoryRepository.GetAllByUserIdAsync(userId);
        return dalDtos.Select(CategoryBllMapper.ToBllDto);
    }

    public async Task<CategoryBllDto> AddAsync(CreateCategoryBllDto categoryDto)
    {
        var dalCreateDto = CategoryBllMapper.ToDalDto(categoryDto);
        var dalDto = await categoryRepository.AddAsync(dalCreateDto);
        return CategoryBllMapper.ToBllDto(dalDto);
    }

    public async Task UpdateAsync(Guid id, CreateCategoryBllDto categoryDto)
    {
        var dalCreateDto = CategoryBllMapper.ToDalDto(categoryDto);
        await categoryRepository.UpdateAsync(id, dalCreateDto);
    }

    public async Task DeleteAsync(Guid id)
    {
        await categoryRepository.DeleteAsync(id);
    }
}