using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace school_management_Backend.DTOs
{
    public class CreateGalleryAlbumDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int ClassId { get; set; }
        public int? SectionId { get; set; }
        public int? SubjectId { get; set; }
        public DateTime? EventDate { get; set; }
    }

    public class UpdateGalleryAlbumDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? SectionId { get; set; }
        public int? SubjectId { get; set; }
        public DateTime? EventDate { get; set; }
    }

    public class GalleryAlbumResponseDto
    {
        public int AlbumId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int ClassId { get; set; }
        public string ClassName { get; set; }
        public int? SectionId { get; set; }
        public string SectionName { get; set; }
        public int? SubjectId { get; set; }
        public string SubjectName { get; set; }
        public string CoverImageUrl { get; set; }
        public int ImageCount { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedDt { get; set; }
        public DateTime? EventDate { get; set; }
        public List<GalleryMediaResponseDto> Media { get; set; }
    }

    public class GalleryMediaResponseDto
    {
        public int MediaId { get; set; }
        public string MediaUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string FileName { get; set; }
        public long? FileSize { get; set; }
        public int SortOrder { get; set; }
    }

    public class GalleryAlbumListResponseDto
    {
        public List<GalleryAlbumResponseDto> Albums { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalPages { get; set; }
    }
}