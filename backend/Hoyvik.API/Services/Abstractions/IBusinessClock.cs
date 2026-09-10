namespace Hoyvik.API.Services.Abstractions;

public interface IBusinessClock
{
    DateOnly Today { get; }
}
