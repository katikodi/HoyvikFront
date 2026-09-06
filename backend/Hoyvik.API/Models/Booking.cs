using Hoyvik.API.Data;

namespace Hoyvik.API.Models;

internal sealed class Booking
{
    public int Id { get; set; }
    public string? StripeSessionId { get; set; }
    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }

    public decimal Price { get; set; }

    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public int NumberOfGuests { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    public DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

internal enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Expired
}
