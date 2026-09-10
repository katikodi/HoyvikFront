using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

internal sealed class BookingExpirationService(
    IServiceScopeFactory scopeFactory,
    IOptionsMonitor<BookingConfiguration> bookingConfig,
    ILogger<BookingExpirationService> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();

                var db = scope.ServiceProvider.GetRequiredService<Database>();

                var now = DateTime.UtcNow;

                var expiredCount = await db.Bookings
                    .Where(x =>
                        x.Status == BookingStatus.Pending &&
                        x.ExpiresAt <= now)
                    .ExecuteUpdateAsync(
                        setters => setters
                            .SetProperty(
                                x => x.Status,
                                BookingStatus.Expired),
                        stoppingToken);

                if (expiredCount > 0)
                {
                    logger.LogInformation(
                        "Expired {Count} pending booking(s)",
                        expiredCount);
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Error while expiring pending bookings");
            }

            var pollRate = bookingConfig.CurrentValue.CleanupPollRate;

            logger.LogInformation(
                "Next booking cleanup in {Seconds} seconds",
                pollRate);

            try
            {
                await Task.Delay(
                    TimeSpan.FromSeconds(pollRate),
                    stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }
    }
}