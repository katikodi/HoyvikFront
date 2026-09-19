using Hoyvik.API.Data;
using Hoyvik.API.Services.Abstractions;
using Microsoft.EntityFrameworkCore;


namespace Hoyvik.API.Services;

internal sealed class EmailBackgroundService(
    IServiceScopeFactory scopeFactory,
    ILogger<EmailBackgroundService> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();

                var db = scope.ServiceProvider
                    .GetRequiredService<Database>();

                var emailService = scope.ServiceProvider
                    .GetRequiredService<IEmailService>();

                var now = DateTime.UtcNow;

                var emails = await db.EmailOutbox
                    .Where(x =>
                        x.SentAt == null &&
                        (x.NextAttemptAt == null ||
                         x.NextAttemptAt <= now))
                    .OrderBy(x => x.CreatedAt)
                    .Take(20)
                    .ToListAsync(stoppingToken);

                foreach (var email in emails)
                {
                    try
                    {
                        email.Attempts++;

                        await emailService.Send(
                            email.To,
                            email.Subject,
                            email.Body,
                            stoppingToken);

                        email.SentAt = DateTime.UtcNow;
                        email.LastError = null;
                    }
                    catch (Exception ex)
                    {
                        email.LastError = ex.Message;

                        email.NextAttemptAt =
                            DateTime.UtcNow.AddMinutes(5);

                        logger.LogError(
                            ex,
                            "Failed to send email {EmailId}",
                            email.Id);
                    }
                }

                await db.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Error while processing email outbox");
            }

            await Task.Delay(
                TimeSpan.FromSeconds(10),
                stoppingToken);
        }
    }
}