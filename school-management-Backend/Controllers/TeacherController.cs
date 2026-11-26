using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Models;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TeacherController : BaseApiController
    {
        private readonly ILogger<TeacherController> _logger;

        public TeacherController(ILogger<TeacherController> logger)
        {
            _logger = logger;
        }

        // GET: api/Teacher/Classes
        [HttpGet("Classes")]
        public async Task<ActionResult> GetTeacherClasses()
        {
            try
            {
                _logger.LogInformation("GetTeacherClasses endpoint called");

                var allClaims = User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
                _logger.LogDebug("User claims: {Claims}", string.Join(", ", allClaims));

                var userId = GetUserIdFromToken();
                _logger.LogDebug("User ID from token: {UserId}", userId);

                if (!userId.HasValue)
                {
                    _logger.LogWarning("Unauthorized: No valid user ID found in token");
                    return Unauthorized(new { success = false, message = "Invalid or missing token" });
                }

                var user = await DbContext.tbl_User
                    .FirstOrDefaultAsync(u => u.ID == userId.Value);

                if (user == null)
                {
                    _logger.LogWarning("User not found in database: {UserId}", userId);
                    return Unauthorized(new { success = false, message = "User not found" });
                }

                _logger.LogDebug("User found: {UserName}, EmployeeCode: {EmployeeCode}",
                    user.UserName, user.EmployeeCode);

                if (user.EmployeeCode == null)
                {
                    _logger.LogWarning("User has no employee code: {UserId}", userId);
                    return BadRequest(new { success = false, message = "Teacher employee code not found" });
                }

                var teacherClasses = await DbContext.tbl_EmployeeSubject
                    .Where(es => es.Employee_Code == user.EmployeeCode)
                    .Include(es => es.Class)
                    .Include(es => es.Section)
                    .Include(es => es.Subject)
                    .Select(es => new TeacherClassDto
                    {
                        ClassId = es.Class_ID != null ? es.Class_ID.Value : 0,
                        ClassName = es.Class != null ? es.Class.Class_Name : string.Empty,
                        SectionId = es.Section_ID != null ? es.Section_ID.Value : 0,
                        SectionName = es.Section != null ? es.Section.Section : string.Empty,
                        SubjectId = es.Subject_Id,
                        SubjectName = es.Subject != null ? es.Subject.Subject_Name : string.Empty,
                        SubjectCode = es.Subject != null ? es.Subject.SubjectCode : string.Empty
                    })
                    .Distinct()
                    .ToListAsync();

                _logger.LogDebug("Found {Count} teacher classes through subjects", teacherClasses.Count);

                if (!teacherClasses.Any())
                {
                    var inchargeClasses = await (from section in DbContext.tbl_AddSection
                                                 join cls in DbContext.tbl_AddClass
                                                     on section.Class_ID equals cls.Class_ID into classJoin
                                                 from cls in classJoin.DefaultIfEmpty()
                                                 where section.Class_Incharg_ID == user.EmployeeCode ||
                                                       section.ClassInchargeID == user.EmployeeCode
                                                 select new TeacherClassDto
                                                 {
                                                     ClassId = section.Class_ID != null ? section.Class_ID.Value : 0,
                                                     ClassName = cls != null ? cls.Class_Name : string.Empty,
                                                     SectionId = section.ID,
                                                     SectionName = section.Section != null ? section.Section : string.Empty,
                                                     SubjectId = null,
                                                     SubjectName = "Class Incharge",
                                                     SubjectCode = "CLS_INC"
                                                 })
                                                .ToListAsync();

                    teacherClasses.AddRange(inchargeClasses);
                    _logger.LogDebug("Added {Count} incharge classes", inchargeClasses.Count);
                }

                _logger.LogInformation("Returning {Count} classes for teacher {UserId}", teacherClasses.Count, userId);
                return Ok(new
                {
                    success = true,
                    classes = teacherClasses,
                    count = teacherClasses.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTeacherClasses");
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    innerException = ex.InnerException != null ? ex.InnerException.Message : null
                });
            }
        }

        // GET: api/Teacher/ClassStudents/{classId}/{sectionId}
        [HttpGet("ClassStudents/{classId}/{sectionId}")]
        public async Task<ActionResult> GetClassStudents(int classId, int sectionId)
        {
            try
            {
                _logger.LogInformation("GetClassStudents called for ClassId: {ClassId}, SectionId: {SectionId}",
                    classId, sectionId);

                var userId = GetUserIdFromToken();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { success = false, message = "Invalid token" });
                }

                var students = await DbContext.tbl_StudentRegistration
                    .Where(s => s.Class_ID == classId &&
                                s.Section_ID == sectionId &&
                                (s.cur_Status == "A" || s.cur_Status == null))
                    .OrderBy(s => s.RollNo)
                    .Select(s => new StudentAttendanceDto
                    {
                        StudentId = s.Reg_Id,
                        RollNo = s.RollNo != null ? s.RollNo.Value.ToString() : "0",
                        Name = s.Frist_Name != null ? s.Frist_Name : string.Empty,
                        Image = s.Image != null ? s.Image : string.Empty,
                        Gender = s.Gender != null ? s.Gender : string.Empty,
                        Phone = s.Mobile1 != null ? s.Mobile1 : string.Empty,
                        FatherName = s.Father_Name != null ? s.Father_Name : string.Empty,
                        Status = s.cur_Status != null ? s.cur_Status : string.Empty
                    })
                    .ToListAsync();

                _logger.LogInformation("Found {Count} students for ClassId: {ClassId}, SectionId: {SectionId}",
                    students.Count, classId, sectionId);

                return Ok(new
                {
                    success = true,
                    students = students,
                    count = students.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClassStudents");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Teacher/TodayAttendance/{classId}/{sectionId}
        [HttpGet("TodayAttendance/{classId}/{sectionId}")]
        public async Task<ActionResult> GetTodayAttendance(int classId, int sectionId)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { success = false, message = "Invalid token" });
                }

                var today = DateOnly.FromDateTime(DateTime.Now);

                var attendanceMaster = await DbContext.tbl_StudentAttMaster
                    .Include(m => m.tbl_StudentAttDetail)
                    .FirstOrDefaultAsync(m =>
                        m.AttDate == today &&
                        m.ClassID == classId &&
                        m.SectionID == sectionId);

                if (attendanceMaster == null)
                {
                    return Ok(new
                    {
                        success = true,
                        attendanceTaken = false,
                        attendanceDate = today.ToString("yyyy-MM-dd"),
                        attendanceRecords = new List<object>()
                    });
                }

                var attendanceRecords = attendanceMaster.tbl_StudentAttDetail
                    .Select(d => new
                    {
                        StudentId = d.RegID,
                        Status = d.Status,
                        LateStatus = d.LateStatus,
                        Remarks = d.Remarks
                    })
                    .ToList();

                return Ok(new
                {
                    success = true,
                    attendanceTaken = true,
                    attendanceDate = attendanceMaster.AttDate != null ? attendanceMaster.AttDate.Value.ToString("yyyy-MM-dd") : string.Empty,
                    attendanceRecords = attendanceRecords
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTodayAttendance");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/Teacher/MarkAttendance - FIXED
        [HttpPost("MarkAttendance")]
        public async Task<ActionResult> MarkAttendance([FromBody] MarkAttendanceDto request)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { success = false, message = "Invalid token" });
                }

                // Get the execution strategy for retry support
                var strategy = DbContext.Database.CreateExecutionStrategy();

                return await strategy.ExecuteAsync(async () =>
                {
                    // Now use transaction inside the strategy
                    await using var transaction = await DbContext.Database.BeginTransactionAsync();
                    try
                    {
                        var today = DateOnly.FromDateTime(DateTime.Now);

                        // Check if attendance already exists for today
                        var existingAttendance = await DbContext.tbl_StudentAttMaster
                            .FirstOrDefaultAsync(m =>
                                m.AttDate == today &&
                                m.ClassID == request.ClassId &&
                                m.SectionID == request.SectionId);

                        // If exists, remove it (update mode)
                        if (existingAttendance != null)
                        {
                            var existingDetails = await DbContext.tbl_StudentAttDetail
                                .Where(d => d.MasterId == existingAttendance.ID)
                                .ToListAsync();

                            DbContext.tbl_StudentAttDetail.RemoveRange(existingDetails);
                            DbContext.tbl_StudentAttMaster.Remove(existingAttendance);
                            await DbContext.SaveChangesAsync();
                        }

                        // Create new attendance master
                        var attendanceMaster = new tbl_StudentAttMaster
                        {
                            AttDate = today,
                            Type = "Daily",
                            Remarks = request.Remarks,
                            CreatedBy = userId.Value,
                            CreatedDT = DateTime.Now,
                            CampusID = 1,
                            ClassID = request.ClassId,
                            SectionID = request.SectionId
                        };

                        await DbContext.tbl_StudentAttMaster.AddAsync(attendanceMaster);
                        await DbContext.SaveChangesAsync();

                        // Create attendance details
                        if (request.AttendanceRecords != null && request.AttendanceRecords.Any())
                        {
                            var attendanceDetails = request.AttendanceRecords.Select(student => new tbl_StudentAttDetail
                            {
                                MasterId = attendanceMaster.ID,
                                RegID = student.StudentId,
                                Status = student.Status,
                                LateStatus = student.LateStatus,
                                Remarks = student.Remarks,
                                Is_Manual = true,
                                SmsSend = false
                            }).ToList();

                            await DbContext.tbl_StudentAttDetail.AddRangeAsync(attendanceDetails);
                            await DbContext.SaveChangesAsync();
                        }

                        await transaction.CommitAsync();

                        _logger.LogInformation($"Attendance marked for {request.AttendanceRecords?.Count ?? 0} students in Class {request.ClassId}, Section {request.SectionId}");

                        return Ok(new
                        {
                            success = true,
                            message = "Attendance marked successfully",
                            attendanceId = attendanceMaster.ID,
                            count = request.AttendanceRecords?.Count ?? 0
                        });
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogError(ex, "Error in MarkAttendance transaction");
                        throw;
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in MarkAttendance");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Teacher/AttendanceHistory/{classId}/{sectionId}/{month}/{year}
        [HttpGet("AttendanceHistory/{classId}/{sectionId}/{month}/{year}")]
        public async Task<ActionResult> GetAttendanceHistory(int classId, int sectionId, int month, int year)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { success = false, message = "Invalid token" });
                }

                var attendanceHistory = await DbContext.tbl_StudentAttMaster
                    .Include(m => m.tbl_StudentAttDetail)
                    .Where(m => m.ClassID == classId &&
                                m.SectionID == sectionId &&
                                m.AttDate.HasValue &&
                                m.AttDate.Value.Month == month &&
                                m.AttDate.Value.Year == year)
                    .OrderBy(m => m.AttDate)
                    .Select(m => new
                    {
                        Date = m.AttDate.Value.ToString("yyyy-MM-dd"),
                        TotalStudents = m.tbl_StudentAttDetail.Count,
                        PresentCount = m.tbl_StudentAttDetail.Count(d => d.Status == "P"),
                        AbsentCount = m.tbl_StudentAttDetail.Count(d => d.Status == "A"),
                        LeaveCount = m.tbl_StudentAttDetail.Count(d => d.Status == "L"),
                        LateCount = m.tbl_StudentAttDetail.Count(d => d.LateStatus == "Late")
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    history = attendanceHistory,
                    month = month,
                    year = year
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAttendanceHistory");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        private int? GetUserIdFromToken()
        {
            try
            {
                _logger.LogDebug("GetUserIdFromToken called");

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    _logger.LogDebug("Found user ID claim: {ClaimType} = {ClaimValue}", userIdClaim.Type, userIdClaim.Value);
                    if (int.TryParse(userIdClaim.Value, out int userId))
                    {
                        _logger.LogDebug("Parsed user ID: {UserId}", userId);
                        return userId;
                    }
                    else
                    {
                        _logger.LogWarning("Could not parse user ID from claim value: {ClaimValue}", userIdClaim.Value);
                    }
                }
                else
                {
                    var allClaims = User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
                    _logger.LogWarning("No NameIdentifier claim found. Available claims: {Claims}",
                        string.Join(", ", allClaims));
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetUserIdFromToken");
                return null;
            }
        }
    }
}