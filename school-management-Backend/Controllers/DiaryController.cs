// // // Controllers/DiaryController.cs
// // using Microsoft.AspNetCore.Authorization;
// // using Microsoft.AspNetCore.Mvc;
// // using Microsoft.EntityFrameworkCore;
// // using school_management_Backend.Data;
// // using school_management_Backend.Models;
// // using school_management_Backend.DTOs;
// // using Microsoft.Extensions.Logging;

// // namespace school_management_Backend.Controllers
// // {
// //     [Route("api/[controller]")]
// //     [ApiController]
// //     [Authorize]
// //     public class DiaryController : ControllerBase
// //     {
// //         private readonly ApplicationDbContext _context;
// //         private readonly ILogger<DiaryController> _logger;

// //         public DiaryController(ApplicationDbContext context, ILogger<DiaryController> logger)
// //         {
// //             _context = context;
// //             _logger = logger;
// //         }

// //         // GET: api/diary/child/{childId}
// //         [HttpGet("child/{childId}")]
// //         public async Task<ActionResult<ApiResponse<DiaryResponseDto>>> GetChildDiary(
// //             int childId,
// //             [FromQuery] DiaryFilters filters)
// //         {
// //             try
// //             {
// //                 // Get student info to get class and section
// //                 var student = await _context.tbl_StudentRegistration
// //                     .FirstOrDefaultAsync(s => s.Reg_Id == childId);

// //                 if (student == null)
// //                 {
// //                     return NotFound(ApiResponse<DiaryResponseDto>.CreateError("Student not found"));
// //                 }

// //                 // Get diary entries for student's class and section
// //                 var query = from diary in _context.tblDiary
// //                             join subject in _context.tbl_Subject 
// //                                 on diary.SubjectID equals subject.Subject_Id into subjectJoin
// //                             from subject in subjectJoin.DefaultIfEmpty()
// //                             join employee in _context.tbl_Employee 
// //                                 on diary.EmployeeID equals employee.Employee_Code into empJoin
// //                             from employee in empJoin.DefaultIfEmpty()
// //                             where diary.ClassID == student.Class_ID && 
// //                                   diary.SectionID == student.Section_ID && 
// //                                   diary.Status == true
// //                             select new 
// //                             {
// //                                 Diary = diary,
// //                                 Subject = subject,
// //                                 Employee = employee
// //                             };

// //                 // Apply filters
// //                 if (!string.IsNullOrEmpty(filters.Date))
// //                 {
// //                     if (DateOnly.TryParse(filters.Date, out var date))
// //                     {
// //                         query = query.Where(x => x.Diary.Date == date);
// //                     }
// //                 }

// //                 if (filters.Month.HasValue && filters.Year.HasValue)
// //                 {
// //                     query = query.Where(x => x.Diary.Date.HasValue && 
// //                                              x.Diary.Date.Value.Month == filters.Month.Value && 
// //                                              x.Diary.Date.Value.Year == filters.Year.Value);
// //                 }

// //                 if (filters.SubjectId.HasValue)
// //                 {
// //                     query = query.Where(x => x.Diary.SubjectID == filters.SubjectId.Value);
// //                 }

// //                 var diaryEntries = await query
// //                     .OrderByDescending(x => x.Diary.Date)
// //                     .Select(x => new DiaryEntryDto
// //                     {
// //                         Id = x.Diary.DiaryID,
// //                         Date = x.Diary.Date.HasValue ? x.Diary.Date.Value.ToString("yyyy-MM-dd") : "",
// //                         Content = x.Diary.Details ?? "",
// //                         Subject = x.Subject != null ? x.Subject.Subject_Name : "General",
// //                         SubjectId = x.Diary.SubjectID,
// //                         Teacher = x.Employee != null ? x.Employee.Employee_Name : "Teacher",
// //                         TeacherId = x.Diary.EmployeeID,
// //                         ClassId = x.Diary.ClassID,
// //                         SectionId = x.Diary.SectionID,
// //                         CreatedAt = x.Diary.CreatedDT
// //                     })
// //                     .ToListAsync();

// //                 var response = new DiaryResponseDto
// //                 {
// //                     Entries = diaryEntries,
// //                     Count = diaryEntries.Count,
// //                     StudentId = childId,
// //                     GeneratedAt = DateTime.Now
// //                 };

// //                 return Ok(ApiResponse<DiaryResponseDto>.CreateSuccess(response));
// //             }
// //             catch (Exception ex)
// //             {
// //                 return StatusCode(500, ApiResponse<DiaryResponseDto>.CreateError($"Error fetching diary: {ex.Message}"));
// //             }
// //         }
// //     }

// //     // DTO Classes for Diary
// //     public class DiaryEntryDto
// //     {
// //         public long Id { get; set; }
// //         public string Date { get; set; } = string.Empty;
// //         public string Content { get; set; } = string.Empty;
// //         public string Subject { get; set; } = string.Empty;
// //         public int? SubjectId { get; set; }
// //         public string Teacher { get; set; } = string.Empty;
// //         public int? TeacherId { get; set; }
// //         public int? ClassId { get; set; }
// //         public int? SectionId { get; set; }
// //         public DateTime? CreatedAt { get; set; }
// //     }

// //     public class DiaryResponseDto
// //     {
// //         public List<DiaryEntryDto> Entries { get; set; } = new List<DiaryEntryDto>();
// //         public int Count { get; set; }
// //         public int StudentId { get; set; }
// //         public DateTime GeneratedAt { get; set; }
// //     }

// //     public class DiaryFilters
// //     {
// //         public string? Date { get; set; }
// //         public int? Month { get; set; }
// //         public int? Year { get; set; }
// //         public int? SubjectId { get; set; }
// //     }
// // }
// // using Microsoft.AspNetCore.Authorization;
// // using Microsoft.AspNetCore.Mvc;
// // using Microsoft.EntityFrameworkCore;
// // using school_management_Backend.Data;
// // using school_management_Backend.Models;
// // using school_management_Backend.DTOs;
// // using Microsoft.Extensions.Logging;
// // using System.Security.Claims;

// // namespace school_management_Backend.Controllers
// // {
// //     [Route("api/[controller]")]
// //     [ApiController]
// //     [Authorize]
// //     public class DiaryController : ControllerBase
// //     {
// //         private readonly ApplicationDbContext _context;
// //         private readonly ILogger<DiaryController> _logger;

// //         public DiaryController(ApplicationDbContext context, ILogger<DiaryController> logger)
// //         {
// //             _context = context;
// //             _logger = logger;
// //         }

// //         // GET: api/diary/child/{childId}
// //         [HttpGet("child/{childId}")]
// //         public async Task<ActionResult<ApiResponse<DiaryResponseDto>>> GetChildDiary(
// //             int childId,
// //             [FromQuery] DiaryFilters filters)
// //         {
// //             try
// //             {
// //                 _logger.LogInformation($"Fetching diary for child {childId}");

// //                 var student = await _context.tbl_StudentRegistration
// //                     .FirstOrDefaultAsync(s => s.Reg_Id == childId);

// //                 if (student == null)
// //                 {
// //                     return NotFound(ApiResponse<DiaryResponseDto>.CreateError("Student not found"));
// //                 }

// //                 var query = from diary in _context.tbl_ClassDiary
// //                             join subject in _context.tbl_Subject 
// //                                 on diary.SubjectID equals subject.Subject_Id into subjectJoin
// //                             from subject in subjectJoin.DefaultIfEmpty()
// //                             join user in _context.tbl_User 
// //                                 on diary.CreatedBy equals user.ID into userJoin
// //                             from user in userJoin.DefaultIfEmpty()
// //                             where diary.ClassID == student.Class_ID && 
// //                                   diary.SectionID == student.Section_ID &&
// //                                   diary.HomeWork != null &&
// //                                   diary.HomeWork != "" &&
// //                                   (diary.isPublished == null || diary.isPublished == true)
// //                             select new 
// //                             {
// //                                 Diary = diary,
// //                                 Subject = subject,
// //                                 Teacher = user
// //                             };

// //                 if (!string.IsNullOrEmpty(filters.Date))
// //                 {
// //                     if (DateOnly.TryParse(filters.Date, out var date))
// //                     {
// //                         query = query.Where(x => x.Diary.Date == date);
// //                     }
// //                 }

// //                 if (filters.Month.HasValue && filters.Year.HasValue)
// //                 {
// //                     query = query.Where(x => x.Diary.Date.HasValue && 
// //                                              x.Diary.Date.Value.Month == filters.Month.Value && 
// //                                              x.Diary.Date.Value.Year == filters.Year.Value);
// //                 }

// //                 if (filters.SubjectId.HasValue)
// //                 {
// //                     query = query.Where(x => x.Diary.SubjectID == filters.SubjectId.Value);
// //                 }

// //                 var diaryEntries = await query
// //                     .OrderByDescending(x => x.Diary.Date)
// //                     .Select(x => new DiaryEntryDto
// //                     {
// //                         Id = x.Diary.dairyID,
// //                         Date = x.Diary.Date.HasValue ? x.Diary.Date.Value.ToString("yyyy-MM-dd") : "",
// //                         Content = x.Diary.HomeWork ?? "",
// //                         Subject = x.Subject != null ? x.Subject.Subject_Name : "General",
// //                         SubjectId = x.Diary.SubjectID,
// //                         Teacher = x.Teacher != null ? x.Teacher.UserName : "Teacher",
// //                         TeacherId = x.Diary.CreatedBy,
// //                         ClassId = x.Diary.ClassID,
// //                         SectionId = x.Diary.SectionID,
// //                         IsPublished = x.Diary.isPublished ?? false,
// //                         CreatedAt = x.Diary.CreatedDT
// //                     })
// //                     .ToListAsync();

// //                 var response = new DiaryResponseDto
// //                 {
// //                     Entries = diaryEntries,
// //                     Count = diaryEntries.Count,
// //                     StudentId = childId,
// //                     GeneratedAt = DateTime.Now
// //                 };

// //                 return Ok(ApiResponse<DiaryResponseDto>.CreateSuccess(response));
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error fetching diary for child {ChildId}", childId);
// //                 return StatusCode(500, ApiResponse<DiaryResponseDto>.CreateError($"Error fetching diary: {ex.Message}"));
// //             }
// //         }

// //         // GET: api/diary/teacher/classes
// //         // Returns ONLY classes assigned to teacher, but ALL sections for that class
// //         [HttpGet("teacher/classes")]
// //         [Authorize(Roles = "Admin,Teacher,Manager")]
// //         public async Task<IActionResult> GetTeacherClassesForDiary()
// //         {
// //             try
// //             {
// //                 _logger.LogInformation("GetTeacherClassesForDiary called");

// //                 var userId = GetUserIdFromToken();
// //                 if (!userId.HasValue)
// //                 {
// //                     return Unauthorized(new { success = false, message = "Invalid token" });
// //                 }

// //                 // Get teacher's user info
// //                 var user = await _context.tbl_User
// //                     .FirstOrDefaultAsync(u => u.ID == userId.Value);

// //                 if (user == null || !user.EmployeeCode.HasValue)
// //                 {
// //                     return BadRequest(new { success = false, message = "Teacher employee code not found" });
// //                 }

// //                 // Step 1: Get ONLY the classes assigned to this teacher from tbl_EmployeeSubject
// //                 var teacherAssignedClasses = await _context.tbl_EmployeeSubject
// //                     .Where(es => es.Employee_Code == user.EmployeeCode.Value)
// //                     .Select(es => new
// //                     {
// //                         ClassId = es.Class_ID ?? 0,
// //                         ClassName = es.Class != null ? es.Class.Class_Name : string.Empty
// //                     })
// //                     .Distinct()
// //                     .ToListAsync();

// //                 if (!teacherAssignedClasses.Any())
// //                 {
// //                     _logger.LogWarning($"No classes assigned to teacher {userId}");
// //                     return Ok(new { success = true, data = new List<object>() });
// //                 }

// //                 _logger.LogInformation($"Teacher has {teacherAssignedClasses.Count} assigned classes");

// //                 // Step 2: For each assigned class, get ALL sections (not just teacher's)
// //                 var result = new List<object>();

// //                 foreach (var assignedClass in teacherAssignedClasses)
// //                 {
// //                     // Get ALL sections for this class
// //                     var allSections = await _context.tbl_AddSection
// //                         .Where(s => s.Class_ID == assignedClass.ClassId && s.Active == true)
// //                         .Select(s => new
// //                         {
// //                             SectionId = s.ID,
// //                             SectionName = s.Section ?? string.Empty,
// //                             TotalStudents = _context.tbl_StudentRegistration
// //                                 .Count(st => st.Section_ID == s.ID && 
// //                                             (st.cur_Status == null || st.cur_Status == "A"))
// //                         })
// //                         .OrderBy(s => s.SectionName)
// //                         .ToListAsync();

// //                     result.Add(new
// //                     {
// //                         ClassId = assignedClass.ClassId,
// //                         ClassName = assignedClass.ClassName,
// //                         Sections = allSections
// //                     });
// //                 }

// //                 _logger.LogInformation($"Returning {result.Count} classes for teacher");

// //                 return Ok(new { success = true, data = result });
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error in GetTeacherClassesForDiary");
// //                 return StatusCode(500, new { success = false, message = ex.Message });
// //             }
// //         }

// //         // GET: api/diary/class/{classId}/subjects-from-classwise
// //         // Returns ALL subjects for the class from tbl_ClassWiseSubject
// //         [HttpGet("class/{classId}/subjects-from-classwise")]
// //         [Authorize(Roles = "Admin,Teacher,Manager")]
// //         public async Task<IActionResult> GetSubjectsFromClassWise(int classId)
// //         {
// //             try
// //             {
// //                 _logger.LogInformation($"Getting ALL subjects for class {classId} from tbl_ClassWiseSubject");

// //                 var subjects = await _context.tbl_ClassWiseSubject
// //                     .Where(cws => cws.ClassID == classId && (cws.Active == null || cws.Active == true))
// //                     .Include(cws => cws.Subject)
// //                     .Select(cws => new
// //                     {
// //                         SubjectId = cws.SubjectID ?? 0,
// //                         SubjectName = cws.Subject != null ? cws.Subject.Subject_Name : "Unknown Subject",
// //                         SubjectCode = cws.Subject != null ? cws.Subject.SubjectCode : "",
// //                         ColorCode = cws.Subject != null ? cws.Subject.ColorCode : "#2196F3"
// //                     })
// //                     .Distinct()
// //                     .OrderBy(s => s.SubjectName)
// //                     .ToListAsync();

// //                 _logger.LogInformation($"Found {subjects.Count} subjects for class {classId}");

// //                 if (!subjects.Any())
// //                 {
// //                     _logger.LogWarning($"No subjects found for class {classId} in tbl_ClassWiseSubject");
// //                 }

// //                 return Ok(new { success = true, data = subjects });
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error getting subjects from ClassWiseSubject");
// //                 return StatusCode(500, new { success = false, message = ex.Message });
// //             }
// //         }

// //         // GET: api/diary/check
// //         [HttpGet("check")]
// //         [Authorize(Roles = "Admin,Teacher,Manager")]
// //         public async Task<IActionResult> CheckDiaryExists(
// //             [FromQuery] int classId,
// //             [FromQuery] int sectionId,
// //             [FromQuery] int subjectId,
// //             [FromQuery] string date)
// //         {
// //             try
// //             {
// //                 if (!DateOnly.TryParse(date, out var diaryDate))
// //                 {
// //                     return BadRequest(new { success = false, message = "Invalid date format" });
// //                 }

// //                 var exists = await _context.tbl_ClassDiary
// //                     .AnyAsync(d => d.ClassID == classId && 
// //                                    d.SectionID == sectionId && 
// //                                    d.SubjectID == subjectId && 
// //                                    d.Date == diaryDate);

// //                 return Ok(new { success = true, exists = exists });
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error checking diary exists");
// //                 return StatusCode(500, new { success = false, message = ex.Message });
// //             }
// //         }

// //         // GET: api/diary/entry
// //         [HttpGet("entry")]
// //         [Authorize(Roles = "Admin,Teacher,Manager")]
// //         public async Task<IActionResult> GetDiaryEntry(
// //             [FromQuery] int classId,
// //             [FromQuery] int sectionId,
// //             [FromQuery] int subjectId,
// //             [FromQuery] string date)
// //         {
// //             try
// //             {
// //                 if (!DateOnly.TryParse(date, out var diaryDate))
// //                 {
// //                     return BadRequest(new { success = false, message = "Invalid date format" });
// //                 }

// //                 var entry = await _context.tbl_ClassDiary
// //                     .FirstOrDefaultAsync(d => d.ClassID == classId && 
// //                                               d.SectionID == sectionId && 
// //                                               d.SubjectID == subjectId && 
// //                                               d.Date == diaryDate);

// //                 if (entry == null)
// //                 {
// //                     return Ok(new { success = true, exists = false, data = (object)null });
// //                 }

// //                 return Ok(new { 
// //                     success = true, 
// //                     exists = true, 
// //                     data = new
// //                     {
// //                         entry.dairyID,
// //                         entry.Date,
// //                         entry.ClassID,
// //                         entry.SectionID,
// //                         entry.SubjectID,
// //                         entry.ClassWork,
// //                         entry.HomeWork,
// //                         entry.isPublished,
// //                         entry.CreatedBy,
// //                         entry.CreatedDT
// //                     }
// //                 });
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error getting diary entry");
// //                 return StatusCode(500, new { success = false, message = ex.Message });
// //             }
// //         }

// //         // POST: api/diary
// //         [HttpPost]
// //         [Authorize(Roles = "Admin,Teacher,Manager")]
// //         public async Task<IActionResult> CreateOrUpdateDiary([FromBody] CreateDiaryDto model)
// //         {
// //             try
// //             {
// //                 _logger.LogInformation($"Creating/Updating diary for Class:{model.ClassID}, Section:{model.SectionID}, Subject:{model.SubjectID}, Date:{model.Date}");

// //                 var existingDiary = await _context.tbl_ClassDiary
// //                     .FirstOrDefaultAsync(d => d.Date == model.Date &&
// //                                                d.ClassID == model.ClassID &&
// //                                                d.SectionID == model.SectionID &&
// //                                                d.SubjectID == model.SubjectID);

// //                 if (existingDiary != null)
// //                 {
// //                     existingDiary.HomeWork = model.HomeWork;
// //                     existingDiary.ClassWork = model.ClassWork;
// //                     existingDiary.ModifyBy = model.CreatedBy;
// //                     existingDiary.ModifyDT = DateTime.Now;
// //                     existingDiary.isPublished = model.isPublished;

// //                     await _context.SaveChangesAsync();
// //                     _logger.LogInformation($"Updated diary entry ID: {existingDiary.dairyID}");

// //                     return Ok(new { 
// //                         success = true, 
// //                         message = "Diary updated successfully",
// //                         data = new { existingDiary.dairyID, existingDiary.isPublished }
// //                     });
// //                 }
// //                 else
// //                 {
// //                     var newDiary = new tbl_ClassDiary
// //                     {
// //                         Date = model.Date,
// //                         ClassID = model.ClassID,
// //                         SectionID = model.SectionID,
// //                         SubjectID = model.SubjectID,
// //                         ClassWork = model.ClassWork,
// //                         HomeWork = model.HomeWork,
// //                         CreatedBy = model.CreatedBy,
// //                         CreatedDT = DateTime.Now,
// //                         ModifyBy = null,
// //                         ModifyDT = null,
// //                         isPublished = model.isPublished,
// //                         ApprovedBy = null,
// //                         ApprovedDT = null
// //                     };

// //                     _context.tbl_ClassDiary.Add(newDiary);
// //                     await _context.SaveChangesAsync();
// //                     _logger.LogInformation($"Created new diary entry ID: {newDiary.dairyID}");

// //                     return Ok(new { 
// //                         success = true, 
// //                         message = "Diary created successfully",
// //                         data = new { newDiary.dairyID, newDiary.isPublished }
// //                     });
// //                 }
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error creating/updating diary");
// //                 return StatusCode(500, new { success = false, message = $"Error saving diary: {ex.Message}" });
// //             }
// //         }

// //         // POST: api/diary/batch
// //         [HttpPost("batch")]
// //         [Authorize(Roles = "Admin,Teacher,Manager")]
// //         public async Task<IActionResult> CreateBatchDiary([FromBody] BatchCreateDiaryDto model)
// //         {
// //             try
// //             {
// //                 _logger.LogInformation($"Creating batch diary for Class:{model.ClassID}, Sections:{string.Join(",", model.SectionIds)}, Subject:{model.SubjectID}");

// //                 var results = new List<object>();
// //                 var updateCount = 0;
// //                 var createCount = 0;

// //                 foreach (var sectionId in model.SectionIds)
// //                 {
// //                     var existingDiary = await _context.tbl_ClassDiary
// //                         .FirstOrDefaultAsync(d => d.Date == model.Date &&
// //                                                    d.ClassID == model.ClassID &&
// //                                                    d.SectionID == sectionId &&
// //                                                    d.SubjectID == model.SubjectID);

// //                     if (existingDiary != null)
// //                     {
// //                         existingDiary.HomeWork = model.HomeWork;
// //                         existingDiary.ClassWork = model.ClassWork;
// //                         existingDiary.ModifyBy = model.CreatedBy;
// //                         existingDiary.ModifyDT = DateTime.Now;
// //                         existingDiary.isPublished = model.isPublished;
// //                         updateCount++;
// //                         results.Add(new { sectionId, action = "updated", id = existingDiary.dairyID });
// //                     }
// //                     else
// //                     {
// //                         var newDiary = new tbl_ClassDiary
// //                         {
// //                             Date = model.Date,
// //                             ClassID = model.ClassID,
// //                             SectionID = sectionId,
// //                             SubjectID = model.SubjectID,
// //                             ClassWork = model.ClassWork,
// //                             HomeWork = model.HomeWork,
// //                             CreatedBy = model.CreatedBy,
// //                             CreatedDT = DateTime.Now,
// //                             ModifyBy = null,
// //                             ModifyDT = null,
// //                             isPublished = model.isPublished,
// //                             ApprovedBy = null,
// //                             ApprovedDT = null
// //                         };
// //                         _context.tbl_ClassDiary.Add(newDiary);
// //                         createCount++;
// //                         results.Add(new { sectionId, action = "created", id = newDiary.dairyID });
// //                     }
// //                 }

// //                 await _context.SaveChangesAsync();
// //                 _logger.LogInformation($"Batch diary completed: {createCount} created, {updateCount} updated");

// //                 return Ok(new { 
// //                     success = true, 
// //                     message = $"Diary saved for {model.SectionIds.Count} section(s)",
// //                     data = new { 
// //                         created = createCount, 
// //                         updated = updateCount, 
// //                         total = model.SectionIds.Count,
// //                         details = results
// //                     }
// //                 });
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error creating batch diary");
// //                 return StatusCode(500, new { success = false, message = $"Error saving batch diary: {ex.Message}" });
// //             }
// //         }

// //         #region Helper Methods

// //         private int? GetUserIdFromToken()
// //         {
// //             try
// //             {
// //                 var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
// //                 if (int.TryParse(userIdClaim, out int userId))
// //                 {
// //                     return userId;
// //                 }
// //                 return null;
// //             }
// //             catch (Exception ex)
// //             {
// //                 _logger.LogError(ex, "Error getting user ID from token");
// //                 return null;
// //             }
// //         }

// //         #endregion
// //     }

// //     #region DTO Classes

// //     public class DiaryEntryDto
// //     {
// //         public long Id { get; set; }
// //         public string Date { get; set; } = string.Empty;
// //         public string Content { get; set; } = string.Empty;
// //         public string Subject { get; set; } = string.Empty;
// //         public int? SubjectId { get; set; }
// //         public string Teacher { get; set; } = string.Empty;
// //         public int? TeacherId { get; set; }
// //         public int? ClassId { get; set; }
// //         public int? SectionId { get; set; }
// //         public bool IsPublished { get; set; }
// //         public DateTime? CreatedAt { get; set; }
// //     }

// //     public class DiaryResponseDto
// //     {
// //         public List<DiaryEntryDto> Entries { get; set; } = new List<DiaryEntryDto>();
// //         public int Count { get; set; }
// //         public int StudentId { get; set; }
// //         public DateTime GeneratedAt { get; set; }
// //     }

// //     public class CreateDiaryDto
// //     {
// //         public DateOnly Date { get; set; }
// //         public int ClassID { get; set; }
// //         public int SectionID { get; set; }
// //         public int SubjectID { get; set; }
// //         public string? ClassWork { get; set; }
// //         public string HomeWork { get; set; } = string.Empty;
// //         public int CreatedBy { get; set; }
// //         public bool isPublished { get; set; } = false;
// //     }

// //     public class BatchCreateDiaryDto
// //     {
// //         public DateOnly Date { get; set; }
// //         public int ClassID { get; set; }
// //         public List<int> SectionIds { get; set; } = new List<int>();
// //         public int SubjectID { get; set; }
// //         public string? ClassWork { get; set; }
// //         public string HomeWork { get; set; } = string.Empty;
// //         public int CreatedBy { get; set; }
// //         public bool isPublished { get; set; } = false;
// //     }

// //     public class DiaryFilters
// //     {
// //         public string? Date { get; set; }
// //         public int? Month { get; set; }
// //         public int? Year { get; set; }
// //         public int? SubjectId { get; set; }
// //     }

// //     #endregion
// // }























// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using school_management_Backend.Data;
// using school_management_Backend.Models;
// using school_management_Backend.DTOs;
// using Microsoft.Extensions.Logging;
// using System.Security.Claims;
// using System;
// using System.Linq;
// using System.Threading.Tasks;

// namespace school_management_Backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize]
//     public class DiaryController : ControllerBase
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly ILogger<DiaryController> _logger;

//         public DiaryController(ApplicationDbContext context, ILogger<DiaryController> logger)
//         {
//             _context = context;
//             _logger = logger;
//         }

//         // // GET: api/diary/child/{childId}
//         // [HttpGet("child/{childId}")]
//         // public async Task<ActionResult<ApiResponse<DiaryResponseDto>>> GetChildDiary(
//         //     int childId,
//         //     [FromQuery] DiaryFilters filters)
//         // {
//         //     try
//         //     {
//         //         _logger.LogInformation($"Fetching diary for child {childId}");

//         //         // Get student info to get class and section
//         //         var student = await _context.tbl_StudentRegistration
//         //             .FirstOrDefaultAsync(s => s.Reg_Id == childId);

//         //         if (student == null)
//         //         {
//         //             return NotFound(ApiResponse<DiaryResponseDto>.CreateError("Student not found"));
//         //         }

//         //         // Get diary entries from tbl_ClassDiary for student's class and section
//         //         var query = from diary in _context.tbl_ClassDiary
//         //                     join subject in _context.tbl_Subject 
//         //                         on diary.SubjectID equals subject.Subject_Id into subjectJoin
//         //                     from subject in subjectJoin.DefaultIfEmpty()
//         //                     join user in _context.tbl_User 
//         //                         on diary.CreatedBy equals user.ID into userJoin
//         //                     from user in userJoin.DefaultIfEmpty()
//         //                     where diary.ClassID == student.Class_ID && 
//         //                           diary.SectionID == student.Section_ID &&
//         //                           diary.HomeWork != null &&
//         //                           diary.HomeWork != "" &&
//         //                           (diary.isPublished == null || diary.isPublished == true)
//         //                     select new 
//         //                     {
//         //                         Diary = diary,
//         //                         Subject = subject,
//         //                         Teacher = user
//         //                     };

//         //         // Apply date filters
//         //         if (!string.IsNullOrEmpty(filters.Date))
//         //         {
//         //             if (DateOnly.TryParse(filters.Date, out var date))
//         //             {
//         //                 query = query.Where(x => x.Diary.Date == date);
//         //             }
//         //         }

//         //         // Apply month/year filters
//         //         if (filters.Month.HasValue && filters.Year.HasValue)
//         //         {
//         //             query = query.Where(x => x.Diary.Date.HasValue && 
//         //                                      x.Diary.Date.Value.Month == filters.Month.Value && 
//         //                                      x.Diary.Date.Value.Year == filters.Year.Value);
//         //         }

//         //         // Apply subject filter
//         //         if (filters.SubjectId.HasValue)
//         //         {
//         //             query = query.Where(x => x.Diary.SubjectID == filters.SubjectId.Value);
//         //         }

//         //         var diaryEntries = await query
//         //             .OrderByDescending(x => x.Diary.Date)
//         //             .Select(x => new DiaryEntryDto
//         //             {
//         //                 Id = x.Diary.dairyID,
//         //                 Date = x.Diary.Date.HasValue ? x.Diary.Date.Value.ToString("yyyy-MM-dd") : "",
//         //                 Content = x.Diary.HomeWork ?? "",
//         //                 Subject = x.Subject != null ? x.Subject.Subject_Name : "General",
//         //                 SubjectId = x.Diary.SubjectID,
//         //                 Teacher = x.Teacher != null ? x.Teacher.UserName : "Teacher",
//         //                 TeacherId = x.Diary.CreatedBy,
//         //                 ClassId = x.Diary.ClassID,
//         //                 SectionId = x.Diary.SectionID,
//         //                 IsPublished = x.Diary.isPublished ?? false,
//         //                 CreatedAt = x.Diary.CreatedDT
//         //             })
//         //             .ToListAsync();

//         //         var response = new DiaryResponseDto
//         //         {
//         //             Entries = diaryEntries,
//         //             Count = diaryEntries.Count,
//         //             StudentId = childId,
//         //             GeneratedAt = DateTime.Now
//         //         };

//         //         return Ok(ApiResponse<DiaryResponseDto>.CreateSuccess(response));
//         //     }
//         //     catch (Exception ex)
//         //     {
//         //         _logger.LogError(ex, "Error fetching diary for child {ChildId}", childId);
//         //         return StatusCode(500, ApiResponse<DiaryResponseDto>.CreateError($"Error fetching diary: {ex.Message}"));
//         //     }
//         // }


// [HttpGet("child/{childId}")]
// public async Task<ActionResult<ApiResponse<DiaryResponseDto>>> GetChildDiary(
//     int childId,
//     [FromQuery] DiaryFilters filters)
// {
//     try
//     {
//         _logger.LogInformation($"Fetching diary for child {childId}");

//         // Get student info to get class and section
//         var student = await _context.tbl_StudentRegistration
//             .Include(s => s.Class)
//             .Include(s => s.Section)
//             .FirstOrDefaultAsync(s => s.Reg_Id == childId);

//         if (student == null)
//         {
//             return NotFound(ApiResponse<DiaryResponseDto>.CreateError("Student not found"));
//         }

//         // Get class and section names
//         string className = student.Class?.Class_Name ?? "N/A";
//         string sectionName = student.Section?.Section ?? "N/A";
//         // Fix: Use correct property name (adjust based on your actual column names)
//         string studentName = !string.IsNullOrEmpty(student.Frist_Name)?student.Frist_Name:"NA";

//         // Get diary entries from tbl_ClassDiary for student's class and section
//         var query = from diary in _context.tbl_ClassDiary
//                     join subject in _context.tbl_Subject 
//                         on diary.SubjectID equals subject.Subject_Id into subjectJoin
//                     from subject in subjectJoin.DefaultIfEmpty()
//                     join user in _context.tbl_User 
//                         on diary.CreatedBy equals user.ID into userJoin
//                     from user in userJoin.DefaultIfEmpty()
//                     where diary.ClassID == student.Class_ID && 
//                           diary.SectionID == student.Section_ID &&
//                           diary.HomeWork != null &&
//                           diary.HomeWork != "" &&
//                           (diary.isPublished == null || diary.isPublished == true)
//                     select new 
//                     {
//                         Diary = diary,
//                         Subject = subject,
//                         Teacher = user
//                     };

//         // Apply date filters
//         if (!string.IsNullOrEmpty(filters.Date))
//         {
//             if (DateOnly.TryParse(filters.Date, out var date))
//             {
//                 query = query.Where(x => x.Diary.Date == date);
//             }
//         }

//         // Apply month/year filters
//         if (filters.Month.HasValue && filters.Year.HasValue)
//         {
//             query = query.Where(x => x.Diary.Date.HasValue && 
//                                      x.Diary.Date.Value.Month == filters.Month.Value && 
//                                      x.Diary.Date.Value.Year == filters.Year.Value);
//         }

//         // Apply subject filter
//         if (filters.SubjectId.HasValue)
//         {
//             query = query.Where(x => x.Diary.SubjectID == filters.SubjectId.Value);
//         }

//         var diaryEntries = await query
//             .OrderByDescending(x => x.Diary.Date)
//             .Select(x => new DiaryEntryDto
//             {
//                 Id = x.Diary.dairyID,
//                 Date = x.Diary.Date.HasValue ? x.Diary.Date.Value.ToString("yyyy-MM-dd") : "",
//                 Content = x.Diary.HomeWork ?? "",
//                 Subject = x.Subject != null ? x.Subject.Subject_Name : "General",
//                 SubjectId = x.Diary.SubjectID,
//                 Teacher = x.Teacher != null ? x.Teacher.UserName : "Teacher",
//                 TeacherId = x.Diary.CreatedBy,
//                 ClassId = x.Diary.ClassID,
//                 ClassName = className,      // Add this field to DTO
//                 SectionId = x.Diary.SectionID,
//                 SectionName = sectionName,  // Add this field to DTO
//                 IsPublished = x.Diary.isPublished ?? false,
//                 CreatedAt = x.Diary.CreatedDT
//             })
//             .ToListAsync();

//         var response = new DiaryResponseDto
//         {
//             Entries = diaryEntries,
//             Count = diaryEntries.Count,
//             StudentId = childId,
//             StudentName = studentName,
//             ClassName = className,
//             SectionName = sectionName,
//             GeneratedAt = DateTime.Now
//         };

//         return Ok(ApiResponse<DiaryResponseDto>.CreateSuccess(response));
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "Error fetching diary for child {ChildId}", childId);
//         return StatusCode(500, ApiResponse<DiaryResponseDto>.CreateError($"Error fetching diary: {ex.Message}"));
//     }
// }



// // GET: api/diary/teacher/classes
// [HttpGet("teacher/classes")]
// [Authorize(Roles = "Admin,Teacher,Manager")]
// public async Task<IActionResult> GetTeacherClassesForDiary()
// {
//     try
//     {
//         _logger.LogInformation("GetTeacherClassesForDiary called");

//         var userId = GetUserIdFromToken();
//         if (!userId.HasValue)
//         {
//             return Unauthorized(new { success = false, message = "Invalid token" });
//         }

//         // Get ALL active classes with ALL their sections (no filtering by teacher)
//         var allClassesWithSections = await _context.tbl_AddClass
//             .Where(c => c.Active == true)
//             .Select(c => new
//             {
//                 ClassId = c.Class_ID,
//                 ClassName = c.Class_Name ?? string.Empty,
//                 Sections = _context.tbl_AddSection
//                     .Where(s => s.Class_ID == c.Class_ID && s.Active == true)
//                     .Select(s => new
//                     {
//                         SectionId = s.ID,
//                         SectionName = s.Section ?? string.Empty,
//                         TotalStudents = _context.tbl_StudentRegistration
//                             .Count(st => st.Section_ID == s.ID && 
//                                         (st.cur_Status == null || st.cur_Status == "A"))
//                     })
//                     .OrderBy(s => s.SectionName)
//                     .ToList()
//             })
//             .Where(c => c.Sections.Any())
//             .OrderBy(c => c.ClassName)
//             .ToListAsync();

//         _logger.LogInformation($"Returning {allClassesWithSections.Count} classes");

//         // Log sections for debugging
//         foreach (var cls in allClassesWithSections)
//         {
//             _logger.LogInformation($"Class {cls.ClassName} has {cls.Sections.Count} sections");
//             foreach (var sec in cls.Sections)
//             {
//                 _logger.LogInformation($"  - Section: {sec.SectionName} (ID: {sec.SectionId})");
//             }
//         }

//         return Ok(new { success = true, data = allClassesWithSections });
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "Error in GetTeacherClassesForDiary");
//         return StatusCode(500, new { success = false, message = ex.Message });
//     }
// }
//         // GET: api/diary/class/{classId}/subjects
//         [HttpGet("class/{classId}/subjects")]
//         [Authorize(Roles = "Admin,Teacher,Manager")]
//         public async Task<IActionResult> GetSubjectsByClass(int classId, [FromQuery] int? sectionId = null)
//         {
//             try
//             {
//                 var userId = GetUserIdFromToken();
//                 if (!userId.HasValue)
//                 {
//                     return Unauthorized(new { success = false, message = "Invalid token" });
//                 }

//                 // Get teacher's employee code
//                 var user = await _context.tbl_User
//                     .FirstOrDefaultAsync(u => u.ID == userId.Value);

//                 if (user == null || !user.EmployeeCode.HasValue)
//                 {
//                     return BadRequest(new { success = false, message = "Teacher employee code not found" });
//                 }

//                 var query = _context.tbl_EmployeeSubject
//                     .Where(es => es.Employee_Code == user.EmployeeCode.Value && es.Class_ID == classId)
//                     .Include(es => es.Subject)
//                     .AsQueryable();

//                 if (sectionId.HasValue && sectionId.Value > 0)
//                 {
//                     query = query.Where(es => es.Section_ID == sectionId.Value);
//                 }

//                 var subjects = await query
//                     .Select(es => new
//                     {
//                         SubjectId = es.Subject_Id,
//                         SubjectName = es.Subject != null ? es.Subject.Subject_Name : string.Empty,
//                         SubjectCode = es.Subject != null ? es.Subject.SubjectCode : string.Empty,
//                         ColorCode = es.Subject != null ? es.Subject.ColorCode : "#2196F3"
//                     })
//                     .Distinct()
//                     .ToListAsync();

//                 return Ok(new { success = true, data = subjects });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error getting subjects");
//                 return StatusCode(500, new { success = false, message = ex.Message });
//             }
//         }

//         // GET: api/diary/check
//         [HttpGet("check")]
//         [Authorize(Roles = "Admin,Teacher,Manager")]
//         public async Task<IActionResult> CheckDiaryExists(
//             [FromQuery] int classId,
//             [FromQuery] int sectionId,
//             [FromQuery] int subjectId,
//             [FromQuery] string date)
//         {
//             try
//             {
//                 if (!DateOnly.TryParse(date, out var diaryDate))
//                 {
//                     return BadRequest(new { success = false, message = "Invalid date format" });
//                 }

//                 var exists = await _context.tbl_ClassDiary
//                     .AnyAsync(d => d.ClassID == classId && 
//                                    d.SectionID == sectionId && 
//                                    d.SubjectID == subjectId && 
//                                    d.Date == diaryDate);

//                 return Ok(new { success = true, exists = exists });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error checking diary exists");
//                 return StatusCode(500, new { success = false, message = ex.Message });
//             }
//         }

//         // GET: api/diary/entry
//         [HttpGet("entry")]
//         [Authorize(Roles = "Admin,Teacher,Manager")]
//         public async Task<IActionResult> GetDiaryEntry(
//             [FromQuery] int classId,
//             [FromQuery] int sectionId,
//             [FromQuery] int subjectId,
//             [FromQuery] string date)
//         {
//             try
//             {
//                 if (!DateOnly.TryParse(date, out var diaryDate))
//                 {
//                     return BadRequest(new { success = false, message = "Invalid date format" });
//                 }

//                 var entry = await _context.tbl_ClassDiary
//                     .FirstOrDefaultAsync(d => d.ClassID == classId && 
//                                               d.SectionID == sectionId && 
//                                               d.SubjectID == subjectId && 
//                                               d.Date == diaryDate);

//                 if (entry == null)
//                 {
//                     return Ok(new { success = true, exists = false, data = (object)null });
//                 }

//                 return Ok(new { 
//                     success = true, 
//                     exists = true, 
//                     data = new
//                     {
//                         entry.dairyID,
//                         entry.Date,
//                         entry.ClassID,
//                         entry.SectionID,
//                         entry.SubjectID,
//                         entry.ClassWork,
//                         entry.HomeWork,
//                         entry.isPublished,
//                         entry.CreatedBy,
//                         entry.CreatedDT
//                     }
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error getting diary entry");
//                 return StatusCode(500, new { success = false, message = ex.Message });
//             }
//         }

//         // POST: api/diary
//         [HttpPost]
//         [Authorize(Roles = "Admin,Teacher,Manager")]
//         public async Task<IActionResult> CreateOrUpdateDiary([FromBody] CreateDiaryDto model)
//         {
//             try
//             {
//                 _logger.LogInformation($"Creating/Updating diary for Class:{model.ClassID}, Section:{model.SectionID}, Subject:{model.SubjectID}, Date:{model.Date}");

//                 // Check if diary already exists
//                 var existingDiary = await _context.tbl_ClassDiary
//                     .FirstOrDefaultAsync(d => d.Date == model.Date &&
//                                                d.ClassID == model.ClassID &&
//                                                d.SectionID == model.SectionID &&
//                                                d.SubjectID == model.SubjectID);

//                 if (existingDiary != null)
//                 {
//                     // Update existing diary
//                     existingDiary.HomeWork = model.HomeWork;
//                     existingDiary.ClassWork = model.ClassWork;
//                     existingDiary.ModifyBy = model.CreatedBy;
//                     existingDiary.ModifyDT = DateTime.Now;
//                     existingDiary.isPublished = model.isPublished;

//                     await _context.SaveChangesAsync();
//                     _logger.LogInformation($"Updated diary entry ID: {existingDiary.dairyID}");

//                     return Ok(new { 
//                         success = true, 
//                         message = "Diary updated successfully",
//                         data = new { existingDiary.dairyID, existingDiary.isPublished }
//                     });
//                 }
//                 else
//                 {
//                     // Create new diary
//                     var newDiary = new tbl_ClassDiary
//                     {
//                         Date = model.Date,
//                         ClassID = model.ClassID,
//                         SectionID = model.SectionID,
//                         SubjectID = model.SubjectID,
//                         ClassWork = model.ClassWork,
//                         HomeWork = model.HomeWork,
//                         CreatedBy = model.CreatedBy,
//                         CreatedDT = DateTime.Now,
//                         ModifyBy = null,
//                         ModifyDT = null,
//                         isPublished = model.isPublished,
//                         ApprovedBy = null,
//                         ApprovedDT = null
//                     };

//                     _context.tbl_ClassDiary.Add(newDiary);
//                     await _context.SaveChangesAsync();
//                     _logger.LogInformation($"Created new diary entry ID: {newDiary.dairyID}");

//                     return Ok(new { 
//                         success = true, 
//                         message = "Diary created successfully",
//                         data = new { newDiary.dairyID, newDiary.isPublished }
//                     });
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error creating/updating diary");
//                 return StatusCode(500, new { success = false, message = $"Error saving diary: {ex.Message}" });
//             }
//         }





//        // GET: api/diary/class/{classId}/subjects-from-classwise
// [HttpGet("class/{classId}/subjects-from-classwise")]
// [Authorize(Roles = "Admin,Teacher,Manager")]
// public async Task<IActionResult> GetSubjectsFromClassWise(int classId)
// {
//     try
//     {
//         _logger.LogInformation($"Getting subjects for class {classId} from tbl_ClassWiseSubject");

//         var subjects = await _context.tbl_ClassWiseSubject
//             .Where(cws => cws.ClassID == classId && (cws.Active == null || cws.Active == true))
//             .Include(cws => cws.Subject)
//             .Select(cws => new
//             {
//                 SubjectId = cws.SubjectID ?? 0,
//                 SubjectName = cws.Subject != null ? cws.Subject.Subject_Name : string.Empty,
//                 SubjectCode = cws.Subject != null ? cws.Subject.SubjectCode : string.Empty,
//                 ColorCode = cws.Subject != null ? cws.Subject.ColorCode : "#2196F3",
//                 IsActive = cws.Active
//             })
//             .Distinct()
//             .OrderBy(s => s.SubjectName)
//             .ToListAsync();

//         if (!subjects.Any())
//         {
//             _logger.LogWarning($"No subjects found for class {classId}");
//         }

//         return Ok(new { success = true, data = subjects });
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "Error getting subjects from ClassWiseSubject");
//         return StatusCode(500, new { success = false, message = ex.Message });
//     }
// }

//         // POST: api/diary/batch
//         [HttpPost("batch")]
//         [Authorize(Roles = "Admin,Teacher,Manager")]
//         public async Task<IActionResult> CreateBatchDiary([FromBody] BatchCreateDiaryDto model)
//         {
//             try
//             {
//                 _logger.LogInformation($"Creating batch diary for Class:{model.ClassID}, Sections:{string.Join(",", model.SectionIds)}, Subject:{model.SubjectID}");

//                 var results = new List<object>();
//                 var updateCount = 0;
//                 var createCount = 0;

//                 foreach (var sectionId in model.SectionIds)
//                 {
//                     // Check if diary already exists
//                     var existingDiary = await _context.tbl_ClassDiary
//                         .FirstOrDefaultAsync(d => d.Date == model.Date &&
//                                                    d.ClassID == model.ClassID &&
//                                                    d.SectionID == sectionId &&
//                                                    d.SubjectID == model.SubjectID);

//                     if (existingDiary != null)
//                     {
//                         // Update existing
//                         existingDiary.HomeWork = model.HomeWork;
//                         existingDiary.ClassWork = model.ClassWork;
//                         existingDiary.ModifyBy = model.CreatedBy;
//                         existingDiary.ModifyDT = DateTime.Now;
//                         existingDiary.isPublished = model.isPublished;
//                         updateCount++;
//                         results.Add(new { sectionId, action = "updated", id = existingDiary.dairyID });
//                     }
//                     else
//                     {
//                         // Create new
//                         var newDiary = new tbl_ClassDiary
//                         {
//                             Date = model.Date,
//                             ClassID = model.ClassID,
//                             SectionID = sectionId,
//                             SubjectID = model.SubjectID,
//                             ClassWork = model.ClassWork,
//                             HomeWork = model.HomeWork,
//                             CreatedBy = model.CreatedBy,
//                             CreatedDT = DateTime.Now,
//                             ModifyBy = null,
//                             ModifyDT = null,
//                             isPublished = model.isPublished,
//                             ApprovedBy = null,
//                             ApprovedDT = null
//                         };
//                         _context.tbl_ClassDiary.Add(newDiary);
//                         createCount++;
//                         results.Add(new { sectionId, action = "created", id = newDiary.dairyID });
//                     }
//                 }

//                 await _context.SaveChangesAsync();
//                 _logger.LogInformation($"Batch diary completed: {createCount} created, {updateCount} updated");

//                 return Ok(new { 
//                     success = true, 
//                     message = $"Diary saved for {model.SectionIds.Count} section(s)",
//                     data = new { 
//                         created = createCount, 
//                         updated = updateCount, 
//                         total = model.SectionIds.Count,
//                         details = results
//                     }
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error creating batch diary");
//                 return StatusCode(500, new { success = false, message = $"Error saving batch diary: {ex.Message}" });
//             }
//         }







// // GET: api/diary/teacher/entries
// [HttpGet("teacher/entries")]
// [Authorize(Roles = "Admin,Teacher,Manager")]
// public async Task<IActionResult> GetTeacherDiaries(
//     [FromQuery] int? classId,
//     [FromQuery] string? sectionIds,
//     [FromQuery] int? subjectId,
//     [FromQuery] string? dateFrom,
//     [FromQuery] string? dateTo,
//     [FromQuery] int page = 1,
//     [FromQuery] int limit = 20)
// {
//     try
//     {
//         _logger.LogInformation("GetTeacherDiaries called");

//         var userId = GetUserIdFromToken();
//         if (!userId.HasValue)
//         {
//             return Unauthorized(new { success = false, message = "Invalid token" });
//         }

//         // Get teacher's user info
//         var user = await _context.tbl_User
//             .FirstOrDefaultAsync(u => u.ID == userId.Value);

//         if (user == null)
//         {
//             return BadRequest(new { success = false, message = "User not found" });
//         }

//         // Build query for diaries created by this teacher
//         var query = _context.tbl_ClassDiary
//             .Where(d => d.CreatedBy == userId.Value)
//             .AsQueryable();

//         // Apply filters
//         if (classId.HasValue && classId.Value > 0)
//         {
//             query = query.Where(d => d.ClassID == classId.Value);
//         }

//         // Parse sectionIds from comma-separated string
//         if (!string.IsNullOrEmpty(sectionIds))
//         {
//             var sectionIdList = sectionIds.Split(',').Select(int.Parse).ToList();
//             if (sectionIdList.Any())
//             {
//                 query = query.Where(d => sectionIdList.Contains(d.SectionID ?? 0));
//             }
//         }

//         if (subjectId.HasValue && subjectId.Value > 0)
//         {
//             query = query.Where(d => d.SubjectID == subjectId.Value);
//         }

//         if (!string.IsNullOrEmpty(dateFrom))
//         {
//             if (DateOnly.TryParse(dateFrom, out var fromDate))
//             {
//                 query = query.Where(d => d.Date >= fromDate);
//             }
//         }

//         if (!string.IsNullOrEmpty(dateTo))
//         {
//             if (DateOnly.TryParse(dateTo, out var toDate))
//             {
//                 query = query.Where(d => d.Date <= toDate);
//             }
//         }

//         // Get total count for pagination
//         var totalCount = await query.CountAsync();

//         // Get paginated entries with joins to get class, section, subject names
//         var entries = await query
//             .OrderByDescending(d => d.Date)
//             .ThenByDescending(d => d.CreatedDT)
//             .Skip((page - 1) * limit)
//             .Take(limit)
//             .Select(d => new
//             {
//                 d.dairyID,
//                 d.Date,
//                 d.ClassID,
//                 d.SectionID,
//                 d.SubjectID,
//                 d.HomeWork,
//                 d.ClassWork,
//                 d.isPublished,
//                 d.CreatedBy,
//                 d.CreatedDT,
//                 ClassName = _context.tbl_AddClass
//                     .Where(c => c.Class_ID == d.ClassID)
//                     .Select(c => c.Class_Name)
//                     .FirstOrDefault() ?? "",
//                 SectionName = _context.tbl_AddSection
//                     .Where(s => s.ID == d.SectionID)
//                     .Select(s => s.Section)
//                     .FirstOrDefault() ?? "",
//                 SubjectName = _context.tbl_Subject
//                     .Where(s => s.Subject_Id == d.SubjectID)
//                     .Select(s => s.Subject_Name)
//                     .FirstOrDefault() ?? "",
//                 // Get all section names for this class (if multiple sections are saved separately)
//                 // For listing, we'll group by class and subject later
//             })
//             .ToListAsync();

//         // Group entries by class, subject, date to show combined sections
//         var groupedEntries = entries
//             .GroupBy(e => new { e.Date, e.ClassID, e.SubjectID })
//             .Select(g => new
//             {
//                 id = g.First().dairyID,
//                 date = g.Key.Date.HasValue ? g.Key.Date.Value.ToString("yyyy-MM-dd") : "",
//                 classId = g.Key.ClassID,
//                 className = g.First().ClassName,
//                 subjectId = g.Key.SubjectID,
//                 subjectName = g.First().SubjectName,
//                 sectionIds = g.Select(e => e.SectionID).ToList(),
//                 sectionNames = g.Select(e => e.SectionName).Where(s => !string.IsNullOrEmpty(s)).ToList(),
//                 content = g.First().HomeWork ?? "",
//                 isPublished = g.First().isPublished ?? false,
//                 createdAt = g.First().CreatedDT
//             })
//             .OrderByDescending(e => e.date)
//             .ToList();

//         var response = new
//         {
//             success = true,
//             data = new
//             {
//                 entries = groupedEntries,
//                 count = groupedEntries.Count,
//                 total = totalCount,
//                 page = page,
//                 limit = limit,
//                 totalPages = (int)Math.Ceiling(totalCount / (double)limit)
//             }
//         };

//         return Ok(response);
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "Error in GetTeacherDiaries");
//         return StatusCode(500, new { success = false, message = ex.Message });
//     }
// }




//         #region Helper Methods

//         private int? GetUserIdFromToken()
//         {
//             try
//             {
//                 var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//                 if (int.TryParse(userIdClaim, out int userId))
//                 {
//                     return userId;
//                 }
//                 return null;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error getting user ID from token");
//                 return null;
//             }
//         }

//         #endregion
//     }

//     #region DTO Classes

//     public class DiaryEntryDto
// {
//     public long Id { get; set; }
//     public string Date { get; set; } = "";
//     public string Content { get; set; } = "";
//     public string Subject { get; set; } = "";
//     public int? SubjectId { get; set; }
//     public string Teacher { get; set; } = "";
//     public int? TeacherId { get; set; }
//     public int? ClassId { get; set; }
//      public string ClassName { get; set; } = "";    
//     public int? SectionId { get; set; }
//      public string SectionName { get; set; } = ""; 
//     public bool IsPublished { get; set; }
//     public DateTime? CreatedAt { get; set; }
// }

//     public class DiaryResponseDto
// {
//     public List<DiaryEntryDto> Entries { get; set; } = new();
//     public int Count { get; set; }
//     public int StudentId { get; set; }
//     public string StudentName { get; set; } = "";
//     public string ClassName { get; set; } = "";
//     public string SectionName { get; set; } = "";
//     public DateTime GeneratedAt { get; set; }
// }

//     public class CreateDiaryDto
//     {
//         public DateOnly Date { get; set; }
//         public int ClassID { get; set; }
//         public int SectionID { get; set; }
//         public int SubjectID { get; set; }
//         public string? ClassWork { get; set; }
//         public string HomeWork { get; set; } = string.Empty;
//         public int CreatedBy { get; set; }
//         public bool isPublished { get; set; } = false;
//     }

//     public class BatchCreateDiaryDto
//     {
//         public DateOnly Date { get; set; }
//         public int ClassID { get; set; }
//         public List<int> SectionIds { get; set; } = new List<int>();
//         public int SubjectID { get; set; }
//         public string? ClassWork { get; set; }
//         public string HomeWork { get; set; } = string.Empty;
//         public int CreatedBy { get; set; }
//         public bool isPublished { get; set; } = false;
//     }

//     public class DiaryFilters
//     {
//         public string? Date { get; set; }
//         public int? Month { get; set; }
//         public int? Year { get; set; }
//         public int? SubjectId { get; set; }
//     }

//     #endregion
// }

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using school_management_Backend.DTOs;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Data.SqlClient;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DiaryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DiaryController> _logger;
        private readonly IConfiguration _configuration;

        public DiaryController(ApplicationDbContext context, ILogger<DiaryController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet("child/{childId}")]
        public async Task<ActionResult<ApiResponse<DiaryResponseDto>>> GetChildDiary(
            int childId,
            [FromQuery] DiaryFilters filters)
        {
            try
            {
                _logger.LogInformation($"Fetching diary for child {childId}");

                // Get student info to get class and section
                var student = await _context.tbl_StudentRegistration
                    .Include(s => s.Class)
                    .Include(s => s.Section)
                    .FirstOrDefaultAsync(s => s.Reg_Id == childId);

                if (student == null)
                {
                    return NotFound(ApiResponse<DiaryResponseDto>.CreateError("Student not found"));
                }

                // Get class and section names
                string className = student.Class?.Class_Name ?? "N/A";
                string sectionName = student.Section?.Section ?? "N/A";
                // Fix: Use correct property name (adjust based on your actual column names)
                string studentName = !string.IsNullOrEmpty(student.Frist_Name) ? student.Frist_Name : "NA";

                // Get diary entries from tbl_ClassDiary for student's class and section
                var query = from diary in _context.tbl_ClassDiary
                            join subject in _context.tbl_Subject
                                on diary.SubjectID equals subject.Subject_Id into subjectJoin
                            from subject in subjectJoin.DefaultIfEmpty()
                            join user in _context.tbl_User
                                on diary.CreatedBy equals user.ID into userJoin
                            from user in userJoin.DefaultIfEmpty()
                            where diary.ClassID == student.Class_ID &&
                                  diary.SectionID == student.Section_ID &&
                                  diary.HomeWork != null &&
                                  diary.HomeWork != "" &&
                                  (diary.isPublished == null || diary.isPublished == true)
                            select new
                            {
                                Diary = diary,
                                Subject = subject,
                                Teacher = user
                            };

                // Apply date filters
                if (!string.IsNullOrEmpty(filters.Date))
                {
                    if (DateOnly.TryParse(filters.Date, out var date))
                    {
                        query = query.Where(x => x.Diary.Date == date);
                    }
                }

                // Apply month/year filters
                if (filters.Month.HasValue && filters.Year.HasValue)
                {
                    query = query.Where(x => x.Diary.Date.HasValue &&
                                             x.Diary.Date.Value.Month == filters.Month.Value &&
                                             x.Diary.Date.Value.Year == filters.Year.Value);
                }

                // Apply subject filter
                if (filters.SubjectId.HasValue)
                {
                    query = query.Where(x => x.Diary.SubjectID == filters.SubjectId.Value);
                }

                var diaryEntries = await query
                    .OrderByDescending(x => x.Diary.Date)
                    .Select(x => new DiaryEntryDto
                    {
                        Id = x.Diary.dairyID,
                        Date = x.Diary.Date.HasValue ? x.Diary.Date.Value.ToString("yyyy-MM-dd") : "",
                        Content = x.Diary.HomeWork ?? "",
                        Subject = x.Subject != null ? x.Subject.Subject_Name : "General",
                        SubjectId = x.Diary.SubjectID,
                        Teacher = x.Teacher != null ? x.Teacher.UserName : "Teacher",
                        TeacherId = x.Diary.CreatedBy,
                        ClassId = x.Diary.ClassID,
                        ClassName = className,
                        SectionId = x.Diary.SectionID,
                        SectionName = sectionName,
                        IsPublished = x.Diary.isPublished ?? false,
                        CreatedAt = x.Diary.CreatedDT
                    })
                    .ToListAsync();

                var response = new DiaryResponseDto
                {
                    Entries = diaryEntries,
                    Count = diaryEntries.Count,
                    StudentId = childId,
                    StudentName = studentName,
                    ClassName = className,
                    SectionName = sectionName,
                    GeneratedAt = DateTime.Now
                };

                return Ok(ApiResponse<DiaryResponseDto>.CreateSuccess(response));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching diary for child {ChildId}", childId);
                return StatusCode(500, ApiResponse<DiaryResponseDto>.CreateError($"Error fetching diary: {ex.Message}"));
            }
        }

        // GET: api/diary/teacher/classes
        [HttpGet("teacher/classes")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetTeacherClassesForDiary()
        {
            try
            {
                _logger.LogInformation("GetTeacherClassesForDiary called");

                var userId = GetUserIdFromToken();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { success = false, message = "Invalid token" });
                }

                // Get ALL active classes with ALL their sections (no filtering by teacher)
                var allClassesWithSections = await _context.tbl_AddClass
                    .Where(c => c.Active == true)
                    .Select(c => new
                    {
                        ClassId = c.Class_ID,
                        ClassName = c.Class_Name ?? string.Empty,
                        Sections = _context.tbl_AddSection
                            .Where(s => s.Class_ID == c.Class_ID && s.Active == true)
                            .Select(s => new
                            {
                                SectionId = s.ID,
                                SectionName = s.Section ?? string.Empty,
                                TotalStudents = _context.tbl_StudentRegistration
                                    .Count(st => st.Section_ID == s.ID &&
                                                (st.cur_Status == null || st.cur_Status == "A"))
                            })
                            .OrderBy(s => s.SectionName)
                            .ToList()
                    })
                    .Where(c => c.Sections.Any())
                    .OrderBy(c => c.ClassName)
                    .ToListAsync();

                _logger.LogInformation($"Returning {allClassesWithSections.Count} classes");

                return Ok(new { success = true, data = allClassesWithSections });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTeacherClassesForDiary");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/diary/class/{classId}/subjects
        [HttpGet("class/{classId}/subjects")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetSubjectsByClass(int classId, [FromQuery] int? sectionId = null)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { success = false, message = "Invalid token" });
                }

                // Get teacher's employee code
                var user = await _context.tbl_User
                    .FirstOrDefaultAsync(u => u.ID == userId.Value);

                if (user == null || !user.EmployeeCode.HasValue)
                {
                    return BadRequest(new { success = false, message = "Teacher employee code not found" });
                }

                var query = _context.tbl_EmployeeSubject
                    .Where(es => es.Employee_Code == user.EmployeeCode.Value && es.Class_ID == classId)
                    .Include(es => es.Subject)
                    .AsQueryable();

                if (sectionId.HasValue && sectionId.Value > 0)
                {
                    query = query.Where(es => es.Section_ID == sectionId.Value);
                }

                var subjects = await query
                    .Select(es => new
                    {
                        SubjectId = es.Subject_Id,
                        SubjectName = es.Subject != null ? es.Subject.Subject_Name : string.Empty,
                        SubjectCode = es.Subject != null ? es.Subject.SubjectCode : string.Empty,
                        ColorCode = es.Subject != null ? es.Subject.ColorCode : "#2196F3"
                    })
                    .Distinct()
                    .ToListAsync();

                return Ok(new { success = true, data = subjects });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting subjects");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/diary/check
        [HttpGet("check")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> CheckDiaryExists(
            [FromQuery] int classId,
            [FromQuery] int sectionId,
            [FromQuery] int subjectId,
            [FromQuery] string date)
        {
            try
            {
                if (!DateOnly.TryParse(date, out var diaryDate))
                {
                    return BadRequest(new { success = false, message = "Invalid date format" });
                }

                var exists = await _context.tbl_ClassDiary
                    .AnyAsync(d => d.ClassID == classId &&
                                   d.SectionID == sectionId &&
                                   d.SubjectID == subjectId &&
                                   d.Date == diaryDate);

                return Ok(new { success = true, exists = exists });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking diary exists");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/diary/entry
        [HttpGet("entry")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetDiaryEntry(
            [FromQuery] int classId,
            [FromQuery] int sectionId,
            [FromQuery] int subjectId,
            [FromQuery] string date)
        {
            try
            {
                if (!DateOnly.TryParse(date, out var diaryDate))
                {
                    return BadRequest(new { success = false, message = "Invalid date format" });
                }

                var entry = await _context.tbl_ClassDiary
                    .FirstOrDefaultAsync(d => d.ClassID == classId &&
                                              d.SectionID == sectionId &&
                                              d.SubjectID == subjectId &&
                                              d.Date == diaryDate);

                if (entry == null)
                {
                    return Ok(new { success = true, exists = false, data = (object)null });
                }

                return Ok(new
                {
                    success = true,
                    exists = true,
                    data = new
                    {
                        entry.dairyID,
                        entry.Date,
                        entry.ClassID,
                        entry.SectionID,
                        entry.SubjectID,
                        entry.ClassWork,
                        entry.HomeWork,
                        entry.isPublished,
                        entry.CreatedBy,
                        entry.CreatedDT
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting diary entry");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/diary
        [HttpPost]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> CreateOrUpdateDiary([FromBody] CreateDiaryDto model)
        {
            try
            {
                _logger.LogInformation($"Creating/Updating diary for Class:{model.ClassID}, Section:{model.SectionID}, Subject:{model.SubjectID}, Date:{model.Date}");

                // Check if diary already exists
                var existingDiary = await _context.tbl_ClassDiary
                    .FirstOrDefaultAsync(d => d.Date == model.Date &&
                                               d.ClassID == model.ClassID &&
                                               d.SectionID == model.SectionID &&
                                               d.SubjectID == model.SubjectID);

                if (existingDiary != null)
                {
                    // Update existing diary
                    existingDiary.HomeWork = model.HomeWork;
                    existingDiary.ClassWork = model.ClassWork;
                    existingDiary.ModifyBy = model.CreatedBy;
                    existingDiary.ModifyDT = DateTime.Now;
                    existingDiary.isPublished = model.isPublished;

                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Updated diary entry ID: {existingDiary.dairyID}");

                    return Ok(new
                    {
                        success = true,
                        message = "Diary updated successfully",
                        data = new { existingDiary.dairyID, existingDiary.isPublished }
                    });
                }
                else
                {
                    // Create new diary
                    var newDiary = new tbl_ClassDiary
                    {
                        Date = model.Date,
                        ClassID = model.ClassID,
                        SectionID = model.SectionID,
                        SubjectID = model.SubjectID,
                        ClassWork = model.ClassWork,
                        HomeWork = model.HomeWork,
                        CreatedBy = model.CreatedBy,
                        CreatedDT = DateTime.Now,
                        ModifyBy = null,
                        ModifyDT = null,
                        isPublished = model.isPublished,
                        ApprovedBy = null,
                        ApprovedDT = null
                    };

                    _context.tbl_ClassDiary.Add(newDiary);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Created new diary entry ID: {newDiary.dairyID}");

                    return Ok(new
                    {
                        success = true,
                        message = "Diary created successfully",
                        data = new { newDiary.dairyID, newDiary.isPublished }
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating/updating diary");
                return StatusCode(500, new { success = false, message = $"Error saving diary: {ex.Message}" });
            }
        }

        // GET: api/diary/class/{classId}/subjects-from-classwise
        [HttpGet("class/{classId}/subjects-from-classwise")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetSubjectsFromClassWise(int classId)
        {
            try
            {
                _logger.LogInformation($"Getting subjects for class {classId} from tbl_ClassWiseSubject");

                var subjects = await _context.tbl_ClassWiseSubject
                    .Where(cws => cws.ClassID == classId && (cws.Active == null || cws.Active == true))
                    .Include(cws => cws.Subject)
                    .Select(cws => new
                    {
                        SubjectId = cws.SubjectID ?? 0,
                        SubjectName = cws.Subject != null ? cws.Subject.Subject_Name : string.Empty,
                        SubjectCode = cws.Subject != null ? cws.Subject.SubjectCode : string.Empty,
                        ColorCode = cws.Subject != null ? cws.Subject.ColorCode : "#2196F3",
                        IsActive = cws.Active
                    })
                    .Distinct()
                    .OrderBy(s => s.SubjectName)
                    .ToListAsync();

                if (!subjects.Any())
                {
                    _logger.LogWarning($"No subjects found for class {classId}");
                }

                return Ok(new { success = true, data = subjects });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting subjects from ClassWiseSubject");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/diary/batch
        [HttpPost("batch")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> CreateBatchDiary([FromBody] BatchCreateDiaryDto model)
        {
            try
            {
                _logger.LogInformation($"Creating batch diary for Class:{model.ClassID}, Sections:{string.Join(",", model.SectionIds)}, Subject:{model.SubjectID}");

                var results = new List<object>();
                var updateCount = 0;
                var createCount = 0;

                foreach (var sectionId in model.SectionIds)
                {
                    // Check if diary already exists
                    var existingDiary = await _context.tbl_ClassDiary
                        .FirstOrDefaultAsync(d => d.Date == model.Date &&
                                                   d.ClassID == model.ClassID &&
                                                   d.SectionID == sectionId &&
                                                   d.SubjectID == model.SubjectID);

                    if (existingDiary != null)
                    {
                        // Update existing
                        existingDiary.HomeWork = model.HomeWork;
                        existingDiary.ClassWork = model.ClassWork;
                        existingDiary.ModifyBy = model.CreatedBy;
                        existingDiary.ModifyDT = DateTime.Now;
                        existingDiary.isPublished = model.isPublished;
                        updateCount++;
                        results.Add(new { sectionId, action = "updated", id = existingDiary.dairyID });
                    }
                    else
                    {
                        // Create new
                        var newDiary = new tbl_ClassDiary
                        {
                            Date = model.Date,
                            ClassID = model.ClassID,
                            SectionID = sectionId,
                            SubjectID = model.SubjectID,
                            ClassWork = model.ClassWork,
                            HomeWork = model.HomeWork,
                            CreatedBy = model.CreatedBy,
                            CreatedDT = DateTime.Now,
                            ModifyBy = null,
                            ModifyDT = null,
                            isPublished = model.isPublished,
                            ApprovedBy = null,
                            ApprovedDT = null
                        };
                        _context.tbl_ClassDiary.Add(newDiary);
                        createCount++;
                        results.Add(new { sectionId, action = "created", id = newDiary.dairyID });
                    }
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Batch diary completed: {createCount} created, {updateCount} updated");

                return Ok(new
                {
                    success = true,
                    message = $"Diary saved for {model.SectionIds.Count} section(s)",
                    data = new
                    {
                        created = createCount,
                        updated = updateCount,
                        total = model.SectionIds.Count,
                        details = results
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating batch diary");
                return StatusCode(500, new { success = false, message = $"Error saving batch diary: {ex.Message}" });
            }
        }

        // GET: api/diary/teacher/entries
        [HttpGet("teacher/entries")]
        [Authorize(Roles = "Admin,Teacher,Manager")]
        public async Task<IActionResult> GetTeacherDiaries(
            [FromQuery] int? classId,
            [FromQuery] string? sectionIds,
            [FromQuery] int? subjectId,
            [FromQuery] string? dateFrom,
            [FromQuery] string? dateTo,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20)
        {
            try
            {
                _logger.LogInformation("GetTeacherDiaries called");

                var userId = GetUserIdFromToken();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { success = false, message = "Invalid token" });
                }

                // Get teacher's user info
                var user = await _context.tbl_User
                    .FirstOrDefaultAsync(u => u.ID == userId.Value);

                if (user == null)
                {
                    return BadRequest(new { success = false, message = "User not found" });
                }

                // Build query for diaries created by this teacher
                var query = _context.tbl_ClassDiary
                    .Where(d => d.CreatedBy == userId.Value)
                    .AsQueryable();

                // Apply filters
                if (classId.HasValue && classId.Value > 0)
                {
                    query = query.Where(d => d.ClassID == classId.Value);
                }

                // Parse sectionIds from comma-separated string
                if (!string.IsNullOrEmpty(sectionIds))
                {
                    var sectionIdList = sectionIds.Split(',').Select(int.Parse).ToList();
                    if (sectionIdList.Any())
                    {
                        query = query.Where(d => sectionIdList.Contains(d.SectionID ?? 0));
                    }
                }

                if (subjectId.HasValue && subjectId.Value > 0)
                {
                    query = query.Where(d => d.SubjectID == subjectId.Value);
                }

                if (!string.IsNullOrEmpty(dateFrom))
                {
                    if (DateOnly.TryParse(dateFrom, out var fromDate))
                    {
                        query = query.Where(d => d.Date >= fromDate);
                    }
                }

                if (!string.IsNullOrEmpty(dateTo))
                {
                    if (DateOnly.TryParse(dateTo, out var toDate))
                    {
                        query = query.Where(d => d.Date <= toDate);
                    }
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Get paginated entries with joins to get class, section, subject names
                var entries = await query
                    .OrderByDescending(d => d.Date)
                    .ThenByDescending(d => d.CreatedDT)
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .Select(d => new
                    {
                        d.dairyID,
                        d.Date,
                        d.ClassID,
                        d.SectionID,
                        d.SubjectID,
                        d.HomeWork,
                        d.ClassWork,
                        d.isPublished,
                        d.CreatedBy,
                        d.CreatedDT,
                        ClassName = _context.tbl_AddClass
                            .Where(c => c.Class_ID == d.ClassID)
                            .Select(c => c.Class_Name)
                            .FirstOrDefault() ?? "",
                        SectionName = _context.tbl_AddSection
                            .Where(s => s.ID == d.SectionID)
                            .Select(s => s.Section)
                            .FirstOrDefault() ?? "",
                        SubjectName = _context.tbl_Subject
                            .Where(s => s.Subject_Id == d.SubjectID)
                            .Select(s => s.Subject_Name)
                            .FirstOrDefault() ?? "",
                    })
                    .ToListAsync();

                // Group entries by class, subject, date to show combined sections
                var groupedEntries = entries
                    .GroupBy(e => new { e.Date, e.ClassID, e.SubjectID })
                    .Select(g => new
                    {
                        id = g.First().dairyID,
                        date = g.Key.Date.HasValue ? g.Key.Date.Value.ToString("yyyy-MM-dd") : "",
                        classId = g.Key.ClassID,
                        className = g.First().ClassName,
                        subjectId = g.Key.SubjectID,
                        subjectName = g.First().SubjectName,
                        sectionIds = g.Select(e => e.SectionID).ToList(),
                        sectionNames = g.Select(e => e.SectionName).Where(s => !string.IsNullOrEmpty(s)).ToList(),
                        content = g.First().HomeWork ?? "",
                        isPublished = g.First().isPublished ?? false,
                        createdAt = g.First().CreatedDT
                    })
                    .OrderByDescending(e => e.date)
                    .ToList();

                var response = new
                {
                    success = true,
                    data = new
                    {
                        entries = groupedEntries,
                        count = groupedEntries.Count,
                        total = totalCount,
                        page = page,
                        limit = limit,
                        totalPages = (int)Math.Ceiling(totalCount / (double)limit)
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTeacherDiaries");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== NEW ENDPOINTS ADDED ====================

        // GET: api/diary/class-work
        [HttpGet("class-work")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<ActionResult<ApiResponse<List<ClassWorkResponse>>>> GetClassWork(
            [FromQuery] int classId,
            [FromQuery] int sectionId,
            [FromQuery] string lessonDate)
        {
            try
            {
                _logger.LogInformation($"Getting class work for ClassID: {classId}, SectionID: {sectionId}, Date: {lessonDate}");

                var result = new List<ClassWorkResponse>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    using (var command = new SqlCommand("sp_PrintClassWork", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ClassID", classId);
                        command.Parameters.AddWithValue("@SectionID", sectionId);
                        command.Parameters.AddWithValue("@LessonDate", lessonDate);

                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new ClassWorkResponse
                                {
                                    SubjectID = reader["SubjectID"] != DBNull.Value ? Convert.ToInt32(reader["SubjectID"]) : 0,
                                    Subject_Name = reader["Subject_Name"]?.ToString(),
                                    Book = reader["Book"]?.ToString(),
                                    ChapterName = reader["ChapterName"]?.ToString(),
                                    TopicName = reader["TopicName"]?.ToString(),
                                    cw_PageNoTextBook = reader["cw_PageNoTextBook"]?.ToString(),
                                    cw_PageNoActivityBook = reader["cw_PageNoActivityBook"]?.ToString(),
                                    cw_ActivityBook = reader["cw_ActivityBook"]?.ToString(),
                                    cw_TextBook = reader["cw_TextBook"]?.ToString(),
                                    cw_Resources = reader["cw_Resources"]?.ToString(),
                                    hw_PageNoTextBook = reader["hw_PageNoTextBook"]?.ToString(),
                                    hw_TextBook = reader["hw_TextBook"]?.ToString(),
                                    hw_PageNoActivityBook = reader["hw_PageNoActivityBook"]?.ToString(),
                                    hw_ActivityBook = reader["hw_ActivityBook"]?.ToString(),
                                    hw_CopyWork = reader["hw_CopyWork"]?.ToString(),
                                    hw_Observation = reader["hw_Observation"]?.ToString(),
                                    hw_Extra = reader["hw_Extra"]?.ToString(),
                                    Class_Name = reader["Class_Name"]?.ToString()
                                };
                                result.Add(item);
                            }
                        }
                    }
                }

                return Ok(ApiResponse<List<ClassWorkResponse>>.CreateSuccess(result));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting class work");
                return StatusCode(500, ApiResponse<List<ClassWorkResponse>>.CreateError($"Error: {ex.Message}"));
            }
        }

        // // GET: api/diary/scheme-of-work
        // [HttpGet("scheme-of-work")]
        // [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        // public async Task<ActionResult<ApiResponse<List<SchemeOfWorkResponse>>>> GetSchemeOfWork(
        //     [FromQuery] int classId,
        //     [FromQuery] int sectionId,
        //     [FromQuery] string month,
        //     [FromQuery] int year)
        // {
        //     try
        //     {
        //         _logger.LogInformation($"Getting scheme of work for ClassID: {classId}, SectionID: {sectionId}, Month: {month}, Year: {year}");

        //         var result = new List<SchemeOfWorkResponse>();

        //         using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
        //         {
        //             using (var command = new SqlCommand("sp_rptSchemeOfWorkForMonth", connection))
        //             {
        //                 command.CommandType = CommandType.StoredProcedure;
        //                 command.Parameters.AddWithValue("@Month", month);
        //                 command.Parameters.AddWithValue("@Year", year);
        //                 command.Parameters.AddWithValue("@ClassID", classId);
        //                 command.Parameters.AddWithValue("@SectionID", sectionId);
        //                 command.Parameters.AddWithValue("@SubjectIDs", DBNull.Value);

        //                 await connection.OpenAsync();

        //                 using (var reader = await command.ExecuteReaderAsync())
        //                 {
        //                     while (await reader.ReadAsync())
        //                     {
        //                         var item = new SchemeOfWorkResponse
        //                         {
        //                             SubjectID = reader["SubjectID"] != DBNull.Value ? Convert.ToInt32(reader["SubjectID"]) : 0,
        //                             Subject_Name = reader["Subject_Name"]?.ToString(),
        //                             UnitNo = reader["UnitNo"]?.ToString(),
        //                             NoOfDays = reader["NoOfDays"]?.ToString(),
        //                             BookID = reader["BookID"] != DBNull.Value ? Convert.ToInt32(reader["BookID"]) : (int?)null,
        //                             Book = reader["Book"]?.ToString(),
        //                             ChapterID = reader["ChapterID"] != DBNull.Value ? Convert.ToInt32(reader["ChapterID"]) : (int?)null,
        //                             ChapterName = reader["ChapterName"]?.ToString(),
        //                             PageNo = reader["PageNo"]?.ToString(),
        //                             GrammerComposition = reader["GrammerComposition"]?.ToString(),
        //                             Topics = reader["Topics"]?.ToString(),
        //                             ThemeOfMonth = reader["ThemeOfMonth"]?.ToString(),
        //                             Class_Name = reader["Class_Name"]?.ToString(),
        //                             CampusName = reader["CampusName"]?.ToString()
        //                         };

        //                         Console.WriteLine($"Read scheme of work item: SubjectID={item.SubjectID}, Subject_Name={item.Subject_Name}, Class_Name={item.Class_Name}");
        //                         result.Add(item);
        //                     }
        //                 }
        //             }
        //         }

        //         return Ok(ApiResponse<List<SchemeOfWorkResponse>>.CreateSuccess(result));
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error getting scheme of work");
        //         return StatusCode(500, ApiResponse<List<SchemeOfWorkResponse>>.CreateError($"Error: {ex.Message}"));
        //     }
        // }


        // GET: api/diary/scheme-of-work
        [HttpGet("scheme-of-work")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<ActionResult<ApiResponse<List<SchemeOfWorkResponse>>>> GetSchemeOfWork(
            [FromQuery] int classId,
            [FromQuery] int sectionId,
            [FromQuery] string month,
            [FromQuery] int year)
        {
            try
            {
                _logger.LogInformation($"Getting scheme of work for ClassID: {classId}, SectionID: {sectionId}, Month: {month}, Year: {year}");

                var result = new List<SchemeOfWorkResponse>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    using (var command = new SqlCommand("sp_rptSchemeOfWorkForMonth", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Month", month);
                        command.Parameters.AddWithValue("@Year", year);
                        command.Parameters.AddWithValue("@ClassID", classId);
                        command.Parameters.AddWithValue("@SectionID", sectionId);
                        command.Parameters.Add("@SubjectIDs", SqlDbType.VarChar).Value = "";

                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new SchemeOfWorkResponse
                                {
                                    SubjectID = reader["SubjectID"] != DBNull.Value ? Convert.ToInt32(reader["SubjectID"]) : 0,
                                    Subject_Name = reader["Subject_Name"]?.ToString() ?? "",
                                    UnitNo = reader["UnitNo"]?.ToString() ?? "",
                                    NoOfDays = reader["NoOfDays"]?.ToString() ?? "",
                                    BookID = reader["BookID"] != DBNull.Value ? Convert.ToInt32(reader["BookID"]) : (int?)null,
                                    Book = reader["Book"]?.ToString() ?? "",
                                    ChapterID = reader["ChapterID"] != DBNull.Value ? Convert.ToInt32(reader["ChapterID"]) : (int?)null,
                                    ChapterName = reader["ChapterName"]?.ToString() ?? "",
                                    PageNo = reader["PageNo"]?.ToString() ?? "",
                                    GrammerComposition = reader["GrammerComposition"]?.ToString() ?? "",
                                    Topics = reader["Topics"]?.ToString() ?? "",
                                    ThemeOfMonth = reader["ThemeOfMonth"]?.ToString() ?? "",
                                    Class_Name = reader["Class_Name"]?.ToString() ?? "",
                                    CampusName = reader["CampusName"]?.ToString() ?? ""
                                };
                                result.Add(item);
                            }
                        }
                    }
                }

                _logger.LogInformation($"Retrieved {result.Count} scheme of work entries");

                // Log the data for debugging
                foreach (var item in result)
                {
                    _logger.LogInformation($"SOW Item - Subject: {item.Subject_Name}, Unit: {item.UnitNo}, Theme: {item.ThemeOfMonth}");
                }

                return Ok(ApiResponse<List<SchemeOfWorkResponse>>.CreateSuccess(result));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting scheme of work");
                return StatusCode(500, ApiResponse<List<SchemeOfWorkResponse>>.CreateError($"Error: {ex.Message}"));
            }
        }




      


        #region Helper Methods

        private int? GetUserIdFromToken()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdClaim, out int userId))
                {
                    return userId;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user ID from token");
                return null;
            }
        }

        #endregion
    }

    #region DTO Classes

    public class DiaryEntryDto
    {
        public long Id { get; set; }
        public string Date { get; set; } = "";
        public string Content { get; set; } = "";
        public string Subject { get; set; } = "";
        public int? SubjectId { get; set; }
        public string Teacher { get; set; } = "";
        public int? TeacherId { get; set; }
        public int? ClassId { get; set; }
        public string ClassName { get; set; } = "";
        public int? SectionId { get; set; }
        public string SectionName { get; set; } = "";
        public bool IsPublished { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class DiaryResponseDto
    {
        public List<DiaryEntryDto> Entries { get; set; } = new();
        public int Count { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = "";
        public string ClassName { get; set; } = "";
        public string SectionName { get; set; } = "";
        public DateTime GeneratedAt { get; set; }
    }

    public class CreateDiaryDto
    {
        public DateOnly Date { get; set; }
        public int ClassID { get; set; }
        public int SectionID { get; set; }
        public int SubjectID { get; set; }
        public string? ClassWork { get; set; }
        public string HomeWork { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public bool isPublished { get; set; } = false;
    }

    public class BatchCreateDiaryDto
    {
        public DateOnly Date { get; set; }
        public int ClassID { get; set; }
        public List<int> SectionIds { get; set; } = new List<int>();
        public int SubjectID { get; set; }
        public string? ClassWork { get; set; }
        public string HomeWork { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public bool isPublished { get; set; } = false;
    }



      public class DiaryFilters
    {
        public string? Date { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public int? SubjectId { get; set; }
    }

    // ==================== NEW DTO CLASSES ADDED ====================

    public class ClassWorkResponse
    {
        public int SubjectID { get; set; }
        public string Subject_Name { get; set; } = "";
        public string Book { get; set; } = "";
        public string ChapterName { get; set; } = "";
        public string TopicName { get; set; } = "";
        public string cw_PageNoTextBook { get; set; } = "";
        public string cw_PageNoActivityBook { get; set; } = "";
        public string cw_ActivityBook { get; set; } = "";
        public string cw_TextBook { get; set; } = "";
        public string cw_Resources { get; set; } = "";
        public string hw_PageNoTextBook { get; set; } = "";
        public string hw_TextBook { get; set; } = "";
        public string hw_PageNoActivityBook { get; set; } = "";
        public string hw_ActivityBook { get; set; } = "";
        public string hw_CopyWork { get; set; } = "";
        public string hw_Observation { get; set; } = "";
        public string hw_Extra { get; set; } = "";
        public string Class_Name { get; set; } = "";
    }

    public class SchemeOfWorkResponse
    {
        public int SubjectID { get; set; }
        public string Subject_Name { get; set; } = "";
        public string UnitNo { get; set; } = "";
        public string NoOfDays { get; set; } = "";
        public int? BookID { get; set; }
        public string Book { get; set; } = "";
        public int? ChapterID { get; set; }
        public string ChapterName { get; set; } = "";
        public string PageNo { get; set; } = "";
        public string GrammerComposition { get; set; } = "";
        public string Topics { get; set; } = "";
        public string ThemeOfMonth { get; set; } = "";
        public string Class_Name { get; set; } = "";
        public string CampusName { get; set; } = "";
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public T Data { get; set; }

        public static ApiResponse<T> CreateSuccess(T data, string message = "")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> CreateError(string message)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Data = default(T)
            };
        }
    }

    #endregion
}