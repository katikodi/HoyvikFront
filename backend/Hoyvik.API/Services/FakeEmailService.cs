using Hoyvik.API.Services.Abstractions;
namespace Hoyvik.API.Services;

public class FakeEmailService(ILogger<FakeEmailService> logger) : IEmailService
{
    public Task Send(string to, string subject, string htmlBody, CancellationToken ct = default)
    {
        logger.LogInformation("sending email {to} with subject {subject}: content {htmlBody}", to, subject, htmlBody);
        return Task.CompletedTask;
    }
}