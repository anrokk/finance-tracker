using BLL.DTOs;

namespace BLL.Contracts;

public interface IAccountService
{
    Task<AccountBllDto?> GetAccountByIdAsync(Guid accountId, Guid userId);
    Task<IEnumerable<AccountBllDto>> GetAllByUserIdAsync(Guid userId);
    Task<AccountBllDto> AddAsync(CreateAccountBllDto accountDto);
    Task UpdateAsync(Guid id, CreateAccountBllDto accountDto);
    Task DeleteAsync(Guid id);
}