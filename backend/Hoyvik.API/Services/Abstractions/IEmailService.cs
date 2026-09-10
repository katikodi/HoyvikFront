namespace Hoyvik.API.Services.Abstractions;

public interface IEmailService
{
    Task Send(
        string to,
        string subject,
        string htmlBody,
        CancellationToken ct = default);
}