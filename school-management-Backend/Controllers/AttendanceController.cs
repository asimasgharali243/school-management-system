
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using school_management_Backend.DTOs;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AttendanceController> _logger;

        public AttendanceController(ApplicationDbContext context, ILogger<AttendanceController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/attendance/child/{childId}/stats
        [HttpGet("child/{childId}/stats")]
        public async Task<ActionResult<ApiResponse<AttendanceStatsDto>>> GetChildAttendanceStats(
            int childId,
            [FromQuery] AttendanceStatsFilters filters)
        {
            try
            {
                _logger.LogInformation($"Fetching attendance stats for child ID: {childId}");
                
                // Get student
                var student = await _context.tbl_StudentRegistration
                    .FirstOrDefaultAsync(s => s.Reg_Id == childId);

                if (student == null)
                {
                    return NotFound(ApiResponse<AttendanceStatsDto>.CreateError("Student not found"));
                }

                // Get attendance for the student
                var query = from detail in _context.tbl_StudentAttDetail
                            join master in _context.tbl_StudentAttMaster on detail.MasterId equals master.ID
                            where detail.RegID == childId && master.AttDate.HasValue
                            select new { detail, master };

                // Apply filters
                if (filters.DateFrom.HasValue)
                {
                    var dateFrom = DateOnly.FromDateTime(filters.DateFrom.Value);
                    query = query.Where(x => x.master.AttDate >= dateFrom);
                }

                if (filters.DateTo.HasValue)
                {
                    var dateTo = DateOnly.FromDateTime(filters.DateTo.Value);
                    query = query.Where(x => x.master.AttDate <= dateTo);
                }

                if (filters.Month.HasValue && filters.Year.HasValue)
                {
                    query = query.Where(x => x.master.AttDate.HasValue && 
                                             x.master.AttDate.Value.Month == filters.Month.Value && 
                                             x.master.AttDate.Value.Year == filters.Year.Value);
                }

                var attendanceRecords = await query.ToListAsync();
                var totalDays = attendanceRecords.Count;

                // Calculate stats
                var presentDays = attendanceRecords.Count(d => d.detail.Status == "P");
                var absentDays = attendanceRecords.Count(d => d.detail.Status == "A");
                var lateDays = attendanceRecords.Count(d => d.detail.LateStatus == "Late");
                var leaveDays = attendanceRecords.Count(d => d.detail.Status == "L");
                
                var presentPercentage = totalDays > 0 ? Math.Round((presentDays / (double)totalDays) * 100, 1) : 0;

                var stats = new AttendanceStatsDto
                {
                    TotalDays = totalDays,
                    PresentDays = presentDays,
                    AbsentDays = absentDays,
                    LateDays = lateDays,
                    LeaveDays = leaveDays,
                    PresentPercentage = presentPercentage,
                    AttendanceRate = presentPercentage
                };

                _logger.LogInformation($"Attendance stats calculated for child {childId}: Present {presentDays}/{totalDays}");
                
                return Ok(ApiResponse<AttendanceStatsDto>.CreateSuccess(stats));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching attendance stats for child {childId}: {ex.Message}");
                return StatusCode(500, ApiResponse<AttendanceStatsDto>.CreateError($"Error fetching attendance stats: {ex.Message}"));
            }
        }

        // GET: api/attendance/child/{childId}/history
        [HttpGet("child/{childId}/history")]
        public async Task<ActionResult<ApiResponse<AttendanceHistoryDto>>> GetChildAttendanceHistory(
            int childId,
            [FromQuery] AttendanceHistoryFilters filters)
        {
            try
            {
                _logger.LogInformation($"Fetching attendance history for child ID: {childId}");
                
                // Get student
                var student = await _context.tbl_StudentRegistration
                    .FirstOrDefaultAsync(s => s.Reg_Id == childId);

                if (student == null)
                {
                    return NotFound(ApiResponse<AttendanceHistoryDto>.CreateError("Student not found"));
                }

                // Get attendance history for the student - FIXED: No method calls in Select
                var query = from detail in _context.tbl_StudentAttDetail
                            join master in _context.tbl_StudentAttMaster on detail.MasterId equals master.ID
                            where detail.RegID == childId && master.AttDate.HasValue
                            select new 
                            { 
                                Date = master.AttDate.Value,
                                Status = detail.Status,
                                LateStatus = detail.LateStatus,
                                Remarks = detail.Remarks,
                                CheckInTime = master.CreatedDT
                            };

                // Apply filters - FIXED: Handle null status
                if (!string.IsNullOrEmpty(filters.Status) && filters.Status != "all")
                {
                    var statusCode = GetStatusCode(filters.Status);
                    if (!string.IsNullOrEmpty(statusCode))
                    {
                        query = query.Where(x => x.Status == statusCode);
                    }
                }

                if (filters.DateFrom.HasValue)
                {
                    var dateFrom = DateOnly.FromDateTime(filters.DateFrom.Value);
                    query = query.Where(x => x.Date >= dateFrom);
                }

                if (filters.DateTo.HasValue)
                {
                    var dateTo = DateOnly.FromDateTime(filters.DateTo.Value);
                    query = query.Where(x => x.Date <= dateTo);
                }

                if (filters.Month.HasValue && filters.Year.HasValue)
                {
                    query = query.Where(x => x.Date.Month == filters.Month.Value && 
                                             x.Date.Year == filters.Year.Value);
                }

                // Get raw data first
                var rawRecords = await query
                    .OrderByDescending(x => x.Date)
                    .ToListAsync();

                // Convert to DTO after getting data (client-side)
                // FIXED: Use AttendanceHistoryRecordDto instead of AttendanceRecordDto1
                var attendanceRecords = new List<AttendanceHistoryRecordDto>();
                
                foreach (var record in rawRecords)
                {
                    attendanceRecords.Add(new AttendanceHistoryRecordDto
                    {
                        Date = record.Date.ToString("yyyy-MM-dd"),
                        Status = GetStatusText(record.Status), // Now this is safe - called after ToListAsync()
                        LateStatus = record.LateStatus,
                        Remarks = record.Remarks,
                        CheckInTime = record.CheckInTime
                    });
                }

                var response = new AttendanceHistoryDto
                {
                    History = attendanceRecords,
                    Count = attendanceRecords.Count,
                    StudentId = childId,
                    GeneratedAt = DateTime.Now
                };

                _logger.LogInformation($"Retrieved {attendanceRecords.Count} attendance records for child {childId}");
                
                return Ok(ApiResponse<AttendanceHistoryDto>.CreateSuccess(response));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching attendance history for child {childId}: {ex.Message}");
                return StatusCode(500, ApiResponse<AttendanceHistoryDto>.CreateError($"Error fetching attendance history: {ex.Message}"));
            }
        }


[HttpGet("children")]
public async Task<ActionResult<ApiResponse<List<StudentDto>>>> GetParentChildren()
{
    try
    {
        _logger.LogInformation("Getting children for parent");

        var userId = GetUserIdFromToken();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<List<StudentDto>>.CreateError("Invalid token"));

        var user = await _context.tbl_User
            .FirstOrDefaultAsync(u => u.ID == userId.Value && u.Status == true);

        if (user == null)
            return NotFound(ApiResponse<List<StudentDto>>.CreateError("User not found"));

        if (user.RoleID != 4)
            return BadRequest(ApiResponse<List<StudentDto>>.CreateError("User is not a parent"));

        if (!user.FamilyID.HasValue)
            return Ok(ApiResponse<List<StudentDto>>.CreateSuccess(new List<StudentDto>(), "No children found"));

        // ==============================
        // 1. GET CHILDREN
        // ==============================
        var children = await _context.tbl_StudentRegistration
            .Where(s => s.Family_Code == user.FamilyID && s.cur_Status == "A")
            .Include(s => s.Class)
            .Include(s => s.Section)
            .Include(s => s.Campus)
            .Select(s => new StudentDto
            {
                Reg_Id = s.Reg_Id,
                Reg_No = s.Reg_No,
                Name = s.Frist_Name ?? "",
                Image = s.Image ?? "",
                Gender = s.Gender ?? "",
                Class_ID = s.Class_ID,
                ClassName = s.Class.Class_Name,
                Section_ID = s.Section_ID,
                SectionName = s.Section.Section,
                RollNo = s.RollNo.HasValue ? s.RollNo.Value.ToString() : "",
                Family_Code = s.Family_Code,
                CampusName = s.Campus.CampusName,
                Status = s.cur_Status,
                DiaryAccess = 0
            })
            .ToListAsync();

        var regIds = children.Select(x => x.Reg_Id).ToList();
        var now = DateTime.Now;

        // ==============================
        // 2. TEMPORARY ACCESS (FAST)
        // ==============================
        var tempAccessIds = await _context.tbl_DiaryAccessControl
            .Where(x =>
                regIds.Contains(x.RegID) &&
                x.IsActive &&
                now >= x.AllowFrom &&
                now <= x.AllowTo
            )
            .Select(x => x.RegID)
            .Distinct()
            .ToListAsync();

        // ==============================
        // 3. UNPAID FEE CHECK (CORRECT LOGIC)
        // ==============================
        var unpaidIds = await (
            from p in _context.tbl_FeePosting
            where regIds.Contains((int)p.Reg_ID)

            where !_context.tbl_FeeReceiveMaster
                .Where(m => m.RegID == p.Reg_ID)
                .Join(_context.tbl_FeeReceiveDetail,
                    m => m.Receipt_ID,
                    d => d.Receipt_ID,
                    (m, d) => new { m, d })
                .Any(x =>
                    x.d.FeeMonth == p.FeeMonth &&
                    x.d.FeeYear == p.FeeYear
                )

            select p.Reg_ID
        )
        .Distinct()
        .ToListAsync();

        // ==============================
        // 4. APPLY BUSINESS LOGIC (NO DB CALLS)
        // ==============================
        foreach (var child in children)
        {
            bool hasUnpaid = unpaidIds.Contains(child.Reg_Id);
            bool hasTempAccess = tempAccessIds.Contains(child.Reg_Id);

            // FINAL RULE
         child.DiaryAccess = hasTempAccess ? 1 : (hasUnpaid ? 0 : 1);
        }

        _logger.LogInformation($"Found {children.Count} children");

        return Ok(ApiResponse<List<StudentDto>>.CreateSuccess(
            children,
            "Children retrieved successfully"
        ));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting children");
        return StatusCode(500,
            ApiResponse<List<StudentDto>>.CreateError(ex.Message));
    }
}
private int? GetUserIdFromToken()
{
    try
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
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

        // FIXED: Make these methods static to avoid EF Core translation issues
        private static string GetStatusText(string statusCode)
        {
            if (string.IsNullOrEmpty(statusCode))
                return "unknown";
            
            return statusCode.ToUpper() switch
            {
                "P" => "present",
                "A" => "absent",
                "L" => "leave",
                _ => "unknown"
            };
        }

        private static string GetStatusCode(string statusText)
        {
            if (string.IsNullOrEmpty(statusText))
                return "P";
            
            return statusText.ToLower() switch
            {
                "present" => "P",
                "absent" => "A",
                "leave" => "L",
                _ => "P" // Default to present
            };
        }
    }

    // DTO Classes for Attendance
    public class AttendanceStatsDto
    {
        public int TotalDays { get; set; }
        public int PresentDays { get; set; }
        public int AbsentDays { get; set; }
        public int LateDays { get; set; }
        public int LeaveDays { get; set; }
        public double PresentPercentage { get; set; }
        public double AttendanceRate { get; set; }
    }

    // FIXED: This is the correct DTO class that AttendanceHistoryDto expects
    public class AttendanceHistoryRecordDto
    {
        public string Date { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? LateStatus { get; set; }
        public string? Remarks { get; set; }
        public DateTime? CheckInTime { get; set; }
    }

    public class AttendanceHistoryDto
    {
        public List<AttendanceHistoryRecordDto> History { get; set; } = new List<AttendanceHistoryRecordDto>();
        public int Count { get; set; }
        public int StudentId { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    public class AttendanceStatsFilters
    {
        public int? Month { get; set; }
        public int? Year { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }

    public class AttendanceHistoryFilters
    {
        public int? Month { get; set; }
        public int? Year { get; set; }
        public string? Status { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}