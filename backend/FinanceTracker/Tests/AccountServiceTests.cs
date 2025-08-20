using BLL.Service;
using DAL.Contracts;
using DAL.DTOs;
using Domain;
using FluentAssertions;
using Moq;

namespace Tests;

public class AccountServiceTests
{
    private readonly Mock<IAccountRepository> _mockAccountRepository;
    private readonly Mock<ITransactionRepository> _mockTransactionRepository;
    private readonly AccountService _systemUnderTest;

    public AccountServiceTests()
    {
        _mockAccountRepository = new Mock<IAccountRepository>();
        _mockTransactionRepository = new Mock<ITransactionRepository>();
        _systemUnderTest = new AccountService(_mockAccountRepository.Object, _mockTransactionRepository.Object);
    }

    [Fact]
    public async Task GetAllByUserIdAsync_ShouldCalculateCurrentBalanceCorrectly()
    {
        var userId = Guid.NewGuid();
        var accountId = Guid.NewGuid();

        var accounts = new List<AccountDalDto>
        {
            new() { Id = accountId, Name = "Test Account", StartingBalance = 1000, UserId = userId }
        };

        var transactions = new List<TransactionDalDto>
        {
            new() { AccountId = accountId, Amount = 200, Type = TransactionType.Income },
            new() { AccountId = accountId, Amount = 50, Type = TransactionType.Expense },
            new() { AccountId = accountId, Amount = 50, Type = TransactionType.Expense },


            // transaction for another account
            new() { AccountId = Guid.NewGuid(), Amount = 1000, Type = TransactionType.Expense }
        };
        
        _mockAccountRepository.Setup(x => x.GetAllByUserIdAsync(userId)).ReturnsAsync(accounts);
        _mockTransactionRepository.Setup(x => x.GetAllByUserIdAsync(userId)).ReturnsAsync(transactions);

        var result = await _systemUnderTest.GetAllByUserIdAsync(userId);

        var resultList = result.ToList();
        resultList.Should().NotBeNull();
        resultList.Should().HaveCount(1);

        resultList.First().CurrentBalance.Should().Be(1100); // 1000 + 200 - 50 = 1150
    }
}