using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Services;

public class BookingExpirationService(IServiceScopeFactory scopeFactory, ILogger<BookingExpirationService> logger) : BackgroundService
{

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();

                var db = scope.ServiceProvider.GetRequiredService<Database>();


                await db.Bookings
                    .Where(x =>
                        x.Status == BookingStatus.Pending &&
                        x.ExpiresAt <= DateTime.UtcNow)
                    .ExecuteUpdateAsync(
                        setters => setters
                            .SetProperty(
                                x => x.Status,
                                BookingStatus.Expired),
                        stoppingToken);
            }
            catch(Exception ex)
            {
                logger.LogError(ex, "Error while expiring pending bookings");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
