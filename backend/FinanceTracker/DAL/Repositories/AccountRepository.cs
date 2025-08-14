using DAL.Contracts;
using DAL.DTOs;
using DAL.Mappers;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class AccountRepository(AppDbContext context) : IAccountRepository
{
    public async Task<AccountDalDto?> GetByIdAsync(Guid id)
    {
        var account = await context.Accounts.FindAsync(id);
        return account == null ? null : AccountDalMapper.ToDalDto(account);
    }

    public async Task<IEnumerable<AccountDalDto?>> GetAllByUserIdAsync(Guid userId)
    {
        var accounts = await context.Accounts
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return accounts.Select(AccountDalMapper.ToDalDto);
    }

    public async Task<AccountDalDto?> AddAsync(CreateAccountDalDto accountDto)
    {
        var account = AccountDalMapper.ToDomain(accountDto);
        await context.Accounts.AddAsync(account);
        await context.SaveChangesAsync();
        return AccountDalMapper.ToDalDto(account);
    }

    public async Task UpdateAsync(Guid id, CreateAccountDalDto accountDto)
    {
        var existingAccount = await context.Accounts.FindAsync(id);
        if (existingAccount != null)
        {
            existingAccount.Name = accountDto.Name;
            existingAccount.StartingBalance = accountDto.StartingBalance;
            
            context.Accounts.Update(existingAccount);
            await context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        var account = await context.Accounts.FindAsync(id);
        if (account != null)
        {
            context.Accounts.Remove(account);
            await context.SaveChangesAsync();
        }
    }
}