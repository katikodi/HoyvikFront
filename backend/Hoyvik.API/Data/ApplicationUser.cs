using Hoyvik.API.Models;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Data;


public sealed class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public ICollection<Booking> Bookings { get; set; } = [];
}