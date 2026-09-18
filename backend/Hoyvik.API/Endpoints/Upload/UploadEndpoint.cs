using Hoyvik.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hoyvik.API.Endpoints.Upload;

internal sealed class UploadEndpoint : IEndpoint
{

    //CURL: curl.exe -X POST "http://localhost:5200/api/upload/hero"  -F "file=@heroImage.webp" -b .\cookies.txt
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/uploads", UploadFile)
            .DisableAntiforgery()
            .RequireAuthorization(Roles.ADMIN);

        app.MapPost("/uploads/hero", UploadHero)
            .DisableAntiforgery()
            .RequireAuthorization(Roles.ADMIN);

        app.MapPost("/uploads/icons", UploadIcon)
            .DisableAntiforgery()
            .RequireAuthorization(Roles.ADMIN);
    }


    static async Task<IResult> UploadIcon(IFormFile file, ImageUploaderService imageUploader, ILogger<UploadEndpoint> logger)
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
    static async Task<IResult> UploadHero(IFormFile file, ImageUploaderService imageUploader, ILogger<UploadEndpoint> logger)
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
    static async Task<IResult> UploadFile(IFormFile file, ImageUploaderService imageUploader, ILogger<UploadEndpoint> logger)
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
