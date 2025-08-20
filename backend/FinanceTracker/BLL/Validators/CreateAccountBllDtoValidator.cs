using BLL.DTOs;
using FluentValidation;

namespace BLL.Validators;

public abstract class CreateAccountBllDtoValidator : AbstractValidator<CreateAccountBllDto>
{
    protected CreateAccountBllDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Account name is required.")
            .MaximumLength(100).WithMessage("Account name must not exceed 100 characters.");

        RuleFor(x => x.StartingBalance)
            .GreaterThanOrEqualTo(0).WithMessage("Starting balance must be zero or greater.");
    }
}