using BLL.DTOs;

namespace BLL.Contracts;

public interface ITransactionService
{
    Task<TransactionBllDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<TransactionBllDto>> GetAllByUserIdAsync(Guid userId);
    Task<TransactionBllDto> AddAsync(CreateTransactionBllDto transactionBllDto);
    Task UpdateAsync(Guid id, CreateTransactionBllDto transactionBllDto);
    Task DeleteAsync(Guid id);
}