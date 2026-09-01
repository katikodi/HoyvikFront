namespace Hoyvik.API.Models;

 public record CreateSessionRequest(DateOnly CheckIn, DateOnly CheckOut, int NumberOfGuests);



