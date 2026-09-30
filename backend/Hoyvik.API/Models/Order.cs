using Hoyvik.API.Data;
using Hoyvik.API.Endpoints.Orders;

namespace Hoyvik.API.Models;

public class Order
{
    public int OrderId { get; set; }
    

    public Product Product { get; set; }
    public int ProductId { get; set; }
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
}
