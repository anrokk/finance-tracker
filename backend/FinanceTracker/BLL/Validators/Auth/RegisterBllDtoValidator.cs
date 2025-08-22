using System.ComponentModel.DataAnnotations;
using BLL.DTOs.Identity;
using Domain;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace BLL.Validators.Auth;

public class RegisterBllDtoValidator : AbstractValidator<RegisterBllDto>
{
    public RegisterBllDtoValidator(UserManager<AppUser> userManager)
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required.")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters long.")
            .MaximumLength(20).WithMessage("Username must not exceed 20 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MustAsync(async (email, cancellation) => { return await userManager.FindByEmailAsync(email) == null; })
            .WithMessage("An account with this email already exists.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 3 characters long.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one number.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Password confirmation is required.")
            .Equal(x => x.Password).WithMessage("Passwords do not match.");
    }
}