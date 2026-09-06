using Hoyvik.API.Models;
using Hoyvik.API.Models.Stripe;

namespace Hoyvik.API.Services.Abstractions;

internal interface IStripePaymentService
{
    Task<StripeCheckoutSession> CreateCheckoutSession(Booking booking, CancellationToken ct = default);
}
