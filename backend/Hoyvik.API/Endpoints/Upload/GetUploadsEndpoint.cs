using Hoyvik.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hoyvik.API.Endpoints.Upload;

public class GetUploadsEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapGet("/uploads", GetAllImages).CacheOutput();
        //app.MapGet("/uploads/{fileName}", GetFile).CacheOutput();
        app.MapGet("/uploads/hero", GetHeroImages).CacheOutput();
         app.MapGet("/uploads/icons", GetAllIcons).CacheOutput();
    }



    async Task<IResult> GetHeroImages(Database db)
    {
        var images = db.Images.Where(x => x.RelativePath.StartsWith("/uploads/hero/")).ToList();

        return Results.Ok(images.Select(x => new {
            x.Id,
            x.FileName,
            x.RelativePath,
            x.UploadDate
        }).ToList());
    }

    async Task<IResult> GetAllIcons(Database db)
    {
        var images = db.Images.Where(x => x.RelativePath.StartsWith("/uploads/icons/")).ToList();

        return Results.Ok(images.Select(x => new {
            x.Id,
            x.FileName,
            x.RelativePath,
            x.UploadDate
        }).ToList());
    }


    async Task<IResult> GetAllImages(Database db)
    {
        var images = await db.Images.ToListAsync();



        return Results.Ok(images.Select(x => new {
            x.Id,
            x.FileName,
            x.RelativePath,
            x.UploadDate
        }).ToList());
    }
    //async Task<IResult> GetFile(string fileName, IWebHostEnvironment env)
    //{
    //    var uploadsPath = Path.GetFullPath(
    //        Path.Combine(env.WebRootPath, "uploads"));

    //    var filePath = Path.GetFullPath(
    //        Path.Combine(uploadsPath, fileName));

    //    if (!filePath.StartsWith(
    //            uploadsPath + Path.DirectorySeparatorChar))
    //    {
    //        return Results.BadRequest();
    //    }

    //    if (!File.Exists(filePath))
    //        return Results.NotFound();

    //    return Results.File(filePath, GetContentType(filePath));
    //}


    //async Task<IResult> GetAll([FromServices] IWebHostEnvironment env)
    //{
    //    var uploadsPath = Path.Combine(env.WebRootPath, "uploads");

    //    if (!Directory.Exists(uploadsPath))
    //    {
    //        return Results.Ok(Array.Empty<object>());
    //    }

    //    var files = Directory.EnumerateFiles(uploadsPath)
    //    .Select(x => new
    //    {

    //        filename = Path.GetFileName(x),
    //        url = $"/uploads/{Path.GetFileName(x)}"
    //    });
    //    return Results.Ok(files);
    //}

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
