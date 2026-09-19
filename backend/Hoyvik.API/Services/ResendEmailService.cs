using Hoyvik.API.Configuration;
using Hoyvik.API.Services.Abstractions;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using Resend;

namespace Hoyvik.API.Services;

internal sealed class ResendEmailService(
    IResend resend,
    IOptions<ResendConfiguration> configuration,
    ILogger<ResendEmailService> logger)
    : IEmailService
{
    public async Task Send(
        string to,
        string subject,
        string htmlBody,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(to))
            throw new ArgumentException(
                "Recipient email address is required.",
                nameof(to));

        if (string.IsNullOrWhiteSpace(configuration.Value.From))
            throw new InvalidOperationException(
                "Resend:From is not configured.");

        var message = new EmailMessage
        {
            From = configuration.Value.From,
            Subject = subject,
            HtmlBody = htmlBody
        };

        message.To.Add(to);

        await resend.EmailSendAsync(
            message,
            cancellationToken: ct);

        logger.LogInformation(
            "Email sent to {Email}",
            to);
    }
}