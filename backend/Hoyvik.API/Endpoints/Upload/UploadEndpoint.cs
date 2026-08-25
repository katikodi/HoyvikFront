namespace Hoyvik.API.Endpoints.Upload;

public class UploadEndpoint(ILogger<UploadEndpoint> logger) : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapPost("/upload", UploadFile)
            .DisableAntiforgery();
    }


    async Task<IResult> UploadFile(IFormFile file, IWebHostEnvironment env)
    {
        //TODO: VALIDATE FILE MIME TYPES
        var uploadPath = Path.Combine(env.WebRootPath, "uploads");

        try
        {
            Directory.CreateDirectory(uploadPath);
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);
            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            return Results.Ok($"/uploads/{fileName}");
        }
        catch(Exception ex)
        {
            logger.LogError("UploadFile {ex}", ex);
        }

        return Results.BadRequest();

    }
}
