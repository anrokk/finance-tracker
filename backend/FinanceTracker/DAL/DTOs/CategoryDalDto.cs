namespace DAL.DTOs;

public class CategoryDalDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public Guid UserId { get; set; }
}

public class CreateCategoryDalDto
{
    public string Name { get; set; } = default!;
    public Guid UserId { get; set; }
}