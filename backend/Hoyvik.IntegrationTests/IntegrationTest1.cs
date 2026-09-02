using Microsoft.Extensions.Logging;
using Projects;

namespace Hoyvik.IntegrationTests;

public class IntegrationTest1
{
    private static readonly TimeSpan DefaultTimeout = TimeSpan.FromSeconds(30);

    [Fact]
    public async Task GetWebResourceRootReturnsOkStatusCode()
    {
        // Arrange
        var cancellationToken = TestContext.Current.CancellationToken;
        var appHost = await DistributedApplicationTestingBuilder.CreateAsync<HoyvikProject_AppHost>(cancellationToken);
        appHost.Services.AddLogging(logging =>
        {
            logging.SetMinimumLevel(LogLevel.Debug);
            // Override the logging filters from the app's configuration
            logging.AddFilter(appHost.Environment.ApplicationName, LogLevel.Debug);
            logging.AddFilter("Aspire.", LogLevel.Debug);
            // To output logs to the xUnit.net ITestOutputHelper, consider adding a package from https://www.nuget.org/packages?q=xunit+logging
        });
        appHost.Services.ConfigureHttpClientDefaults(clientBuilder =>
        {
            clientBuilder.AddStandardResilienceHandler();
        });

        await using var app = await appHost.BuildAsync(cancellationToken).WaitAsync(DefaultTimeout, cancellationToken);
        await app.StartAsync(cancellationToken).WaitAsync(DefaultTimeout, cancellationToken);

        // Act
        using var httpClient = app.CreateHttpClient("frontend");
        await app.ResourceNotifications.WaitForResourceHealthyAsync("frontend", cancellationToken).WaitAsync(DefaultTimeout, cancellationToken);
        using var response = await httpClient.GetAsync("/api/", cancellationToken);
        var o = await response.Content.ReadAsStringAsync(cancellationToken);
        Console.WriteLine();
        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
