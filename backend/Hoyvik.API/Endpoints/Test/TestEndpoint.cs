
namespace Hoyvik.API.Endpoints.Test;


public class TestEndpoint : IEndpoint
{

    //hardcoded values
    readonly string[] summaries = new string[] {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };



    public void MapEndpoint(RouteGroupBuilder app)
    {

        app.MapGet("/weatherforecast", () =>
        {
            //this is some random dummy data for testing
            var forecast = Enumerable
                .Range(1, 5)
                .Select(index => new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
                .ToArray();
            return forecast;
        })
        .WithName("GetWeatherForecast");
    }


    //the response model for the endpoint, kindof like a "contract". this is what the user can expect from the endpoint
    //it is good practie to call this postfix this model with "Response" or "Request"
    //record is basically a class, just with some more functionlity
    internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
    {
        //this is a GETTER
        //it returns the temperature in fahrenheit by converting it
        //it looks like a method/function, but its not
        //it is not "ran" or "executed"
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    }

}
