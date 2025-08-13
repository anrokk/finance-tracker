namespace Domain;

public class Budget
{
    public Guid Id { get; set; }
    
    public decimal Amount { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    
    public Guid? CateogryId { get; set; }
    public Category? Category { get; set; }

    public Guid UserId { get; set; }
}