using Hoyvik.API.Services;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace Hoyvik.API.Endpoints.Upload;

public class UploadEndpoint(ILogger<UploadEndpoint> logger) : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/upload", UploadFile)
            .DisableAntiforgery();
    }


    async Task<IResult> UploadFile(IFormFile file, IWebHostEnvironment env, ImageUploaderService imageUploader)
    {

        if(file == null || file.Length == 0)
        {
            return Results.BadRequest();
        }



        try
        {
            var result = await imageUploader.UploadImage(file);
            return Results.Ok($"/uploads/{result.FileName}");

        }
        catch(ImageUploaderException ex)
        {
            return Results.BadRequest("Failed to process the uploaded image.");

        }



    }
}
