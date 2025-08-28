using BLL.DTOs;
using DAL.DTOs;

namespace BLL.Mappers;

public class TransactionBllMapper
{
    public static TransactionBllDto ToBllDto(TransactionDalDto dalDto)
    {
        return new TransactionBllDto
        {
            Id = dalDto.Id,
            Name = dalDto.Name,
            Description = dalDto.Description,
            Amount = dalDto.Amount,
            Date = dalDto.Date,
            Type = dalDto.Type,
            UserId = dalDto.UserId,
            AccountId = dalDto.AccountId,
            AccountName = dalDto.AccountName,
            CategoryId = dalDto.CategoryId,
            CategoryName = dalDto.CategoryName
        };
    }

    public static CreateTransactionDalDto ToDalDto(CreateTransactionBllDto bllDto)
    {
        return new CreateTransactionDalDto
        {
            Name = bllDto.Name,
            Description = bllDto.Description!,
            Amount = bllDto.Amount,
            Date = bllDto.Date.ToUniversalTime(),
            Type = bllDto.Type,
            UserId = bllDto.UserId,
            AccountId = bllDto.AccountId,
            CategoryId = bllDto.CategoryId
        };
    }
}