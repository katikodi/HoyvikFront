using Hoyvik.API.Data;

namespace Hoyvik.API.Models;

public class Booking
{
	public int Id { get; set; }
	public string SessionId { get; set; } = string.Empty;
	public DateTime CheckIn { get; set; }
	public DateTime CheckOut { get; set; }
	public string? UserId { get; set; } = string.Empty;
	public ApplicationUser? User { get; set; } = default!;
	public int NumberOfGuests { get; set; }
	public BookingStatus Status { get; set; }
}

public enum BookingStatus
{
	Pending,
	Confirmed,
	Cancelled,
	Completed
}
