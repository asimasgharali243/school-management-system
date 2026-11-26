using System;
using System.Collections.Generic;

namespace school_management_Backend.DTOs
{
    public class CreateLectureDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? YoutubeUrl { get; set; }
        public int ClassId { get; set; }
        public List<int> SectionIds { get; set; }
        public int SubjectId { get; set; }
        public int? BookId { get; set; }
        public long? ChapterId { get; set; }
        public long? TopicId { get; set; }
        public string? Tags { get; set; }
        public bool IsFree { get; set; }
        public bool IsPublished { get; set; }
    }

    public class UpdateLectureDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? YoutubeUrl { get; set; }
        public List<int> SectionIds { get; set; }
        public int? BookId { get; set; }
        public long? ChapterId { get; set; }
        public long? TopicId { get; set; }
        public string? Tags { get; set; }
        public bool IsFree { get; set; }
        public bool IsPublished { get; set; }
    }


public class LectureResponseDto
{
    public int LectureId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? YoutubeUrl { get; set; }
    public string YoutubeVideoId { get; set; }
    public string? EmbedUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public int ClassId { get; set; }
    public string? ClassName { get; set; }
    public int SubjectId { get; set; }
    public string? SubjectName { get; set; }
    public string? SubjectColorCode { get; set; }
    public int? BookId { get; set; }
    public string? BookName { get; set; }        // NEW
    public long? ChapterId { get; set; }
    public string? ChapterName { get; set; }      // NEW
    public long? TopicId { get; set; }
    public string?   TopicName { get; set; }        // NEW
    public int TeacherId { get; set; }
    public string? TeacherName { get; set; }
    public List<SectionDto> Sections { get; set; }
    public bool IsLive { get; set; }
    public bool IsPublished { get; set; }
    public bool IsFree { get; set; }
    public int? LectureOrder { get; set; }
    public string? Tags { get; set; }
    public string? AttachmentUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
    public class SectionDto
    {
        public int SectionId { get; set; }
        public string? SectionName { get; set; }
    }

    public class LectureListResponseDto
    {
        public List<LectureResponseDto> Lectures { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalPages { get; set; }
    }

    public class ClassDto
    {
        public int ClassId { get; set; }
        public string? ClassName { get; set; }
    }

    public class SectionResponseDto
    {
        public int SectionId { get; set; }
        public string? SectionName { get; set; }
    }
// Add to your existing LectureDtos.cs
public class BookDto
{
    public int BookId { get; set; }
    public string? BookName { get; set; }
}

public class ChapterDto
{
    public long ChapterId { get; set; }
    public string? ChapterName { get; set; }
    public int? ChapterNo { get; set; }
}

public class TopicDto
{
    public long TopicId { get; set; }
    public string? TopicName { get; set; }
    public int? TopicNo { get; set; }
}
    
}