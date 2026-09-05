using Hoyvik.API.Models;
using Microsoft.AspNetCore.Identity;

namespace Hoyvik.API.Data;

public class ApplicationUser : IdentityUser
{

    public string FullName { get; set; } = string.Empty;
    public ICollection<Booking> Bookings { get; set; } = [];
}