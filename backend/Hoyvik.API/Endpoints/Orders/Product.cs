namespace Hoyvik.API.Endpoints.Orders;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Price in NOK
    /// </summary>
    public decimal Price { get; set; }
}
