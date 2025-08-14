using Domain;

namespace BLL.DTOs;

public class TransactionBllDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public Guid? AccountId { get; set; }
    public string? AccountName { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
}

public class CreateTransactionBllDto
{
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public Guid UserId { get; set; }
    public Guid? AccountId { get; set; }
    public Guid? CategoryId { get; set; }
}