namespace Domain;

public enum TransactionType
{
    Income,
    Expense
}

public class Transaction
{
    public Guid Id { get; set; }

    public string Description { get; set; } = default!;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    
    public Guid UserId { get; set; }
    
    public Guid? AccountId { get; set; }
    public Account? Account { get; set; }

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
}