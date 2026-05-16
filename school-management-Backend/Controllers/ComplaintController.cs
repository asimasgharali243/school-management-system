// Controllers/ComplaintController.cs
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
using System.Collections.Generic;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ComplaintController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ComplaintController> _logger;

        public ComplaintController(ApplicationDbContext context, ILogger<ComplaintController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Complaint/categories
        [HttpGet("categories")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<IActionResult> GetComplaintCategories()
        {
            try
            {
                _logger.LogInformation("Getting complaint categories");

                var categories = await _context.tbl_ComplaintCategory
                    .Where(c => c.Active == true || c.Active == null)
                    .OrderBy(c => c.Title)
                    .Select(c => new ComplaintCategoryDto
                    {
                        Id = c.ID,
                        Title = c.Title,
                        Active = c.Active
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = categories });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaint categories");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Complaint/student/{studentId}
        [HttpGet("student/{studentId}")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<IActionResult> GetComplaintsByStudent(int studentId)
        {
            try
            {
                _logger.LogInformation($"Getting complaints for student: {studentId}");

                var complaints = await _context.tbl_Complaint
                    .Include(c => c.Student)
                    .Include(c => c.Category)
                    .Where(c => c.Reg_Id == studentId)
                    .OrderByDescending(c => c.ComplainDate)
                    .Select(c => new ComplaintResponseDto
                    {
                        ComplainID = c.ComplainID,
                        ComplainNo = c.ComplainNo,
                        Reg_Id = c.Reg_Id,
                        StudentName = c.Student != null ? c.Student.Frist_Name : "",
                        StudentClass = c.Student != null && c.Student.Class != null ? c.Student.Class.Class_Name : "",
                        StudentSection = c.Student != null && c.Student.Section != null ? c.Student.Section.Section : "",
                        ComplainCategory = c.ComplainCategory,
                        CategoryName = c.Category != null ? c.Category.Title : "",
                        ComplaintSubject = c.ComplaintSubject,
                        ComplainDetails = c.ComplainDetails,
                        ComplaintantName = c.ComplaintantName,
                        ComplaintantNumber = c.ComplaintantNumber,
                        ComplainDate = c.ComplainDate.HasValue
    ? c.ComplainDate.Value.ToDateTime(TimeOnly.MinValue)
    : (DateTime?)null,
                        Status = c.Status,
                        Priority = c.Priority,
                        CreatedDT = c.CreatedDT,
                        CreatedByName = _context.tbl_User.Where(u => u.ID == c.CreatedBy).Select(u => u.UserName).FirstOrDefault()
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = complaints });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaints by student");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Complaint/parent/{parentId}
        [HttpGet("parent/{parentId}")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<IActionResult> GetComplaintsByParent(int parentId)
        {
            try
            {
                _logger.LogInformation($"Getting complaints for parent: {parentId}");

                // Get parent's family code
                var parent = await _context.tbl_User
                    .FirstOrDefaultAsync(u => u.ID == parentId);

                if (parent == null || !parent.FamilyID.HasValue)
                {
                    return Ok(new { success = true, data = new List<ComplaintResponseDto>() });
                }

                // Get all students under this family
                var students = await _context.tbl_StudentRegistration
                    .Where(s => s.Family_Code == parent.FamilyID)
                    .Select(s => s.Reg_Id)
                    .ToListAsync();

                var complaints = await _context.tbl_Complaint
                    .Include(c => c.Student)
                    .Include(c => c.Category)
                    .Where(c => students.Contains(c.Reg_Id ?? 0))
                    .OrderByDescending(c => c.ComplainDate)
                    .Select(c => new ComplaintResponseDto
                    {
                        ComplainID = c.ComplainID,
                        ComplainNo = c.ComplainNo,
                        Reg_Id = c.Reg_Id,
                        StudentName = c.Student != null ? c.Student.Frist_Name : "",
                        StudentClass = c.Student != null && c.Student.Class != null ? c.Student.Class.Class_Name : "",
                        StudentSection = c.Student != null && c.Student.Section != null ? c.Student.Section.Section : "",
                        ComplainCategory = c.ComplainCategory,
                        CategoryName = c.Category != null ? c.Category.Title : "",
                        ComplaintSubject = c.ComplaintSubject,
                        ComplainDetails = c.ComplainDetails,
                        ComplaintantName = c.ComplaintantName,
                        ComplaintantNumber = c.ComplaintantNumber,
                        ComplainDate = c.ComplainDate.HasValue
    ? c.ComplainDate.Value.ToDateTime(TimeOnly.MinValue)
    : (DateTime?)null,
                        Status = c.Status,
                        Priority = c.Priority,
                        CreatedDT = c.CreatedDT
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = complaints });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaints by parent");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/Complaint/create
        [HttpPost("create")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<IActionResult> CreateComplaint([FromBody] CreateComplaintDto model)
        {
            try
            {
                _logger.LogInformation($"Creating complaint for student: {model.Reg_Id}");

                // Get next complaint number
                var lastComplaint = await _context.tbl_Complaint
                    .OrderByDescending(c => c.ComplainNo)
                    .FirstOrDefaultAsync();

                int nextComplaintNo = (lastComplaint?.ComplainNo ?? 0) + 1;

                var complaint = new tbl_Complaint
                {
                    ComplainNo = nextComplaintNo,
                    Reg_Id = model.Reg_Id,
                    ComplainCategory = model.ComplainCategory,
                    ComplaintSubject = model.ComplaintSubject,
                    ComplainDetails = model.ComplainDetails,
                    ComplaintantName = model.ComplaintantName,
                    ComplaintantNumber = model.ComplaintantNumber,
                    ComplainDate =DateOnly.FromDateTime(DateTime.Now),
                    Status = "Pending",
                    Priority = model.Priority ?? "Medium",
                    CampusID = model.CampusID,
                    SessionYear = model.SessionYear ?? DateTime.Now.Year,
                    CreatedBy = model.CreatedBy,
                    CreatedDT = DateTime.Now
                };

                _context.tbl_Complaint.Add(complaint);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Complaint created with ID: {complaint.ComplainID}, No: {complaint.ComplainNo}");

                return Ok(new { success = true, message = "Complaint submitted successfully", data = complaint });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating complaint");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // PUT: api/Complaint/update-status
        [HttpPut("update-status")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateComplaintStatus([FromBody] UpdateComplaintStatusDto model)
        {
            try
            {
                var complaint = await _context.tbl_Complaint
                    .FirstOrDefaultAsync(c => c.ComplainID == model.ComplainID);

                if (complaint == null)
                {
                    return NotFound(new { success = false, message = "Complaint not found" });
                }

                complaint.Status = model.Status;
                complaint.ModifyBy = model.ModifyBy;
                complaint.ModifyDT = DateTime.Now;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Complaint {model.ComplainID} status updated to {model.Status}");

                return Ok(new { success = true, message = "Status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating complaint status");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/Complaint/{complaintId}
        [HttpGet("{complaintId}")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<IActionResult> GetComplaintById(long complaintId)
        {
            try
            {
                var complaint = await _context.tbl_Complaint
                    .Include(c => c.Student)
                    .Include(c => c.Category)
                    .Where(c => c.ComplainID == complaintId)
                    .Select(c => new ComplaintResponseDto
                    {
                        ComplainID = c.ComplainID,
                        ComplainNo = c.ComplainNo,
                        Reg_Id = c.Reg_Id,
                        StudentName = c.Student != null ? c.Student.Frist_Name : "",
                        ComplainCategory = c.ComplainCategory,
                        CategoryName = c.Category != null ? c.Category.Title : "",
                        ComplaintSubject = c.ComplaintSubject,
                        ComplainDetails = c.ComplainDetails,
                        ComplaintantName = c.ComplaintantName,
                        ComplaintantNumber = c.ComplaintantNumber,
                        ComplainDate =c.ComplainDate.HasValue
    ? c.ComplainDate.Value.ToDateTime(TimeOnly.MinValue)
    : (DateTime?)null,
                        Status = c.Status,
                        Priority = c.Priority,
                        CreatedDT = c.CreatedDT
                    })
                    .FirstOrDefaultAsync();

                if (complaint == null)
                {
                    return NotFound(new { success = false, message = "Complaint not found" });
                }

                return Ok(new { success = true, data = complaint });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaint by ID");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}