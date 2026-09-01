
using Hoyvik.API.Models;

namespace Hoyvik.API.Services;

public interface IBookingService
{
    Task<string> CreateCheckoutSession(CreateSessionRequest request, string? userId, CancellationToken ct = default);
}
