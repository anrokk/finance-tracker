using DAL.DTOs;
using Domain;

namespace DAL.Mappers;

public class TransactionDalMapper
{
    public static TransactionDalDto ToDalDto(Transaction entity)
    {
        return new TransactionDalDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Amount = entity.Amount,
            Date = entity.Date,
            Type = entity.Type,
            AccountId = entity.AccountId,
            AccountName = entity.Account?.Name,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category?.Name
        };
    }

    public static Transaction ToDomain(CreateTransactionDalDto dto)
    {
        return new Transaction
        {
            Name = dto.Name,
            Description = dto.Description,
            Amount = dto.Amount,
            Date = dto.Date,
            Type = dto.Type,
            UserId = dto.UserId,
            AccountId = dto.AccountId,
            CategoryId = dto.CategoryId
        };
    }
}