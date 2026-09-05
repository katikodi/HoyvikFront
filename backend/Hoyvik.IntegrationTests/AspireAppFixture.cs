using Aspire.Hosting;

namespace Hoyvik.IntegrationTests;

using Microsoft.Extensions.Logging;
using Projects;


public class AspireAppFixture : IAsyncLifetime
{
    private static readonly TimeSpan DefaultTimeout =
        TimeSpan.FromSeconds(30);

    public DistributedApplication App { get; private set; } = null!;
    public HttpClient BackendClient { get; private set; } = null!;
    public HttpClient FrontendClient { get; private set; } = null!;
    public async ValueTask InitializeAsync()
    {
        var appHost =
            await DistributedApplicationTestingBuilder
                .CreateAsync<HoyvikProject_AppHost>();

        appHost.Services.AddLogging(logging =>
        {
            logging.SetMinimumLevel(LogLevel.Debug);
            logging.AddFilter(
                appHost.Environment.ApplicationName,
                LogLevel.Debug);
            logging.AddFilter("Aspire.", LogLevel.Debug);
        });

        appHost.Services.ConfigureHttpClientDefaults(clientBuilder =>
        {
            clientBuilder.AddStandardResilienceHandler();
        });

        App = await appHost
            .BuildAsync()
            .WaitAsync(DefaultTimeout);

        await App
            .StartAsync()
            .WaitAsync(DefaultTimeout);

        await App.ResourceNotifications
            .WaitForResourceHealthyAsync("backend")
            .WaitAsync(DefaultTimeout);

        await App.ResourceNotifications
            .WaitForResourceHealthyAsync("frontend")
            .WaitAsync(DefaultTimeout);

        BackendClient = App.CreateHttpClient("backend");
        FrontendClient = App.CreateHttpClient("frontend");
    }

    public async ValueTask DisposeAsync()
    {
        BackendClient.Dispose();
        await App.DisposeAsync();
    }
}