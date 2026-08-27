using Hoyvik.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hoyvik.API.Endpoints.Upload;

public class UploadEndpoint(ILogger<UploadEndpoint> logger) : IEndpoint
{

    //CURL: curl.exe -X POST "http://localhost:5200/api/upload/hero"  -F "file=@heroImage.webp" -b .\cookies.txt
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/upload", UploadFile)
            .DisableAntiforgery()
            .RequireAuthorization("admin", "Admin");

        app.MapPost("/upload/hero", UploadHero)
            .DisableAntiforgery()
            .RequireAuthorization("admin", "Admin");

        app.MapPost("/upload/icons", UploadIcon)
            .DisableAntiforgery()
            .RequireAuthorization("Admin", "admin");
    }


    async Task<IResult> UploadIcon([FromForm] IFormFile file, ImageUploaderService imageUploader)
    {
        if (file == null || file.Length == 0)
            return Results.BadRequest();

        try
        {
            var result = await imageUploader.UploadImage(
                file,
                folder: "icons"
            );

            return Results.Ok(result.Path);

        }
        catch (ImageUploaderException ex)
        {
            logger.LogError(ex, "Failed to process the uploaded image.");
            return Results.BadRequest("Failed to process the uploaded image.");
        }
    }
    async Task<IResult> UploadHero([FromForm] IFormFile file, ImageUploaderService imageUploader)
    {
        if (file == null || file.Length == 0)
            return Results.BadRequest();

        try
        {
            var result = await imageUploader.UploadImage(
                file,
                name: "image",
                folder: "hero"
            );

            return Results.Ok(result.Path);

        }
        catch (ImageUploaderException ex)
        {
            logger.LogError(ex, "Failed to process the uploaded image.");
            return Results.BadRequest("Failed to process the uploaded image.");
        }
    }
    async Task<IResult> UploadFile([FromForm] IFormFile file, ImageUploaderService imageUploader)
    {
        if (file == null || file.Length == 0)
            return Results.BadRequest();

        try
        {
            var result = await imageUploader.UploadImage(file);
            return Results.Ok(result.Path);

        }
        catch (ImageUploaderException ex)
        {
            logger.LogError(ex, "Failed to process the uploaded image.");
            return Results.BadRequest("Failed to process the uploaded image.");
        }
    }
}
