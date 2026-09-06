namespace Hoyvik.API.Models.Requests;

internal sealed record CreateSessionRequest(DateOnly CheckIn, DateOnly CheckOut, int NumberOfGuests);