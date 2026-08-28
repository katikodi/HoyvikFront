using Hoyvik.API.Data;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace Hoyvik.API.Services;

public class ImageUploaderService(IWebHostEnvironment env, Database db ,ILogger<ImageUploaderService> logger)
{

    public async Task<UploadFileResult> UploadImage(IFormFile file ,string? name = null, string? folder = null)
    {
        var uploadPath = Path.Combine(env.WebRootPath, "uploads", folder ?? string.Empty);


        try
        {
            Directory.CreateDirectory(uploadPath);

            var fileName = $"{name ?? Guid.NewGuid().ToString("N")}.webp";
            var filePath = Path.Combine(uploadPath, fileName);
            var relativePath = Path.GetRelativePath(env.WebRootPath, filePath);
            var publicPath = "/" + relativePath.Replace(Path.DirectorySeparatorChar, '/');



            var img = new Models.Image { 
                FilePath = filePath,
                RelativePath = relativePath,
                Category  = Models.ImageCategory.None
            };

            await db.Images.AddAsync(img);

            await using var fileStream = file.OpenReadStream();

            using (var image = await Image.LoadAsync(fileStream))
            {
                var encoder = new WebpEncoder
                {
                    FileFormat = WebpFileFormatType.Lossy,
                    Quality = 80
                };

                await image.SaveAsWebpAsync(filePath, encoder);
                await db.SaveChangesAsync();

            }

            logger.LogInformation("Uploaded image: {path}", publicPath);
            return new UploadFileResult(publicPath);
        }   
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing and converting upload file to WebP");
            throw new ImageUploaderException("Error processing and converting upload file to WebP", ex);
        }
    }
}


public record UploadFileResult(string Path);


public class ImageUploaderException(string message, Exception innerException) : Exception(message,innerException);
