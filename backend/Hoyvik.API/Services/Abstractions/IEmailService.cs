namespace Hoyvik.API.Services.Abstractions;

public interface IEmailService
{
    Task SendBookingConfirmation(string email, string bookingReference, DateOnly checkIn, DateOnly checkOut);
}
