namespace Hoyvik.API.Endpoints.Upload;

internal sealed class DeleteUploadEndpoint : IEndpoint
{
    public void MapEndpoint(RouteGroupBuilder app)
    {
        app.MapDelete("/uploads/{fileName}", DeleteFile);
    }

    static async Task<IResult> DeleteFile(string fileName, IWebHostEnvironment env)
    {
        var filePath = Path.Combine(env.WebRootPath, "uploads", fileName);
        if (!File.Exists(filePath))
            return Results.NotFound();

        File.Delete(filePath);

        return Results.Ok("deleted");
    }
}
