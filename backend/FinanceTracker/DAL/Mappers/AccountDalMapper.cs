using DAL.DTOs;
using Domain;

namespace DAL.Mappers;

public class AccountDalMapper
{
    public static AccountDalDto? ToDalDto(Account entity)
    {
        return new AccountDalDto
        {
            Id = entity.Id,
            Name = entity.Name,
            StartingBalance = entity.StartingBalance,
            UserId = entity.UserId
        };
    }

    public static Account ToDomain(CreateAccountDalDto dto)
    {
        return new Account
        {
            Name = dto.Name,
            StartingBalance = dto.StartingBalance,
            UserId = dto.UserId
        };
    }
}