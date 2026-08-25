using Microsoft.AspNetCore.Mvc;

namespace Hoyvik.API.Endpoints.Upload;

public class GetUploadsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapGet("/uploads", GetAll).CacheOutput();
        app.MapGet("/uploads/{fileName}", GetFile).CacheOutput();
    }



    async Task<IResult> GetFile(string fileName,IWebHostEnvironment env)
    {
        var uploadsPath = Path.GetFullPath(
            Path.Combine(env.WebRootPath, "uploads"));

        var filePath = Path.GetFullPath(
            Path.Combine(uploadsPath, fileName));

        if (!filePath.StartsWith(
                uploadsPath + Path.DirectorySeparatorChar))
        {
            return Results.BadRequest();
        }

        if (!File.Exists(filePath))
            return Results.NotFound();

        return Results.File(filePath, GetContentType(filePath));
    }


    async Task<IResult> GetAll([FromServices] IWebHostEnvironment env)
    {
        var uploadsPath = Path.Combine(env.WebRootPath, "uploads");

        if (!Directory.Exists(uploadsPath))
        {
            return Results.Ok(Array.Empty<object>());
        }

        var files = Directory.EnumerateFiles(uploadsPath)
        .Select(x => new {

            filename = Path.GetFileName(x),
            url = $"/uploads/{Path.GetFileName(x)}"
        });
        return Results.Ok(files);
    }

    static string GetContentType(string path)
    {
        return Path.GetExtension(path).ToLowerInvariant() switch
        {
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
    }
}
