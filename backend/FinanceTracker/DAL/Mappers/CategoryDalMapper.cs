using DAL.DTOs;
using Domain;

namespace DAL.Mappers;

public class CategoryDalMapper
{
    public static CategoryDalDto ToDalDto(Category category)
    {
        return new CategoryDalDto
        {
            Id = category.Id,
            Name = category.Name
        };
    }

    public static Category ToDomain(CreateCategoryDalDto dto)
    {
        return new Category
        {
            Name = dto.Name,
            UserId = dto.UserId
        };
    }
}