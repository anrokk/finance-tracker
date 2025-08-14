using DAL.DTOs;

namespace DAL.Contracts;

public interface IAccountRepository
{
    Task<AccountDalDto?>? GetByIdAsync(Guid id);
    Task<IEnumerable<AccountDalDto?>> GetAllByUserIdAsync(Guid userId);
    Task<AccountDalDto?> AddAsync(CreateAccountDalDto accountDto);
    Task UpdateAsync(Guid id, CreateAccountDalDto accountDto);
    Task DeleteAsync(Guid id);
}