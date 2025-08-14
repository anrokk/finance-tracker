using DAL.Contracts;
using DAL.DTOs;
using DAL.Mappers;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class TransactionRepository(AppDbContext context) : ITransactionRepository
{
    public async Task<TransactionDalDto?> GetByIdAsync(Guid id)
    {
        var transaction = await context.Transactions
            .Include(t => t.Account)
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);
        
        return transaction == null ? null : TransactionDalMapper.ToDalDto(transaction);
    }

    public async Task<IEnumerable<TransactionDalDto>> GetAllByUserIdAsync(Guid userId)
    {
        var transactions = await context.Transactions
            .Where(t => t.UserId == userId)
            .Include(t => t.Account)
            .Include(t => t.Category)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

        return transactions.Select(TransactionDalMapper.ToDalDto);
    }

    public async Task<TransactionDalDto> AddAsync(CreateTransactionDalDto transactionDto)
    { 
        var transaction = TransactionDalMapper.ToDomain(transactionDto);
        await context.Transactions.AddAsync(transaction);
        await context.SaveChangesAsync();
        return TransactionDalMapper.ToDalDto(transaction);
    }

    public async Task UpdateAsync(Guid id, CreateTransactionDalDto transactionDto)
    {
        var existingTransaction = await context.Transactions.FindAsync(id);
        if (existingTransaction != null)
        {
            existingTransaction.Name = transactionDto.Name;
            existingTransaction.Description = transactionDto.Description;
            existingTransaction.Amount = transactionDto.Amount;
            existingTransaction.Date = transactionDto.Date;
            existingTransaction.Type = transactionDto.Type;
            existingTransaction.AccountId = transactionDto.AccountId;
            existingTransaction.CategoryId = transactionDto.CategoryId;
            
            context.Transactions.Update(existingTransaction);
            await context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        var dbEntity = await context.Transactions.FindAsync(id);
        if (dbEntity == null) return;
        context.Transactions.Remove(dbEntity);
        await context.SaveChangesAsync();
    }
}