using BLL.DTOs;
using DAL.DTOs;

namespace BLL.Mappers;

public class AccountBllMapper
{
    public static AccountBllDto ToBllDto(AccountDalDto? dalDto)
    {
        return new AccountBllDto
        {
            Id = dalDto.Id,
            Name = dalDto.Name,
            StartingBalance = dalDto.StartingBalance,
            UserId = dalDto.UserId,
        };
    }

    public static CreateAccountDalDto ToDalDto(CreateAccountBllDto bllDto)
    {
        return new CreateAccountDalDto
        {
            Name = bllDto.Name,
            StartingBalance = bllDto.StartingBalance,
            UserId = bllDto.UserId
        };
    }
}