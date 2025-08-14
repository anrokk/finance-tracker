namespace Domain;

public class Category
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    
    public Guid UserId { get; set; }
    
    public ICollection<Transaction>? Transactions { get; set;  }
}