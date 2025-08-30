using BLL.DTOs;
using FluentValidation;

namespace BLL.Validators;

public class CreateTransactionBllDtoValidator : AbstractValidator<CreateTransactionBllDto>
{
    public CreateTransactionBllDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Transaction name is required.")
            .MaximumLength(100).WithMessage("Transaction name must not exceed 100 characters.");
        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Transaction description must not exceed 500 characters.");
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Transaction amount must be greater than zero.");
        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Transaction date is required.")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Transaction date cannot be in the future.");
    }
}