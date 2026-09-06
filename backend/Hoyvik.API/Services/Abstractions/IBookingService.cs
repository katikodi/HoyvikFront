using Hoyvik.API.Models.Requests;

namespace Hoyvik.API.Services.Abstractions;

public interface IBookingService
{
    Task<string> CreateBookingPaymentSession(CreateSessionRequest request, string? userId, CancellationToken ct = default);
    Task<bool> ConfirmBooking(int bookingId, string stripeSessionId, CancellationToken ct = default);
    Task<bool> ExpireBooking(int bookingId, string stripeSessionId, CancellationToken ct = default);
    Task<bool> CheckAvailability(DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default);
}
