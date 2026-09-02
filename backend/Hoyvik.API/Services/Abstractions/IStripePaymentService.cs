using Hoyvik.API.Models;

namespace Hoyvik.API.Services.Abstractions;

public interface IStripePaymentService
{
    Task<StripeCheckoutSession> CreateCheckoutSession(Booking booking, CancellationToken ct = default);
}

//TODO: move this somewhere else
public record StripeCheckoutSession(
    string SessionId,
    string Url);