namespace Hoyvik.API.Models;

public class BlockedPeriod
{
    public int Id { get; set; }

    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }

    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; } 
}
