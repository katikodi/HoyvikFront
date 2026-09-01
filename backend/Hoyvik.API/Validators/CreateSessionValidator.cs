using FluentValidation;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Validators;

    public class CreateSessionValidator : AbstractValidator<CreateSessionRequest>
    {
        public CreateSessionValidator()
        {
            RuleFor(x => x.NumberOfGuests)
                .InclusiveBetween(1, 4)
                .WithMessage("Guests must be between 1 and 4.");

            RuleFor(x => x.CheckIn)
                .NotEqual(default(DateOnly))
                .WithMessage("Check-in date is required.")
                .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Check-in date cannot be in the past.");

            RuleFor(x => x.CheckOut)
                .NotEqual(default(DateOnly))
                .WithMessage("Check-out date is required.")
                .GreaterThan(x => x.CheckIn)
                .WithMessage("Check-out date must be after check-in.");
        }
    }



