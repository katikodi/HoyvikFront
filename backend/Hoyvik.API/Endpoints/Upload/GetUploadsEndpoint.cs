using Hoyvik.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Upload;

internal sealed class GetUploadsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapGet("/uploads", GetAllImages).CacheOutput();
        //app.MapGet("/uploads/{fileName}", GetFile).CacheOutput();
        app.MapGet("/uploads/hero", GetHeroImages).CacheOutput();
        app.MapGet("/uploads/icons", GetAllIcons).CacheOutput();
    }



    static async Task<IResult> GetHeroImages(Database db)
    {
        var images = db.Images.Where(x => x.RelativePath.StartsWith("/uploads/hero/")).ToList();

        return Results.Ok(images.Select(x => new
        {
            x.Id,
            x.FileName,
            x.RelativePath,
            x.UploadDate
        }).ToList());
    }

    static async Task<IResult> GetAllIcons(Database db)
    {
        var images = db.Images.Where(x => x.RelativePath.StartsWith("/uploads/icons/")).ToList();

        return Results.Ok(images.Select(x => new
        {
            x.Id,
            x.FileName,
            x.RelativePath,
            x.UploadDate
        }).ToList());
    }


    static async Task<IResult> GetAllImages(Database db)
    {
        var images = await db.Images.ToListAsync();



        return Results.Ok(images.Select(x => new
        {
            x.Id,
            x.FileName,
            x.RelativePath,
            x.UploadDate
        }).ToList());
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
