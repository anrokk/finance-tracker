namespace BLL.DTOs;

public class AccountBllDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public decimal StartingBalance { get; set; }
    public decimal CurrentBalance { get; set; }
}

public class CreateAccountBllDto
{
    public string Name { get; set; } = default!;
    public decimal StartingBalance { get; set; }
    public Guid UserId { get; set; }
}