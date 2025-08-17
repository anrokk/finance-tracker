using BLL.DTOs;
using DAL.DTOs;

namespace BLL.Mappers;

public class CategoryBllMapper
{
    public static CategoryBllDto ToBllDto(CategoryDalDto dalDto)
    {
        return new CategoryBllDto
        {
            Id = dalDto.Id,
            Name = dalDto.Name,
            UserId = dalDto.UserId,
        };
    }

    public static CreateCategoryDalDto ToDalDto(CreateCategoryBllDto bllDto)
    {
        return new CreateCategoryDalDto
        {
            Name = bllDto.Name,
            UserId = bllDto.UserId
        };
    }
}