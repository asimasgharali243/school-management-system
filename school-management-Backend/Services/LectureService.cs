
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace school_management_Backend.Services
{
    public class LectureService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LectureService> _logger;

        public LectureService(ApplicationDbContext context, ILogger<LectureService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(bool Success, int LectureId, string Message)> CreateLectureAsync(
              CreateLectureDto dto, int teacherId)
        {
            // Get the execution strategy for retry support
            var strategy = _context.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                // Use explicit transaction for atomicity
                await using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    // Extract video ID from YouTube URL
                    var videoId = YouTubeService.ExtractVideoId(dto.YoutubeUrl);
                    if (string.IsNullOrWhiteSpace(videoId))
                        return (false, 0, "Invalid YouTube URL");

                    var thumbnailUrl = YouTubeService.GetThumbnailUrl(videoId);

                    // Create the lecture entity
                    var lecture = new Lecture
                    {
                        Title = dto.Title?.Trim() ?? "",
                        Description = dto.Description?.Trim() ?? "",
                        YoutubeUrl = dto.YoutubeUrl?.Trim() ?? "",
                        YoutubeVideoId = videoId ?? "",
                        ThumbnailUrl = thumbnailUrl ?? "",
                        ClassId = dto.ClassId,
                        SubjectId = dto.SubjectId,
                        BookId = dto.BookId,
                        ChapterId = dto.ChapterId,
                        TopicId = dto.TopicId,
                        TeacherId = teacherId,
                        IsLive = false,
                        IsPublished = dto.IsPublished,
                        IsFree = dto.IsFree,
                        Tags = dto.Tags?.Trim() ?? "",
                        AttachmentUrl = "",
                        CreatedAt = DateTime.Now,
                        CreatedBy = teacherId,
                        IsActive = true
                    };

                    // Save the lecture
                    _context.tblVideoLectures.Add(lecture);
                    await _context.SaveChangesAsync();

                    // Get section IDs
                    var sectionIds = dto.SectionIds?.Distinct().ToList() ?? new List<int>();

                    // If no sections provided, get all sections for the class
                    if (!sectionIds.Any())
                    {
                        sectionIds = await _context.tbl_AddSection
                            .Where(s => s.Class_ID == dto.ClassId && s.Active == true)
                            .Select(s => s.ID)
                            .ToListAsync();
                    }

                    // Add lecture-sections mapping
                    if (sectionIds.Any())
                    {
                        var lectureSections = sectionIds.Select(sectionId => new LectureSection
                        {
                            LectureId = lecture.LectureId,
                            SectionId = sectionId,
                            CreatedAt = DateTime.Now
                        }).ToList();

                        await _context.tbl_LectureSections.AddRangeAsync(lectureSections);
                        await _context.SaveChangesAsync();
                    }

                    // Commit the transaction
                    await transaction.CommitAsync();

                    _logger.LogInformation($"Lecture created: ID={lecture.LectureId}, Sections={sectionIds.Count}");
                    return (true, lecture.LectureId, $"Lecture created successfully for {sectionIds.Count} section(s)");
                }
                catch (Exception ex)
                {
                    // Rollback on error
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error creating lecture");
                    throw; // Re-throw to let controller handle
                }
            });
        }

        // public async Task<LectureResponseDto> GetLectureByIdAsync(int lectureId)
        // {
        //     var lecture = await _context.tblVideoLectures
        //         .AsNoTracking()
        //         .FirstOrDefaultAsync(l => l.LectureId == lectureId && l.IsActive == true);
        //     if (lecture == null) return null;
        //     return await BuildResponseDto(lecture);
        // }


        public async Task<LectureResponseDto> GetLectureByIdAsync(int lectureId)
{
    // FIX: Use the same safe projection pattern as GetLecturesAsync
    var lecture = await _context.tblVideoLectures
        .AsNoTracking()
        .Where(l => l.LectureId == lectureId && l.IsActive == true)
        .Select(l => new LectureRawDto
        {
            LectureId = l.LectureId,
            Title = l.Title ?? "",
            Description = l.Description ?? "",
            YoutubeUrl = l.YoutubeUrl ?? "",
            YoutubeVideoId = l.YoutubeVideoId ?? "",
            ThumbnailUrl = l.ThumbnailUrl ?? "",
            ClassId = l.ClassId,
            SubjectId = l.SubjectId,
            BookId = l.BookId,
            ChapterId = l.ChapterId,
            TopicId = l.TopicId,
            TeacherId = l.TeacherId,
            IsLive = l.IsLive ?? false,
            IsPublished = l.IsPublished ?? false,
            IsFree = l.IsFree ?? false,
            LectureOrder = l.LectureOrder,
            Tags = l.Tags ?? "",
            AttachmentUrl = l.AttachmentUrl ?? "",
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt
        })
        .FirstOrDefaultAsync();

    if (lecture == null) return null;

    var dto = new LectureResponseDto
    {
        LectureId = lecture.LectureId,
        Title = lecture.Title,
        Description = lecture.Description,
        YoutubeUrl = lecture.YoutubeUrl,
        YoutubeVideoId = lecture.YoutubeVideoId,
        EmbedUrl = YouTubeService.GetEmbedUrl(lecture.YoutubeVideoId) ?? "",
        ThumbnailUrl = lecture.ThumbnailUrl,
        ClassId = lecture.ClassId,
        SubjectId = lecture.SubjectId,
        BookId = lecture.BookId,
        ChapterId = lecture.ChapterId,
        TopicId = lecture.TopicId,
        TeacherId = lecture.TeacherId,
        IsLive = lecture.IsLive,
        IsPublished = lecture.IsPublished,
        IsFree = lecture.IsFree,
        LectureOrder = lecture.LectureOrder,
        Tags = lecture.Tags,
        AttachmentUrl = lecture.AttachmentUrl,
        CreatedAt = lecture.CreatedAt,
        UpdatedAt = lecture.UpdatedAt
    };
    await FillRelatedData(dto);
    return dto;
}

        public async Task<LectureListResponseDto> GetLecturesAsync(
            int? classId, int? subjectId, int teacherId, int page = 1, int limit = 20)
        {
            _logger.LogInformation($"[DEBUG] GetLecturesAsync: classId={classId}, subjectId={subjectId}, teacherId={teacherId}");

            var query = _context.tblVideoLectures
                .AsNoTracking()
                .Where(l => l.CreatedBy == teacherId && l.IsActive == true);

            if (classId.HasValue) query = query.Where(l => l.ClassId == classId.Value);
            if (subjectId.HasValue) query = query.Where(l => l.SubjectId == subjectId.Value);

            var total = await query.CountAsync();
            _logger.LogInformation($"[DEBUG] Total: {total}");

            // Get lectures with ALL null-safe projections
            var lectures = await query
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(l => new LectureRawDto
                {
                    LectureId = l.LectureId,
                    Title = l.Title ?? "",
                    Description = l.Description ?? "",
                    YoutubeUrl = l.YoutubeUrl ?? "",
                    YoutubeVideoId = l.YoutubeVideoId ?? "",
                    ThumbnailUrl = l.ThumbnailUrl ?? "",
                    ClassId = l.ClassId,
                    SubjectId = l.SubjectId,
                    BookId = l.BookId,
                    ChapterId = l.ChapterId,
                    TopicId = l.TopicId,
                    TeacherId = l.TeacherId,
                    IsLive = l.IsLive ?? false,
                    IsPublished = l.IsPublished ?? false,
                    IsFree = l.IsFree ?? false,
                    LectureOrder = l.LectureOrder,
                    Tags = l.Tags ?? "",
                    AttachmentUrl = l.AttachmentUrl ?? "",
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt
                })
                .ToListAsync();

            _logger.LogInformation($"[DEBUG] Retrieved {lectures.Count} lectures");

            var lectureDtos = new List<LectureResponseDto>();
            foreach (var l in lectures)
            {
                var dto = new LectureResponseDto
                {
                    LectureId = l.LectureId,
                    Title = l.Title,
                    Description = l.Description,
                    YoutubeUrl = l.YoutubeUrl,
                    YoutubeVideoId = l.YoutubeVideoId,
                    EmbedUrl = YouTubeService.GetEmbedUrl(l.YoutubeVideoId) ?? "",
                    ThumbnailUrl = l.ThumbnailUrl,
                    ClassId = l.ClassId,
                    SubjectId = l.SubjectId,
                    BookId = l.BookId,
                    ChapterId = l.ChapterId,
                    TopicId = l.TopicId,
                    TeacherId = l.TeacherId,
                    IsLive = l.IsLive,
                    IsPublished = l.IsPublished,
                    IsFree = l.IsFree,
                    LectureOrder = l.LectureOrder,
                    Tags = l.Tags,
                    AttachmentUrl = l.AttachmentUrl,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt
                };
                await FillRelatedData(dto);
                lectureDtos.Add(dto);
            }

            return new LectureListResponseDto
            {
                Lectures = lectureDtos,
                Total = total,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling(total / (double)limit)
            };
        }

        public async Task<LectureListResponseDto> GetLecturesForStudentAsync(
            int classId, int sectionId, int page = 1, int limit = 20)
        {
            var sectionLectureIds = await _context.tbl_LectureSections
                .AsNoTracking()
                .Where(ls => ls.SectionId == sectionId)
                .Select(ls => ls.LectureId)
                .Distinct()
                .ToListAsync();

            if (!sectionLectureIds.Any())
                return new LectureListResponseDto { Lectures = new List<LectureResponseDto>(), Total = 0, Page = page, Limit = limit, TotalPages = 0 };

            var lectures = await _context.tblVideoLectures
                .AsNoTracking()
                .Where(l => l.ClassId == classId && l.IsActive == true && l.IsPublished == true && sectionLectureIds.Contains(l.LectureId))
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(l => new LectureRawDto
                {
                    LectureId = l.LectureId,
                    Title = l.Title ?? "",
                    Description = l.Description ?? "",
                    YoutubeUrl = l.YoutubeUrl ?? "",
                    YoutubeVideoId = l.YoutubeVideoId ?? "",
                    ThumbnailUrl = l.ThumbnailUrl ?? "",
                    ClassId = l.ClassId,
                    SubjectId = l.SubjectId,
                    BookId = l.BookId,
                    ChapterId = l.ChapterId,
                    TopicId = l.TopicId,
                    TeacherId = l.TeacherId,
                    IsLive = l.IsLive ?? false,
                    IsPublished = l.IsPublished ?? false,
                    IsFree = l.IsFree ?? false,
                    LectureOrder = l.LectureOrder,
                    Tags = l.Tags ?? "",
                    AttachmentUrl = l.AttachmentUrl ?? "",
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt
                })
                .ToListAsync();

            var total = await _context.tblVideoLectures
                .CountAsync(l => l.ClassId == classId && l.IsActive == true && l.IsPublished == true && sectionLectureIds.Contains(l.LectureId));

            var lectureDtos = new List<LectureResponseDto>();
            foreach (var l in lectures)
            {
                var dto = new LectureResponseDto
                {
                    LectureId = l.LectureId,
                    Title = l.Title,
                    Description = l.Description,
                    YoutubeUrl = l.YoutubeUrl,
                    YoutubeVideoId = l.YoutubeVideoId,
                    EmbedUrl = YouTubeService.GetEmbedUrl(l.YoutubeVideoId) ?? "",
                    ThumbnailUrl = l.ThumbnailUrl,
                    ClassId = l.ClassId,
                    SubjectId = l.SubjectId,
                    BookId = l.BookId,
                    ChapterId = l.ChapterId,
                    TopicId = l.TopicId,
                    TeacherId = l.TeacherId,
                    IsLive = l.IsLive,
                    IsPublished = l.IsPublished,
                    IsFree = l.IsFree,
                    LectureOrder = l.LectureOrder,
                    Tags = l.Tags,
                    AttachmentUrl = l.AttachmentUrl,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt
                };
                await FillRelatedData(dto);
                lectureDtos.Add(dto);
            }

            return new LectureListResponseDto
            {
                Lectures = lectureDtos,
                Total = total,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling(total / (double)limit)
            };
        }

        public async Task<(bool Success, string Message)> DeleteLectureAsync(int lectureId, int teacherId)
        {
            var lecture = await _context.tblVideoLectures
                .FirstOrDefaultAsync(l => l.LectureId == lectureId && l.CreatedBy == teacherId);

            if (lecture == null)
                return (false, "Lecture not found or unauthorized");

            lecture.IsActive = false;
            lecture.UpdatedAt = DateTime.Now;
            lecture.UpdatedBy = teacherId;
            await _context.SaveChangesAsync();
            return (true, "Lecture deleted successfully");
        }

        // Fill related names AFTER materializing the main data
        // private async Task FillRelatedData(LectureResponseDto dto)
        // {
        //     try
        //     {
        //         // Class name
        //         dto.ClassName = await _context.tbl_AddClass
        //             .Where(c => c.Class_ID == dto.ClassId)
        //             .Select(c => c.Class_Name)
        //             .FirstOrDefaultAsync() ?? "N/A";

        //         // Subject
        //         var subj = await _context.tbl_Subject
        //             .Where(s => s.Subject_Id == dto.SubjectId)
        //             .Select(s => new { s.Subject_Name, s.ColorCode })
        //             .FirstOrDefaultAsync();
        //         dto.SubjectName = subj?.Subject_Name ?? "N/A";
        //         dto.SubjectColorCode = subj?.ColorCode ?? "#6366F1";

        //         // Sections
        //         var sections = await _context.tbl_LectureSections
        //             .AsNoTracking()
        //             .Where(ls => ls.LectureId == dto.LectureId)
        //             .Select(ls => ls.SectionId)
        //             .ToListAsync();

        //         if (sections.Any())
        //         {
        //             dto.Sections = await _context.tbl_AddSection
        //                 .AsNoTracking()
        //                 .Where(s => sections.Contains(s.ID))
        //                 .Select(s => new SectionDto
        //                 {
        //                     SectionId = s.ID,
        //                     SectionName = s.Section ?? "N/A"
        //                 })
        //                 .ToListAsync();
        //         }
        //         else
        //         {
        //             dto.Sections = new List<SectionDto>();
        //         }

        //         // Book name
        //         if (dto.BookId.HasValue && dto.BookId.Value > 0)
        //         {
        //             dto.BookName = await _context.tbl_SubjectBook
        //                 .AsNoTracking()
        //                 .Where(b => b.BookID == dto.BookId.Value)
        //                 .Select(b => b.Book)
        //                 .FirstOrDefaultAsync();
        //         }

        //         // Chapter name
        //         if (dto.ChapterId.HasValue && dto.ChapterId.Value > 0)
        //         {
        //             dto.ChapterName = await _context.tbl_SubjectChapter
        //                 .AsNoTracking()
        //                 .Where(c => c.ChapterID == dto.ChapterId.Value)
        //                 .Select(c => c.ChapterName)
        //                 .FirstOrDefaultAsync();
        //         }

        //         // Topic name
        //         if (dto.TopicId.HasValue && dto.TopicId.Value > 0)
        //         {
        //             dto.TopicName = await _context.tbl_ChapterTopic
        //                 .AsNoTracking()
        //                 .Where(t => t.TopicID == dto.TopicId.Value)
        //                 .Select(t => t.TopicName)
        //                 .FirstOrDefaultAsync();
        //         }

        //         // Teacher name
        //         dto.TeacherName = await _context.tbl_User
        //             .AsNoTracking()
        //             .Where(u => u.ID == dto.TeacherId || u.EmployeeCode == dto.TeacherId)
        //             .Select(u => u.UserName)
        //             .FirstOrDefaultAsync() ?? "N/A";
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, $"Error filling related data for LectureId={dto.LectureId}");
        //     }
        // }


private async Task FillRelatedData(LectureResponseDto dto)
{
    try
    {
        // Class name
        var classEntity = await _context.tbl_AddClass
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Class_ID == dto.ClassId);
        dto.ClassName = classEntity?.Class_Name ?? "N/A";

        // Subject
        var subj = await _context.tbl_Subject
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Subject_Id == dto.SubjectId);
        dto.SubjectName = subj?.Subject_Name ?? "N/A";
        dto.SubjectColorCode = subj?.ColorCode ?? "#6366F1";

        // Sections - FIX: Handle NULL Section column
        var sectionIds = await _context.tbl_LectureSections
            .AsNoTracking()
            .Where(ls => ls.LectureId == dto.LectureId)
            .Select(ls => ls.SectionId)
            .ToListAsync();

        if (sectionIds.Any())
        {
            var sectionEntities = await _context.tbl_AddSection
                .AsNoTracking()
                .Where(s => sectionIds.Contains(s.ID))
                .ToListAsync();

            dto.Sections = sectionEntities.Select(s => new SectionDto
            {
                SectionId = s.ID,
                SectionName = s.Section ?? "N/A"  // FIX: Handle NULL Section
            }).ToList();
        }
        else
        {
            dto.Sections = new List<SectionDto>();
        }

        // Book name
        if (dto.BookId.HasValue && dto.BookId.Value > 0)
        {
            var book = await _context.tbl_SubjectBook
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.BookID == dto.BookId.Value);
            dto.BookName = book?.Book;
        }

        // Chapter name
        if (dto.ChapterId.HasValue && dto.ChapterId.Value > 0)
        {
            var chapter = await _context.tbl_SubjectChapter
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.ChapterID == dto.ChapterId.Value);
            dto.ChapterName = chapter?.ChapterName;
        }

        // Topic name
        if (dto.TopicId.HasValue && dto.TopicId.Value > 0)
        {
            var topic = await _context.tbl_ChapterTopic
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TopicID == dto.TopicId.Value);
            dto.TopicName = topic?.TopicName;
        }

        // Teacher name
        var teacher = await _context.tbl_User
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.ID == dto.TeacherId || u.EmployeeCode == dto.TeacherId);
        dto.TeacherName = teacher?.UserName ?? "N/A";
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"Error filling related data for LectureId={dto.LectureId}");
        // Set defaults so the response doesn't fail
        dto.ClassName ??= "N/A";
        dto.SubjectName ??= "N/A";
        dto.SubjectColorCode ??= "#6366F1";
        dto.Sections ??= new List<SectionDto>();
        dto.TeacherName ??= "N/A";
    }
}
        private async Task<LectureResponseDto> BuildResponseDto(Lecture lecture)
        {
            var dto = new LectureResponseDto
            {
                LectureId = lecture.LectureId,
                Title = lecture.Title ?? "",
                Description = lecture.Description ?? "",
                YoutubeUrl = lecture.YoutubeUrl ?? "",
                YoutubeVideoId = lecture.YoutubeVideoId ?? "",
                EmbedUrl = YouTubeService.GetEmbedUrl(lecture.YoutubeVideoId) ?? "",
                ThumbnailUrl = lecture.ThumbnailUrl ?? "",
                ClassId = lecture.ClassId,
                SubjectId = lecture.SubjectId,
                BookId = lecture.BookId,
                ChapterId = lecture.ChapterId,
                TopicId = lecture.TopicId,
                TeacherId = lecture.TeacherId,
                IsLive = lecture.IsLive ?? false,
                IsPublished = lecture.IsPublished ?? false,
                IsFree = lecture.IsFree ?? false,
                LectureOrder = lecture.LectureOrder,
                Tags = lecture.Tags ?? "",
                AttachmentUrl = lecture.AttachmentUrl ?? "",
                CreatedAt = lecture.CreatedAt,
                UpdatedAt = lecture.UpdatedAt
            };
            await FillRelatedData(dto);
            return dto;
        }
    }

    // Internal DTO for safe materialization
    internal class LectureRawDto
    {
        public int LectureId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string YoutubeUrl { get; set; }
        public string YoutubeVideoId { get; set; }
        public string ThumbnailUrl { get; set; }
        public int ClassId { get; set; }
        public int SubjectId { get; set; }
        public int? BookId { get; set; }
        public long? ChapterId { get; set; }
        public long? TopicId { get; set; }
        public int TeacherId { get; set; }
        public bool IsLive { get; set; }
        public bool IsPublished { get; set; }
        public bool IsFree { get; set; }
        public int? LectureOrder { get; set; }
        public string Tags { get; set; }
        public string AttachmentUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}