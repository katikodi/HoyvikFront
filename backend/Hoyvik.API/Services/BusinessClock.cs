using Hoyvik.API.Services.Abstractions;

namespace Hoyvik.API.Services;

public class BusinessClock : IBusinessClock
{
    private static readonly TimeZoneInfo NorwayTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Oslo");
    public DateOnly Today =>
        DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.UtcNow,
                NorwayTimeZone));
}
