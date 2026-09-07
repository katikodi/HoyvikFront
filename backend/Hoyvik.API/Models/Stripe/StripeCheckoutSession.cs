namespace Hoyvik.API.Models.Stripe;

public sealed record StripeCheckoutSession(string SessionId, string Url);