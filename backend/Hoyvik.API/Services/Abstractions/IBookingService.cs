using Hoyvik.API.Models.Requests;

namespace Hoyvik.API.Services.Abstractions;

public interface IBookingService
{
    Task<Result<string>> CreateBookingPaymentSession(CreateSessionRequest request, string userId, CancellationToken ct = default);
    Task<Result> ConfirmBooking(int bookingId, string stripeSessionId, CancellationToken ct = default);
    Task<Result> ExpireBooking(int bookingId, string stripeSessionId, CancellationToken ct = default);
    Task<bool> CheckAvailability(DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default);
}
