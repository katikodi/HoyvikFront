
using Hoyvik.API.Models;

namespace Hoyvik.API.Services;

public interface IBookingService
{
    Task<string> CreateCheckoutSession(CreateSessionRequest request, string? userId, CancellationToken ct = default);
    Task<bool> ConfirmBooking(int bookingId, string stripeSessionId, CancellationToken ct = default);
    Task<bool> ExpireBooking(int bookingId, string stripeSessionId, CancellationToken ct = default);
    Task<bool> CheckAvailability(DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default);
}
