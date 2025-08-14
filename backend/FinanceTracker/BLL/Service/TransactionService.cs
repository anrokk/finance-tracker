using BLL.Contracts;
using BLL.DTOs;
using BLL.Mappers;
using DAL.Contracts;

namespace BLL.Service;

public class TransactionService(ITransactionRepository repository) : ITransactionService
{
    public async Task<TransactionBllDto?> GetByIdAsync(Guid id)
    {
        var dalDto = await repository.GetByIdAsync(id);
        return dalDto == null ? null : TransactionBllMapper.ToBllDto(dalDto);
    }

    public async Task<IEnumerable<TransactionBllDto>> GetAllByUserIdAsync(Guid userId)
    {
        var dalDtos = await repository.GetAllByUserIdAsync(userId);
        return dalDtos.Select(TransactionBllMapper.ToBllDto);
    }

    public async Task<TransactionBllDto> AddAsync(CreateTransactionBllDto transactionBllDto)
    {
        var dalCreateDto = TransactionBllMapper.ToDalDto(transactionBllDto);
        var dalDto = await repository.AddAsync(dalCreateDto);
        return TransactionBllMapper.ToBllDto(dalDto);
    }

    public async Task UpdateAsync(Guid id, CreateTransactionBllDto transactionBllDto)
    {
        var dalCreateDto = TransactionBllMapper.ToDalDto(transactionBllDto);
        await repository.UpdateAsync(id, dalCreateDto);
    }

    public async Task DeleteAsync(Guid id)
    {
        await repository.DeleteAsync(id);
    }
}