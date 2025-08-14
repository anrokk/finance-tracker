namespace DAL.DTOs;

public class AccountDalDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public decimal StartingBalance { get; set; }
}

public class CreateAccountDalDto
{
    public string Name { get; set; } = default!;
    public decimal StartingBalance { get; set; }
    public Guid UserId { get; set; }
}