namespace Hoyvik.API.Models;

public class Image
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty;
    public DateTime UploadDate { get; set; } = DateTime.UtcNow;

    public bool Deleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; } = null;
}