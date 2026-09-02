using System.ComponentModel.DataAnnotations;

namespace Hoyvik.API.Configuration;


//TODO: Change everything to seconds
public class BookingConfiguration
{
    /// <summary>
    /// Expiration time in minutes
    /// </summary>
    [Required, Range(1, 5000)]
    public int ExpirationTime { get; set; } = 30;

    /// <summary>
    /// Price per night in NOK
    /// </summary>
    [Required]
    public decimal PricePerNight { get; set; } = 1050m;

    /// <summary>
    /// Time until next cleanup check in seconds
    /// </summary>
    [Required, Range(1, 300)]
    public int CleanupPollRate { get; set; } = 60;
}
