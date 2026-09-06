namespace Hoyvik.API.Models.Stripe;

internal sealed record StripeCheckoutSession(string SessionId, string Url);