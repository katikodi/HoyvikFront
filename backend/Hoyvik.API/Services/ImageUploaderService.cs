using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace Hoyvik.API.Services;

public class ImageUploaderService(IWebHostEnvironment env, ILogger<ImageUploaderService> logger)
{

    public async Task<UploadFileResult> UploadImage(IFormFile file)
    {
        var uploadPath = Path.Combine(env.WebRootPath, "uploads");
        try
        {
            Directory.CreateDirectory(uploadPath);

            var fileName = $"{Guid.NewGuid()}.webp";
            var filePath = Path.Combine(uploadPath, fileName);


            await using var fileStream = file.OpenReadStream();

            using (var image = await Image.LoadAsync(fileStream))
            {
                var encoder = new WebpEncoder
                {
                    FileFormat = WebpFileFormatType.Lossy,
                    Quality = 80
                };

                await image.SaveAsWebpAsync(filePath, encoder);
            }

            return new UploadFileResult(fileName);
        }   
        catch (Exception ex)
        {
            throw new ImageUploaderException("Error processing and converting upload file to WebP", ex);
        }
    }
}


public record UploadFileResult(string FileName);


public class ImageUploaderException(string message, Exception innerException) : Exception(message,innerException);
