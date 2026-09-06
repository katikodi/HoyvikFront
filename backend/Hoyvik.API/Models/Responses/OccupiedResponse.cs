namespace Hoyvik.API.Models.Responses;

internal sealed record OccupiedResponse(DateOnly CheckIn, DateOnly CheckOut, BookingStatus Status);
