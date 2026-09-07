namespace Hoyvik.API.Models.Responses;

public sealed record OccupiedResponse(DateOnly CheckIn, DateOnly CheckOut, BookingStatus Status);
