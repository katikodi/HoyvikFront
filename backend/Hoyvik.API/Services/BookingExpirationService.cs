using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Hoyvik.API.Services;

public class BookingExpirationService(IServiceScopeFactory scopeFactory, IOptionsMonitor<BookingConfiguration> bookingConfig, ILogger<BookingExpirationService> logger) : BackgroundService
{

	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		while(!stoppingToken.IsCancellationRequested)
		{
			try
			{
				using var scope = scopeFactory.CreateScope();

				var db = scope.ServiceProvider.GetRequiredService<Database>();


				var bookings = await db.Bookings.Where(x => x.Status != BookingStatus.Confirmed && x.Status != BookingStatus.Expired).ToListAsync();

				foreach(var b in bookings)
				{
					var time = Math.Max(0, (int)(b.ExpiresAt.Value - DateTime.UtcNow).TotalSeconds);
					logger.LogInformation("{booking} expires in {time} seconds", b.StripeSessionId, time);
				}

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


			logger.LogInformation("Next cleanup is in {time} seconds", bookingConfig.CurrentValue.CleanupPollRate);

			await Task.Delay(TimeSpan.FromSeconds(bookingConfig.CurrentValue.CleanupPollRate), stoppingToken);
		}
	}
}
