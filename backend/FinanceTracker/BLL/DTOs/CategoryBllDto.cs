namespace BLL.DTOs;

public class CategoryBllDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public Guid UserId { get; set; }
}

public class CreateCategoryBllDto
{
    public string Name { get; set; } = default!;
    public Guid UserId { get; set; }
}