using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace school_management_Backend.Services
{
    public class GalleryService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GalleryService> _logger;
        private readonly string _uploadBasePath;

        public GalleryService(ApplicationDbContext context, ILogger<GalleryService> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _uploadBasePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "gallery");
            
            if (!Directory.Exists(_uploadBasePath))
                Directory.CreateDirectory(_uploadBasePath);
        }

        public async Task<int> CreateAlbumAsync(CreateGalleryAlbumDto dto, int userId)
        {
            var album = new GalleryAlbum
            {
                Title = dto.Title?.Trim(),
                Description = dto.Description?.Trim(),
                ClassId = dto.ClassId,
                SectionId = dto.SectionId,
                SubjectId = dto.SubjectId,
                EventDate = dto.EventDate,
                CreatedBy = userId,
                CreatedDt = DateTime.Now,
                IsActive = true
            };

            _context.tbl_GalleryAlbum.Add(album);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation($"Album created: {album.AlbumId}");
            return album.AlbumId;
        }

        public async Task<int> UploadMediaAsync(int albumId, IFormFile file, int userId, int sortOrder = 0)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(_uploadBasePath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var mediaUrl = $"/uploads/gallery/{fileName}";
            
            var media = new GalleryMedia
            {
                AlbumId = albumId,
                MediaUrl = mediaUrl,
                ThumbnailUrl = mediaUrl,
                FileName = file.FileName,
                FileSize = file.Length,
                SortOrder = sortOrder,
                CreatedBy = userId,
                CreatedDt = DateTime.Now,
                IsActive = true
            };

            _context.tbl_GalleryMedia.Add(media);
            await _context.SaveChangesAsync();

            // Update cover image if this is the first image
            var album = await _context.tbl_GalleryAlbum.FindAsync(albumId);
            if (album != null && string.IsNullOrEmpty(album.CoverImageUrl))
            {
                album.CoverImageUrl = mediaUrl;
                await _context.SaveChangesAsync();
            }

            return media.MediaId;
        }

        public async Task<GalleryAlbumListResponseDto> GetAlbumsAsync(
            int? classId, int? sectionId, int page = 1, int limit = 20)
        {
            var query = _context.tbl_GalleryAlbum
                .AsNoTracking()
                .Where(a => a.IsActive == true);

            if (classId.HasValue)
                query = query.Where(a => a.ClassId == classId.Value);

            if (sectionId.HasValue)
                query = query.Where(a => a.SectionId == sectionId.Value);

            var total = await query.CountAsync();

            var albums = await query
                .OrderByDescending(a => a.CreatedDt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(a => new GalleryAlbumResponseDto
                {
                    AlbumId = a.AlbumId,
                    Title = a.Title,
                    Description = a.Description,
                    ClassId = a.ClassId,
                    ClassName = _context.tbl_AddClass
                        .Where(c => c.Class_ID == a.ClassId)
                        .Select(c => c.Class_Name)
                        .FirstOrDefault() ?? "",
                    SectionId = a.SectionId,
                    SectionName = a.SectionId.HasValue
                        ? _context.tbl_AddSection
                            .Where(s => s.ID == a.SectionId.Value)
                            .Select(s => s.Section)
                            .FirstOrDefault() ?? ""
                        : "",
                    CoverImageUrl = a.CoverImageUrl,
                    ImageCount = _context.tbl_GalleryMedia
                        .Count(m => m.AlbumId == a.AlbumId && m.IsActive == true),
                    CreatedBy = a.CreatedBy,
                    CreatedByName = _context.tbl_User
                        .Where(u => u.ID == a.CreatedBy)
                        .Select(u => u.UserName)
                        .FirstOrDefault() ?? "",
                    CreatedDt = a.CreatedDt,
                    EventDate = a.EventDate,
                    Media = new List<GalleryMediaResponseDto>()
                })
                .ToListAsync();

            return new GalleryAlbumListResponseDto
            {
                Albums = albums,
                Total = total,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling(total / (double)limit)
            };
        }

        public async Task<GalleryAlbumResponseDto> GetAlbumByIdAsync(int albumId)
        {
            var album = await _context.tbl_GalleryAlbum
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.AlbumId == albumId && a.IsActive == true);

            if (album == null) return null;

            var media = await _context.tbl_GalleryMedia
                .AsNoTracking()
                .Where(m => m.AlbumId == albumId && m.IsActive == true)
                .OrderBy(m => m.SortOrder)
                .ThenBy(m => m.CreatedDt)
                .Select(m => new GalleryMediaResponseDto
                {
                    MediaId = m.MediaId,
                    MediaUrl = m.MediaUrl,
                    ThumbnailUrl = m.ThumbnailUrl ?? m.MediaUrl,
                    FileName = m.FileName,
                    FileSize = m.FileSize,
                    SortOrder = m.SortOrder
                })
                .ToListAsync();

            return new GalleryAlbumResponseDto
            {
                AlbumId = album.AlbumId,
                Title = album.Title,
                Description = album.Description,
                ClassId = album.ClassId,
                ClassName = await _context.tbl_AddClass
                    .Where(c => c.Class_ID == album.ClassId)
                    .Select(c => c.Class_Name)
                    .FirstOrDefaultAsync() ?? "",
                SectionId = album.SectionId,
                SectionName = album.SectionId.HasValue
                    ? await _context.tbl_AddSection
                        .Where(s => s.ID == album.SectionId.Value)
                        .Select(s => s.Section)
                        .FirstOrDefaultAsync() ?? ""
                    : "",
                CoverImageUrl = album.CoverImageUrl,
                ImageCount = media.Count,
                CreatedBy = album.CreatedBy,
                CreatedByName = await _context.tbl_User
                    .Where(u => u.ID == album.CreatedBy)
                    .Select(u => u.UserName)
                    .FirstOrDefaultAsync() ?? "",
                CreatedDt = album.CreatedDt,
                EventDate = album.EventDate,
                Media = media
            };
        }

        public async Task<bool> UpdateAlbumAsync(int albumId, UpdateGalleryAlbumDto dto, int userId)
        {
            var album = await _context.tbl_GalleryAlbum.FindAsync(albumId);
            if (album == null) return false;

            album.Title = dto.Title?.Trim() ?? album.Title;
            album.Description = dto.Description?.Trim() ?? album.Description;
            album.SectionId = dto.SectionId ?? album.SectionId;
            album.SubjectId = dto.SubjectId ?? album.SubjectId;
            album.EventDate = dto.EventDate ?? album.EventDate;
            album.ModifiedBy = userId;
            album.ModifiedDt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAlbumAsync(int albumId, int userId)
        {
            var album = await _context.tbl_GalleryAlbum.FindAsync(albumId);
            if (album == null) return false;

            album.IsActive = false;
            album.ModifiedBy = userId;
            album.ModifiedDt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMediaAsync(int mediaId)
        {
            var media = await _context.tbl_GalleryMedia.FindAsync(mediaId);
            if (media == null) return false;

            media.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}