using BLL.DTOs.Identity;
using FluentValidation;

namespace BLL.Validators.Auth;

public class LoginBllDtoValidator : AbstractValidator<LoginBllDto>
{
    public LoginBllDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email is not valid.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}