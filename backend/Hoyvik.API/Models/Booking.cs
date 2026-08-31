using Hoyvik.API.Data;

namespace Hoyvik.API.Models;

public class Booking
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
}

public enum BookingStatus
{
	Pending,
	Confirmed,
	Cancelled
}
