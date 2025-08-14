using DAL.DTOs;

namespace DAL.Contracts;

public interface ITransactionRepository
{
    Task<TransactionDalDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<TransactionDalDto>> GetAllByUserIdAsync(Guid userId);
    Task<TransactionDalDto> AddAsync(CreateTransactionDalDto transactionDto);
    Task UpdateAsync(Guid id, CreateTransactionDalDto transactionDto);
    Task DeleteAsync(Guid id);
}