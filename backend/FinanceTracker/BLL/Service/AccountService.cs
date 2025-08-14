using BLL.Contracts;
using BLL.DTOs;
using BLL.Mappers;
using DAL.Contracts;
using DAL.DTOs;
using Domain;

namespace BLL.Service;

public class AccountService(IAccountRepository accountRepository, ITransactionRepository transactionRepository) : IAccountService
{
    public async Task<AccountBllDto?> GetAccountByIdAsync(Guid accountId, Guid userId)
    {
        var dalDto = await accountRepository.GetByIdAsync(accountId)!;
        if (dalDto == null) return null;

        var bllDto = AccountBllMapper.ToBllDto(dalDto);

        var allUserTransactions = await transactionRepository.GetAllByUserIdAsync(userId);

        var accountTransactions = allUserTransactions
            .Where(t => t.AccountId == accountId)
            .ToList();
        
        var totalIncome = accountTransactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);
        var totalExpense = accountTransactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);
        
        bllDto.CurrentBalance = dalDto.StartingBalance + totalIncome - totalExpense;

        return bllDto;
    }

    public async Task<IEnumerable<AccountBllDto>> GetAllByUserIdAsync(Guid userId)
    {
        var accountDalDtos = await accountRepository.GetAllByUserIdAsync(userId);
        var allUserTransactions = await transactionRepository.GetAllByUserIdAsync(userId);

        var transactionsByAccount = allUserTransactions
            .Where(t => t.AccountId.HasValue)
            .GroupBy(t => t.AccountId!.Value)
            .ToDictionary(g => g.Key, g => g.ToList());
        
        var accountBllDtos = new List<AccountBllDto>();

        foreach (var accountDalDto in accountDalDtos)
        {
            var bllDto = AccountBllMapper.ToBllDto(accountDalDto);
            if (transactionsByAccount.TryGetValue(bllDto.Id, out var accountTransactions))
            {
                var totalIncome = accountTransactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
                var totalExpense = accountTransactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);
                bllDto.CurrentBalance = bllDto.StartingBalance + totalIncome - totalExpense;
            }
            else
            {
                bllDto.CurrentBalance = bllDto.StartingBalance;
            }
            accountBllDtos.Add(bllDto);
        }

        return accountBllDtos;
    }

    public async Task<AccountBllDto> AddAsync(CreateAccountBllDto accountBllDto)
    {
        var dalCreateDto = AccountBllMapper.ToDalDto(accountBllDto);
        var dalDto = await accountRepository.AddAsync(dalCreateDto);
        return AccountBllMapper.ToBllDto(dalDto);
    }

    public async Task UpdateAsync(Guid id, CreateAccountBllDto accountBllDto)
    {
        var dalCreateDto = AccountBllMapper.ToDalDto(accountBllDto);
        await accountRepository.UpdateAsync(id, dalCreateDto);
    }

    public async Task DeleteAsync(Guid id)
    {
        await accountRepository.DeleteAsync(id);
    }
}