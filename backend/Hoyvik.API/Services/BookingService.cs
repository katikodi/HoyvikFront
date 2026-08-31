using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Services;

public class BookingService(Database db)
{
    public async Task<bool> CheckAvailability(string sessionId, DateTime start, DateTime end)
    {
        return await db
        .Bookings
        .AnyAsync(
            x => x.StripeSessionId == sessionId &&
            x.Status != Models.BookingStatus.Cancelled && 
            x.CheckIn < end &&
            x.CheckOut > start);
    }
}
