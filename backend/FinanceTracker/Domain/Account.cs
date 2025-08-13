namespace Domain;

public class Account
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;
    public decimal StartingBalance { get; set; }
    
    public Guid UserId { get; set; }
    
    public ICollection<Transaction>? Transactions { get; set; }
}