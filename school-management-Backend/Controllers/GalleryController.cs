using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using school_management_Backend.DTOs;
using school_management_Backend.Services;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.Extensions.Logging;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GalleryController : BaseApiController
    {
        private readonly GalleryService _galleryService;
        private readonly ILogger<GalleryController> _logger;

        public GalleryController(GalleryService galleryService, ILogger<GalleryController> logger)
        {
            _galleryService = galleryService;
            _logger = logger;
        }

       private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // POST: api/Gallery/create-album
        [HttpPost("create-album")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> CreateAlbum([FromForm] CreateGalleryAlbumDto dto, [FromForm] List<IFormFile> files)
        {
            try
            {
                var userId = GetUserId();
                var albumId = await _galleryService.CreateAlbumAsync(dto, userId);

                if (files != null && files.Any())
                {
                    for (int i = 0; i < files.Count; i++)
                    {
                        await _galleryService.UploadMediaAsync(albumId, files[i], userId, i);
                    }
                }

                return Ok(new { success = true, message = "Album created successfully", data = new { albumId } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating album");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/Gallery/upload-media/{albumId}
        [HttpPost("upload-media/{albumId}")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> UploadMedia(int albumId, [FromForm] List<IFormFile> files)
        {
            try
            {
                var userId = GetUserId();
                var mediaIds = new List<int>();

                if (files != null && files.Any())
                {
                    for (int i = 0; i < files.Count; i++)
                    {
                        var mediaId = await _galleryService.UploadMediaAsync(albumId, files[i], userId, i);
                        mediaIds.Add(mediaId);
                    }
                }

                return Ok(new { success = true, message = $"{mediaIds.Count} files uploaded", data = new { mediaIds } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading media");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Gallery/albums
        [HttpGet("albums")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAlbums(
            [FromQuery] int? classId, [FromQuery] int? sectionId,
            [FromQuery] int page = 1, [FromQuery] int limit = 20)
        {
            try
            {
                var result = await _galleryService.GetAlbumsAsync(classId, sectionId, page, limit);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting albums");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Gallery/album/{id}
        [HttpGet("album/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAlbum(int id)
        {
            try
            {
                var album = await _galleryService.GetAlbumByIdAsync(id);
                if (album == null)
                    return NotFound(new { success = false, message = "Album not found" });

                return Ok(new { success = true, data = album });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting album {id}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // PUT: api/Gallery/update-album/{id}
        [HttpPut("update-album/{id}")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> UpdateAlbum(int id, [FromBody] UpdateGalleryAlbumDto dto)
        {
            try
            {
                var userId = GetUserId();
                var success = await _galleryService.UpdateAlbumAsync(id, dto, userId);
                if (!success)
                    return NotFound(new { success = false, message = "Album not found" });

                return Ok(new { success = true, message = "Album updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating album {id}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/Gallery/album/{id}
        [HttpDelete("album/{id}")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> DeleteAlbum(int id)
        {
            try
            {
                var userId = GetUserId();
                var success = await _galleryService.DeleteAlbumAsync(id, userId);
                if (!success)
                    return NotFound(new { success = false, message = "Album not found" });

                return Ok(new { success = true, message = "Album deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting album {id}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/Gallery/media/{id}
        [HttpDelete("media/{id}")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> DeleteMedia(int id)
        {
            try
            {
                var success = await _galleryService.DeleteMediaAsync(id);
                if (!success)
                    return NotFound(new { success = false, message = "Media not found" });

                return Ok(new { success = true, message = "Media deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting media {id}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}