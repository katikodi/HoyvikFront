namespace Hoyvik.API.Models.Requests;

public sealed record CreateSessionRequest(DateOnly CheckIn, DateOnly CheckOut, int NumberOfGuests);