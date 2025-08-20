using BLL.DTOs;
using BLL.Service;
using DAL.Contracts;
using DAL.DTOs;
using FluentAssertions;
using Moq;

namespace Tests;

public class TransactionServiceTests
{
    private readonly Mock<ITransactionRepository> _mockTransactionRepo;
    private readonly TransactionService _testTransactionService;

    public TransactionServiceTests()
    {
        _mockTransactionRepo = new Mock<ITransactionRepository>();
        _testTransactionService = new TransactionService(_mockTransactionRepo.Object);
    }

    [Fact]
    public async Task AddAsync_ShouldReturnTransactionBllDto_WhenTransactionIsCreated()
    {
        var createBllDto = new CreateTransactionBllDto()
        {
            Name = "Test Transaction",
            Description = "Test Description",
            Amount = 100,
            Date = DateTime.UtcNow,
            Type = Domain.TransactionType.Expense,
            UserId = Guid.NewGuid(),
            AccountId = Guid.NewGuid(),
            CategoryId = Guid.NewGuid()
        };

        var returnedDalDto = new TransactionDalDto()
        {
            Id = Guid.NewGuid(),
            Name = createBllDto.Name,
            Description = createBllDto.Description,
            Amount = createBllDto.Amount,
            Date = createBllDto.Date,
            Type = createBllDto.Type,
            UserId = createBllDto.UserId,
            AccountId = createBllDto.AccountId,
            CategoryId = createBllDto.CategoryId
        };

        _mockTransactionRepo.Setup(x => x
                .AddAsync(It.IsAny<CreateTransactionDalDto>()))
            .ReturnsAsync(returnedDalDto);

        var result = await _testTransactionService.AddAsync(createBllDto);

        result.Should().NotBeNull();
        result.Id.Should().Be(returnedDalDto.Id);
        result.Name.Should().Be(createBllDto.Name);
        result.Description.Should().Be(createBllDto.Description);
        result.Amount.Should().Be(createBllDto.Amount);
        result.Date.Should().Be(createBllDto.Date);
        result.Type.Should().Be(createBllDto.Type);
        result.UserId.Should().Be(createBllDto.UserId);
        result.AccountId.Should().Be(createBllDto.AccountId);
        result.CategoryId.Should().Be(createBllDto.CategoryId);
    }
}