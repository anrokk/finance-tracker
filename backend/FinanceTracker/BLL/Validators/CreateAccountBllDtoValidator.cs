using BLL.DTOs;
using FluentValidation;

namespace BLL.Validators;

public class CreateAccountBllDtoValidator : AbstractValidator<CreateAccountBllDto>
{
    public CreateAccountBllDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Account name is required.")
            .MaximumLength(100).WithMessage("Account name must not exceed 100 characters.");

        RuleFor(x => x.StartingBalance)
            .GreaterThanOrEqualTo(0).WithMessage("Starting balance must be zero or greater.");
    }
}