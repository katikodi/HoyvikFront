using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace Hoyvik.API.Services;

public class FakeEmailService(ILogger<FakeEmailService> logger) : IEmailService
{
    private readonly ILogger<FakeEmailService> _logger = logger;

    public Task SendBookingConfirmation(
        string email,
        string bookingReference,
        DateOnly checkIn,
        DateOnly checkOut)
    {
        _logger.LogInformation(
            """
            FAKE EMAIL

            To: {Email}
            Subject: Booking confirmation

            Booking reference: {Reference}
            Check-in: {CheckIn:dd.MM.yyyy}
            Check-out: {CheckOut:dd.MM.yyyy}
            """,
            email,
            bookingReference,
            checkIn,
            checkOut
        );

        return Task.CompletedTask;
    }
}