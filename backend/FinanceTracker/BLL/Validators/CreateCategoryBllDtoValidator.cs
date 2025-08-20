using BLL.DTOs;
using FluentValidation;

namespace BLL.Validators;

public abstract class CreateCategoryBllDtoValidator : AbstractValidator<CreateCategoryBllDto>
{
    protected CreateCategoryBllDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100).WithMessage("Name must not exceed 50 characters.");
    }
}