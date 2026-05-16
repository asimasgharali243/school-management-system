using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using System.Text.Json;


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
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<StudentController> _logger;

  private readonly IConfiguration _configuration;

        public StudentController(ApplicationDbContext context, ILogger<StudentController> logger,IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        // GET: api/Student/byclass/{classId}
        [HttpGet("byclass/{classId}")]
        public async Task<IActionResult> GetStudentsByClass(int classId)
        {
            try
            {
                _logger.LogInformation($"========== GET STUDENTS BY CLASS {classId} ==========");
                
                var filteredStudents = await _context.tbl_StudentRegistration
                    .Where(s => s.Class_ID == classId)
                    .Where(s => s.cur_Status == null || s.cur_Status.Trim() == "A")
                    .Select(s => new
                    {
                        s.Reg_Id,
                        s.Frist_Name,
                        RollNo = s.RollNo != null ? s.RollNo.Value : 0,
                        s.Family_Code,
                        s.Class_ID,
                        s.Section_ID,
                        s.Gender,
                        s.Image
                    })
                    .OrderBy(s => s.RollNo)
                    .ToListAsync();

                // LOG THE RESPONSE BEFORE SENDING
                _logger.LogInformation($"📤 RESPONSE DATA COUNT: {filteredStudents.Count}");
                
                if (filteredStudents.Any())
                {
                    var firstStudent = filteredStudents.First();
                    _logger.LogInformation($"📤 FIRST STUDENT IN RESPONSE: Reg_Id={firstStudent.Reg_Id}, Name={firstStudent.Frist_Name}, RollNo={firstStudent.RollNo}");
                    
                    // Log all field names being sent
                    var properties = firstStudent.GetType().GetProperties();
                    _logger.LogInformation($"📤 FIELDS IN RESPONSE: {string.Join(", ", properties.Select(p => p.Name))}");
                    
                    // Log JSON representation of first student
                    var json = JsonSerializer.Serialize(firstStudent);
                    _logger.LogInformation($"📤 JSON RESPONSE (first student): {json}");
                }
                
                var response = new { Success = true, Data = filteredStudents };
                
                // Log the full response structure
                var fullJson = JsonSerializer.Serialize(response);
                _logger.LogInformation($"📤 FULL RESPONSE (first 500 chars): {fullJson.Substring(0, Math.Min(500, fullJson.Length))}");
                
                _logger.LogInformation($"========== RESPONSE SENT SUCCESSFULLY ==========");
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting students by class {classId}");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Student/bysection/{sectionId}
        [HttpGet("bysection/{sectionId}")]
        public async Task<IActionResult> GetStudentsBySection(int sectionId)
        {
            try
            {
                _logger.LogInformation($"========== GET STUDENTS BY SECTION {sectionId} ==========");
                
                var section = await _context.tbl_AddSection
                    .FirstOrDefaultAsync(s => s.ID == sectionId);
                
                if (section == null)
                {
                    _logger.LogWarning($"Section {sectionId} not found");
                    return Ok(new { Success = true, Data = new List<object>(), Message = "Section not found" });
                }
                
                _logger.LogInformation($"Section found: ID={section.ID}, Name={section.Section}, Class_ID={section.Class_ID}");
                
                // First, get raw data from database to check RollNo values
                var rawStudents = await _context.tbl_StudentRegistration
                    .Where(s => s.Section_ID == sectionId)
                    .Where(s => s.cur_Status == null || s.cur_Status.Trim() == "A")
                    .ToListAsync();
                
                _logger.LogInformation($"📊 RAW DATABASE DATA:");
                _logger.LogInformation($"   Total students: {rawStudents.Count}");
                _logger.LogInformation($"   Students with RollNo > 0: {rawStudents.Count(s => s.RollNo.HasValue && s.RollNo.Value > 0)}");
                
                if (rawStudents.Any())
                {
                    var firstRaw = rawStudents.First();
                    _logger.LogInformation($"   First raw student: Reg_Id={firstRaw.Reg_Id}, Name={firstRaw.Frist_Name}, RollNo={firstRaw.RollNo}");
                }
                
                // Now create the projected response
                var filteredStudents = rawStudents
                    .Select(s => new
                    {
                        s.Reg_Id,
                        s.Frist_Name,
                        RollNo = s.RollNo != null ? s.RollNo.Value : 0,
                        s.Family_Code,
                        s.Class_ID,
                        s.Section_ID,
                        s.Gender,
                        s.Image
                    })
                    .OrderBy(s => s.RollNo)
                    .ToList();

                // LOG THE RESPONSE BEFORE SENDING
                _logger.LogInformation($"📤 RESPONSE DATA COUNT: {filteredStudents.Count}");
                
                if (filteredStudents.Any())
                {
                    var firstStudent = filteredStudents.First();
                    _logger.LogInformation($"📤 FIRST STUDENT IN RESPONSE: Reg_Id={firstStudent.Reg_Id}, Name={firstStudent.Frist_Name}, RollNo={firstStudent.RollNo}");
                    
                    // Log all field names being sent
                    var properties = firstStudent.GetType().GetProperties();
                    _logger.LogInformation($"📤 FIELDS IN RESPONSE: {string.Join(", ", properties.Select(p => p.Name))}");
                    
                    // Log JSON representation of first student
                    var json = JsonSerializer.Serialize(firstStudent);
                    _logger.LogInformation($"📤 JSON RESPONSE (first student): {json}");
                }
                
                // Also log a few more students to verify RollNo values
                if (filteredStudents.Count > 3)
                {
                    _logger.LogInformation("📤 FIRST 3 STUDENTS RollNo VALUES:");
                    for (int i = 0; i < 3; i++)
                    {
                        var student = filteredStudents[i];
                        _logger.LogInformation($"   Student {i+1}: Reg_Id={student.Reg_Id}, Name={student.Frist_Name}, RollNo={student.RollNo}");
                    }
                }
                
                var response = new { Success = true, Data = filteredStudents, SectionInfo = new { section.ID, section.Section, section.Class_ID } };
                
                // Log the full response structure
                var fullJson = JsonSerializer.Serialize(response);
                _logger.LogInformation($"📤 FULL RESPONSE (first 500 chars): {fullJson.Substring(0, Math.Min(500, fullJson.Length))}");
                
                _logger.LogInformation($"========== RESPONSE SENT SUCCESSFULLY ==========");
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting students by section {sectionId}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Student/bysection-debug/{sectionId} - Debug endpoint
        [HttpGet("bysection-debug/{sectionId}")]
        public async Task<IActionResult> GetStudentsBySectionDebug(int sectionId)
        {
            try
            {
                _logger.LogInformation($"========== DEBUG: RAW STUDENT DATA FOR SECTION {sectionId} ==========");
                
                // Get raw students without any filtering
                var students = await _context.tbl_StudentRegistration
                    .Where(s => s.Section_ID == sectionId)
                    .ToListAsync();
                
                _logger.LogInformation($"Found {students.Count} raw students");
                
                // Log RollNo values from raw entities
                _logger.LogInformation("📊 RAW ROLLNO VALUES FROM DATABASE:");
                foreach (var student in students.Take(5))
                {
                    _logger.LogInformation($"   Reg_Id={student.Reg_Id}, Name={student.Frist_Name}, RollNo={student.RollNo}, RollNoHasValue={student.RollNo.HasValue}");
                }
                
                // Return raw entities (EF will serialize all properties)
                var response = new
                {
                    Success = true,
                    Message = "Raw data from database - all properties included",
                    Data = students.Select(s => new
                    {
                        s.Reg_Id,
                        s.Frist_Name,
                        s.RollNo,
                        RollNoValue = s.RollNo,
                        RollNoExists = s.RollNo.HasValue,
                        s.Class_ID,
                        s.Section_ID,
                        s.cur_Status,
                        s.Family_Code,
                        s.Gender,
                        s.Image
                    }),
                    Count = students.Count,
                    Note = "Check the RollNo and RollNoValue fields"
                };
                
                var json = JsonSerializer.Serialize(response);
                _logger.LogInformation($"📤 DEBUG RESPONSE (first 500 chars): {json.Substring(0, Math.Min(500, json.Length))}");
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Debug error: {ex.Message}");
                return StatusCode(500, new { Success = false, Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        // GET: api/Student/test-rollno - Simple test endpoint
        [HttpGet("test-rollno")]
        public async Task<IActionResult> TestRollNo()
        {
            try
            {
                _logger.LogInformation("========== TEST: CHECKING RollNo IN RESPONSE ==========");
                
                // Get just 5 students for testing
                var testStudents = await _context.tbl_StudentRegistration
                    .Take(5)
                    .Select(s => new
                    {
                        s.Reg_Id,
                        s.Frist_Name,
                        RollNo = s.RollNo != null ? s.RollNo.Value : 0,
                        s.Class_ID,
                        s.Section_ID
                    })
                    .ToListAsync();
                
                _logger.LogInformation($"📊 TEST: Found {testStudents.Count} students");
                
                foreach (var student in testStudents)
                {
                    _logger.LogInformation($"   Student {student.Reg_Id}: Name={student.Frist_Name}, RollNo={student.RollNo}");
                }
                
                var response = new
                {
                    Success = true,
                    Message = "Test endpoint - RollNo should be present",
                    Data = testStudents,
                    RollNoPresent = testStudents.Any(s => s.RollNo > 0),
                    FirstStudentRollNo = testStudents.FirstOrDefault()?.RollNo ?? 0
                };
                
                var json = JsonSerializer.Serialize(response);
                _logger.LogInformation($"📤 TEST RESPONSE: {json}");
                _logger.LogInformation("========== TEST RESPONSE SENT ==========");
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Test error");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Student/byfamily/{familyCode}
        [HttpGet("byfamily/{familyCode}")]
        public async Task<IActionResult> GetStudentsByFamily(int familyCode)
        {
            try
            {
                _logger.LogInformation($"Getting students for family code: {familyCode}");
                
                var filteredStudents = await _context.tbl_StudentRegistration
                    .Where(s => s.Family_Code == familyCode)
                    .Where(s => s.cur_Status == null || s.cur_Status.Trim() == "A")
                    .Select(s => new
                    {
                        s.Reg_Id,
                        s.Frist_Name,
                        RollNo = s.RollNo != null ? s.RollNo.Value : 0,
                        s.Family_Code,
                        s.Class_ID,
                        s.Section_ID,
                        s.Gender,
                        s.Image
                    })
                    .OrderBy(s => s.RollNo)
                    .ToListAsync();

                return Ok(new { Success = true, Data = filteredStudents });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting students by family");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Student/parents/{studentId}
        [HttpGet("parents/{studentId}")]
        public async Task<IActionResult> GetParentsByStudent(int studentId)
        {
            try
            {
                _logger.LogInformation($"Getting parents for student ID: {studentId}");
                
                var student = await _context.tbl_StudentRegistration
                    .FirstOrDefaultAsync(s => s.Reg_Id == studentId);

                if (student == null)
                    return NotFound(new { Success = false, Message = "Student not found" });

                if (!student.Family_Code.HasValue)
                    return Ok(new { Success = true, Data = new List<object>() });

                var parents = await _context.tbl_User
                    .Where(u => u.FamilyID == student.Family_Code && u.Status == true)
                    .Select(u => new
                    {
                        u.ID,
                        u.Name,
                        u.UserName,
                        u.Designation,
                        u.RoleID
                    })
                    .ToListAsync();

                _logger.LogInformation($"Found {parents.Count} parents for student {studentId}");
                
                return Ok(new { Success = true, Data = parents });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting parents by student");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Student/sections-with-students
        [HttpGet("sections-with-students")]
        public async Task<IActionResult> GetSectionsWithStudents()
        {
            try
            {
                _logger.LogInformation("Getting sections that have students");
                
                var allSections = await _context.tbl_AddSection
                    .Where(s => s.Active == true)
                    .ToListAsync();
                
                var activeStudents = await _context.tbl_StudentRegistration
                    .Where(s => s.cur_Status == null || s.cur_Status.Trim() == "A")
                    .ToListAsync();
                
                var sectionsWithStudents = allSections
                    .Select(s => new
                    {
                        s.ID,
                        s.Section,
                        s.Class_ID,
                        ClassName = _context.tbl_AddClass
                            .Where(c => c.Class_ID == s.Class_ID)
                            .Select(c => c.Class_Name)
                            .FirstOrDefault() ?? "",
                        StudentCount = activeStudents.Count(st => st.Section_ID == s.ID)
                    })
                    .Where(s => s.StudentCount > 0)
                    .OrderBy(s => s.ClassName)
                    .ThenBy(s => s.Section)
                    .ToList();

                return Ok(new { Success = true, Data = sectionsWithStudents });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sections with students");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Student/all-sections-with-counts
        [HttpGet("all-sections-with-counts")]
        public async Task<IActionResult> GetAllSectionsWithCounts()
        {
            try
            {
                _logger.LogInformation("Getting all sections with student counts");
                
                var allSections = await _context.tbl_AddSection
                    .Where(s => s.Active == true)
                    .ToListAsync();
                
                var activeStudents = await _context.tbl_StudentRegistration
                    .Where(s => s.cur_Status == null || s.cur_Status.Trim() == "A")
                    .ToListAsync();
                
                var allSectionsWithCounts = allSections
                    .Select(s => new
                    {
                        s.ID,
                        s.Section,
                        s.Class_ID,
                        ClassName = _context.tbl_AddClass
                            .Where(c => c.Class_ID == s.Class_ID)
                            .Select(c => c.Class_Name)
                            .FirstOrDefault() ?? "",
                        StudentCount = activeStudents.Count(st => st.Section_ID == s.ID)
                    })
                    .OrderByDescending(s => s.StudentCount)
                    .ThenBy(s => s.ClassName)
                    .ThenBy(s => s.Section)
                    .ToList();

                return Ok(new { Success = true, Data = allSectionsWithCounts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all sections with counts");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // DEBUG: GET: api/Student/debug-student-sections
        [HttpGet("debug-student-sections")]
        public async Task<IActionResult> DebugStudentSections()
        {
            try
            {
                var allSections = await _context.tbl_AddSection
                    .Where(s => s.Active == true)
                    .Select(s => new { s.ID, s.Section, s.Class_ID })
                    .ToListAsync();
                
                var allStudents = await _context.tbl_StudentRegistration.ToListAsync();
                
                var activeStudents = allStudents
                    .Where(s => s.cur_Status == null || (s.cur_Status != null && s.cur_Status.Trim() == "A"))
                    .ToList();
                
                var studentsBySection = activeStudents
                    .GroupBy(s => s.Section_ID)
                    .Select(g => new { SectionId = g.Key, Count = g.Count() })
                    .ToList();
                
                var sampleStudents = allStudents
                    .Take(10)
                    .Select(s => new { s.Reg_Id, s.Frist_Name, s.RollNo, s.Section_ID, s.cur_Status })
                    .ToList();
                
                var result = allSections.Select(s => new
                {
                    s.ID,
                    s.Section,
                    s.Class_ID,
                    StudentCount = studentsBySection.FirstOrDefault(st => st.SectionId == s.ID)?.Count ?? 0
                }).OrderByDescending(r => r.StudentCount).ToList();
                
                return Ok(new 
                { 
                    Success = true, 
                    Data = result,
                    SampleStudents = sampleStudents,
                    TotalActiveStudents = activeStudents.Count,
                    TotalSections = allSections.Count,
                    SectionsWithStudents = result.Count(r => r.StudentCount > 0)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }
   
   
   
     // GET: api/Student/fee-ledger
        [HttpGet("fee-ledger")]
        [Authorize(Roles = "Admin,Teacher,Manager,Parent")]
        public async Task<ActionResult<ApiResponse<List<StudentFeeLedgerResponse>>>> GetStudentFeeLedger(
            [FromQuery] int studentRegistrationId,
            [FromQuery] string fromDate,
            [FromQuery] string toDate)
        {
            try
            {
                _logger.LogInformation($"Getting Fee Ledger for StudentID: {studentRegistrationId}, From: {fromDate}, To: {toDate}");

                var result = new List<StudentFeeLedgerResponse>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    using (var command = new SqlCommand("sp_rptStudentFeeLedger", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@regID", studentRegistrationId);
                        command.Parameters.AddWithValue("@DateFrom", fromDate);
                        command.Parameters.AddWithValue("@DateTo", toDate);

                        // optional params
                        command.Parameters.AddWithValue("@campusID", DBNull.Value);
                        command.Parameters.AddWithValue("@SessionYear", DBNull.Value);

                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new StudentFeeLedgerResponse
                                {
                                    Date = reader["Date"]?.ToString(),
                                    VoucherID = reader["VoucherID"]?.ToString(),
                                    ChallanNo = reader["ChallanNo"] != DBNull.Value ? reader["ChallanNo"].ToString() : null,

                                    FundName = reader["FundName"]?.ToString(),
                                    FeeMonth = reader["FeeMonth"]?.ToString(),
                                    FeeYear = reader["FeeYear"]?.ToString(),
                                       Debit =reader["Debit"] != DBNull.Value ? reader["Debit"].ToString() : null,
                                    Credit = reader["Credit"] != DBNull.Value ? reader["Credit"].ToString() : null,
                                 Discount=reader["Discount"] != DBNull.Value ? reader["Discount"].ToString() : null,
                                };

                                result.Add(item);
                            }
                        }
                    }
                }

                return Ok(ApiResponse<List<StudentFeeLedgerResponse>>.CreateSuccess(result));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting student fee ledger");
                return StatusCode(500, ApiResponse<List<StudentFeeLedgerResponse>>.CreateError($"Error: {ex.Message}"));
            }
        }

  
   
   
   
    }


     
}