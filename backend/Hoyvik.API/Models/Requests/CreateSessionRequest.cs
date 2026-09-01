namespace Hoyvik.API.Models.Requests;
 public record CreateSessionRequest(DateOnly CheckIn, DateOnly CheckOut, int NumberOfGuests);