using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Services;
using System.Security.Claims;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LecturesController : BaseApiController
    {
       
        private readonly LectureService _lectureService;
        private readonly ILogger<LecturesController> _logger;
        private readonly IMemoryCache _cache;

        public LecturesController(
         
            LectureService lectureService,
            ILogger<LecturesController> logger,
            IMemoryCache cache)
        {
          
            _lectureService = lectureService;
            _logger = logger;
            _cache = cache;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        private async Task<int?> GetEmployeeCode(int userId)
        {
            var user = await DbContext.tbl_User
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.ID == userId);
            return user?.EmployeeCode;
        }

        // GET: api/Lectures/classes
        [HttpGet("classes")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetClasses()
        {
            try
            {
                var userId = GetUserIdFromToken();
                var cacheKey = $"lecture_classes_{userId}";

                if (!_cache.TryGetValue(cacheKey, out object result))
                {
                    var employeeCode = await GetEmployeeCode(userId);
                    if (!employeeCode.HasValue)
                        return BadRequest(new { success = false, message = "Employee code not found" });

                    var classes = await DbContext.tbl_EmployeeSubject
                        .AsNoTracking()
                        .Where(es => es.Employee_Code == employeeCode.Value)
                        .Join(
                            DbContext.tbl_AddClass.AsNoTracking().Where(c => c.Active == true),
                            es => es.Class_ID,
                            c => c.Class_ID,
                            (es, c) => new ClassDto { ClassId = c.Class_ID, ClassName = c.Class_Name }
                        )
                        .Distinct()
                        .OrderBy(c => c.ClassName)
                        .ToListAsync();

                    result = new { success = true, data = classes };
                    _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClasses");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Lectures/sections/{classId}
        [HttpGet("sections/{classId}")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetSections(int classId)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var cacheKey = $"lecture_sections_{userId}_{classId}";

                if (!_cache.TryGetValue(cacheKey, out object result))
                {
                    var employeeCode = await GetEmployeeCode(userId);
                    if (!employeeCode.HasValue)
                        return BadRequest(new { success = false, message = "Employee code not found" });

                    var sections = await DbContext.tbl_EmployeeSubject
                        .AsNoTracking()
                        .Where(es => es.Employee_Code == employeeCode.Value && es.Class_ID == classId)
                        .Join(
                            DbContext.tbl_AddSection.AsNoTracking().Where(s => s.Active == true),
                            es => es.Section_ID,
                            s => s.ID,
                            (es, s) => new SectionResponseDto { SectionId = s.ID, SectionName = s.Section }
                        )
                        .Distinct()
                        .OrderBy(s => s.SectionName)
                        .ToListAsync();

                    result = new { success = true, data = sections };
                    _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetSections for class {classId}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Lectures/subjects/{classId}
        [HttpGet("subjects/{classId}")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetSubjects(int classId)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var cacheKey = $"lecture_subjects_{userId}_{classId}";

                if (!_cache.TryGetValue(cacheKey, out object result))
                {
                    var employeeCode = await GetEmployeeCode(userId);
                    if (!employeeCode.HasValue)
                        return BadRequest(new { success = false, message = "Employee code not found" });

                    var subjects = await DbContext.tbl_ClassWiseSubject
                        .AsNoTracking()
                        .Where(es =>  es.ClassID == classId)
                        .Join(
                            DbContext.tbl_Subject.AsNoTracking(),
                            es => es.SubjectID,
                            s => s.Subject_Id,
                            (es, s) => new SubjectDto
                            {
                                Id = s.Subject_Id,
                            Name = s.Subject_Name ?? string.Empty,
                                ColorCode = s.ColorCode ?? "#6366F1"
                            }
                        )
                        .Distinct()
                        .OrderBy(s => s.Name)
                        .ToListAsync();

                    result = new { success = true, data = subjects };
                    _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetSubjects for class {classId}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        // GET: api/Lectures/books/{classId}/{subjectId}
[HttpGet("books/{classId}/{subjectId}")]
[Authorize(Roles = "Admin,Teacher,Manager")]
public async Task<IActionResult> GetBooks(int classId, int subjectId)
{
    try
    {

        Console.WriteLine($"Fetching books for ClassId: {classId}, SubjectId: {subjectId}"); // Debug log
        var cacheKey = $"lecture_books_{classId}_{subjectId}";

        if (!_cache.TryGetValue(cacheKey, out object result))
        {
            var books = await DbContext.tbl_SubjectBook
                .AsNoTracking()
                .Where(b => b.ClassID == classId && b.SubjectID == subjectId && b.Active == true)
                .Select(b => new BookDto
                {
                    BookId = b.BookID,
                    BookName = b.Book
                })
                .Distinct()
                .OrderBy(b => b.BookName)
                .ToListAsync();

            result = new { success = true, data = books };
            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));
        }

        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error in GetBooks");
        return StatusCode(500, new { success = false, message = ex.Message });
    }
}

// GET: api/Lectures/chapters/{classId}/{subjectId}/{bookId}
[HttpGet("chapters/{classId}/{subjectId}/{bookId}")]
[Authorize(Roles = "Admin,Teacher,Manager")]
public async Task<IActionResult> GetChapters(int classId, int subjectId, int bookId)
{
    try
    {
        Console.WriteLine($"Fetching chapters for ClassId: {classId}, SubjectId: {subjectId}, BookId: {bookId}"); // Debug log
        var cacheKey = $"lecture_chapters_{classId}_{subjectId}_{bookId}";

        if (!_cache.TryGetValue(cacheKey, out object result))
        {
            var chapters = await DbContext.tbl_SubjectChapter
                .AsNoTracking()
                .Where(c => c.ClassID == classId && c.SubjectID == subjectId && c.BookID == bookId && c.Active == true)
                .Select(c => new ChapterDto
                {
                    ChapterId = c.ChapterID,
                    ChapterName = c.ChapterName,
                    ChapterNo = c.ChapterNo
                })
                .Distinct()
                .OrderBy(c => c.ChapterNo)
                .ThenBy(c => c.ChapterName)
                .ToListAsync();

            result = new { success = true, data = chapters };
            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));
        }

        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error in GetChapters");
        return StatusCode(500, new { success = false, message = ex.Message });
    }
}

// GET: api/Lectures/topics/{classId}/{subjectId}/{bookId}/{chapterId}
[HttpGet("topics/{classId}/{subjectId}/{bookId}/{chapterId}")]
[Authorize(Roles = "Admin,Teacher,Manager")]
public async Task<IActionResult> GetTopics(int classId, int subjectId, int bookId, long chapterId)
{
    try
    {
        Console.WriteLine($"Fetching topics for ClassId: {classId}, SubjectId: {subjectId}, BookId: {bookId}, ChapterId: {chapterId}"); // Debug log        
        var cacheKey = $"lecture_topics_{classId}_{subjectId}_{bookId}_{chapterId}";

        if (!_cache.TryGetValue(cacheKey, out object result))
        {
            var topics = await DbContext.tbl_ChapterTopic
                .AsNoTracking()
                .Where(t => t.ClassID == classId && t.SubjectID == subjectId && t.BookID == bookId && t.ChapterID == (int)chapterId && t.Active == true)
                .Select(t => new TopicDto
                {
                    TopicId = t.TopicID,
                    TopicName = t.TopicName,
                    TopicNo = t.TopicNo
                })
                .Distinct()
                .OrderBy(t => t.TopicNo)
                .ThenBy(t => t.TopicName)
                .ToListAsync();

            result = new { success = true, data = topics };
            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));
        }

        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error in GetTopics");
        return StatusCode(500, new { success = false, message = ex.Message });
    }
}

        // POST: api/Lectures/create
        [HttpPost("create")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> CreateLecture([FromBody] CreateLectureDto model)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0)
                    return Unauthorized(new { success = false, message = "Invalid token" });

                if (string.IsNullOrWhiteSpace(model.Title))
                    return BadRequest(new { success = false, message = "Title is required" });

                if (string.IsNullOrWhiteSpace(model.YoutubeUrl))
                    return BadRequest(new { success = false, message = "YouTube URL is required" });

                if (model.ClassId <= 0)
                    return BadRequest(new { success = false, message = "Class is required" });

                if (model.SectionIds == null || !model.SectionIds.Any())
                    return BadRequest(new { success = false, message = "At least one section is required" });

                if (model.SubjectId <= 0)
                    return BadRequest(new { success = false, message = "Subject is required" });

                if (!YouTubeService.IsValidYouTubeUrl(model.YoutubeUrl))
                    return BadRequest(new { success = false, message = "Invalid YouTube URL" });

                var (success, lectureId, message) = await _lectureService.CreateLectureAsync(model, userId);

                if (!success)
                    return BadRequest(new { success = false, message });

                _cache.Remove($"lecture_classes_{userId}");

                return Ok(new { success = true, message, data = new { lectureId } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating lecture");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        

        // // GET: api/Lectures/list
        // [HttpGet("list")]
        // [Authorize(Roles = "Admin,Teacher,Manager")]
        // public async Task<IActionResult> GetLectures(
        //     [FromQuery] int? classId,
        //     [FromQuery] int? subjectId,
        //     [FromQuery] int page = 1,
        //     [FromQuery] int limit = 20)
        // {
        //     try
        //     {
        //         var userId = GetUserIdFromToken();
        //         var result = await _lectureService.GetLecturesAsync(classId, subjectId, userId, page, limit);
        //         return Ok(new { success = true, data = result });
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error getting lectures");
        //         return StatusCode(500, new { success = false, message = ex.Message });
        //     }
        // }


// GET: api/Lectures/list
[HttpGet("list")]
[Authorize(Roles = "Admin,Teacher,Manager")]
public async Task<IActionResult> GetLectures(
    [FromQuery] int? classId,
    [FromQuery] int? subjectId,
    [FromQuery] int page = 1,
    [FromQuery] int limit = 20)
{
    try
    {
        Console.WriteLine($"=== GetLectures API called ===");
        Console.WriteLine($"Query params: classId={classId}, subjectId={subjectId}, page={page}, limit={limit}");
        
        var userId = GetUserIdFromToken();
        Console.WriteLine($"User ID from token: {userId}");
        
        var result = await _lectureService.GetLecturesAsync(classId, subjectId, userId, page, limit);
        
        Console.WriteLine($"API returning {result?.Lectures?.Count ?? 0} lectures");
        
        return Ok(new { success = true, data = result });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"=== GetLectures API ERROR: {ex.Message} ===");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        _logger.LogError(ex, "Error getting lectures");
        return StatusCode(500, new { success = false, message = ex.Message });
    }
}

        // GET: api/Lectures/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLecture(int id)
        {
            try
            {
                var lecture = await _lectureService.GetLectureByIdAsync(id);
                if (lecture == null)
                    return NotFound(new { success = false, message = "Lecture not found" });

                return Ok(new { success = true, data = lecture });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting lecture {id}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Lectures/student
        [HttpGet("student")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent,Student")]
        public async Task<IActionResult> GetStudentLectures(
            [FromQuery] int classId,
            [FromQuery] int sectionId,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20)
        {
            try
            {
                var result = await _lectureService.GetLecturesForStudentAsync(classId, sectionId, page, limit);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting student lectures");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/Lectures/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> DeleteLecture(int id)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var (success, message) = await _lectureService.DeleteLectureAsync(id, userId);

                if (!success)
                    return NotFound(new { success = false, message });

                return Ok(new { success = true, message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting lecture {id}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}