using System.Net.Http.Json;

namespace Hoyvik.IntegrationTests;

public class IntegrationTest1(AspireAppFixture fixture) : IClassFixture<AspireAppFixture>
{
    record RegisterRequest(
        string FullName,
        string Email,
        string Password,
        string ConfirmPassword);
    record LoginRequest(
        string Email,
        string Password);


    [Fact]
    public async Task GetWebResourceRootReturnsOkStatusCode()
    {
        // Arrange
        var cancellationToken = TestContext.Current.CancellationToken;

        // Act
        using var response = await fixture.FrontendClient.GetAsync(
            "/",
            cancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task BackendHealthCheckReturnsOkStatusCode()
    {
        //arrange
        var cancellationToken = TestContext.Current.CancellationToken;

        //act
        using var response = await fixture.BackendClient.GetAsync("/health", cancellationToken);

        //assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task BackendCreatingUserReturnsOK()
    {
        var cancellationToken = TestContext.Current.CancellationToken;

        var email = $"elias-{Guid.NewGuid():N}@test.com";
        var password = "Password1223!";

        var request = new RegisterRequest(
            "Elias",
            email,
            password,
            password);

        using var response = await fixture.BackendClient.PostAsJsonAsync(
            "/api/auth/register",
            request,
            cancellationToken);

        var responseBody = await response.Content.ReadAsStringAsync(
            cancellationToken);

        Assert.True(
            response.IsSuccessStatusCode,
            $"Registration failed with {response.StatusCode}: {responseBody}");
    }


    [Fact]
    public async Task BackendLoginReturnsNoContent()
    {
        var cancellationToken = TestContext.Current.CancellationToken;

        var email = $"elias-{Guid.NewGuid():N}@test.com";
        var password = "Password1223!";

        // Register user first
        var registerRequest = new RegisterRequest(
            "Elias",
            email,
            password,
            password);

        using var registerResponse = await fixture.BackendClient.PostAsJsonAsync(
            "/api/auth/register",
            registerRequest,
            cancellationToken);

        var registerBody = await registerResponse.Content.ReadAsStringAsync(
            cancellationToken);

        Assert.True(
            registerResponse.IsSuccessStatusCode,
            $"Registration failed with {registerResponse.StatusCode}: {registerBody}");

        // Act - login
        using var loginResponse = await fixture.BackendClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(email, password),
            cancellationToken);

        // Assert
        Assert.Equal(
            HttpStatusCode.NoContent,
            loginResponse.StatusCode);
    }


}
