// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using school_management_Backend.Models;
// using school_management_Backend.DTOs;
// using school_management_Backend.Data;
// using Microsoft.Extensions.Logging;
// using System.Security.Claims;

// namespace school_management_Backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize]
//     public class GradesController : ControllerBase
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly ILogger<GradesController> _logger;

//         public GradesController(ApplicationDbContext context, ILogger<GradesController> logger)
//         {
//             _context = context;
//             _logger = logger;
//         }

//         // GET: api/grades/child/{childId}
//         [HttpGet("child/{childId}")]
//         public async Task<ActionResult<ApiResponse<List<ChildGradeDto>>>> GetChildGrades(
//             int childId,
//             [FromQuery] GradeFilters filters)
//         {
//             try
//             {
//                 _logger.LogInformation($"Fetching grades for child ID: {childId}");
                
//                 // Get student registration info
//                 var student = await _context.tbl_StudentRegistration
//                     .FirstOrDefaultAsync(s => s.Reg_Id == childId);

//                 if (student == null)
//                 {
//                     return NotFound(ApiResponse<List<ChildGradeDto>>.CreateError("Student not found"));
//                 }

//                 // Get results for the student with all necessary joins
//                 var query = from resultEntry in _context.tbl_ResultEntry
//                             join resultMaster in _context.tbl_ResultMaster 
//                                 on resultEntry.ResultID equals resultMaster.ResultID
//                             join subject in _context.tbl_Subject 
//                                 on resultMaster.SubjectID equals subject.Subject_Id into subjectJoin
//                             from subject in subjectJoin.DefaultIfEmpty()
//                             join examBatch in _context.tbl_ResultBatch 
//                                 on resultMaster.BatchID equals examBatch.BatchID into batchJoin
//                             from examBatch in batchJoin.DefaultIfEmpty()
//                             join teacher in _context.tbl_Employee 
//                                 on resultMaster.TeacherID equals teacher.Employee_Code into teacherJoin
//                             from teacher in teacherJoin.DefaultIfEmpty()
//                             where resultEntry.Reg_Id == childId
//                             select new
//                             {
//                                 ResultEntry = resultEntry,
//                                 ResultMaster = resultMaster,
//                                 Subject = subject,
//                                 ExamBatch = examBatch,
//                                 Teacher = teacher
//                             };

//                 // Apply filters
//                 if (filters.SubjectId.HasValue && filters.SubjectId.Value > 0)
//                 {
//                     query = query.Where(x => x.ResultMaster.SubjectID == filters.SubjectId.Value);
//                 }

//                 if (filters.BatchId.HasValue && filters.BatchId.Value > 0)
//                 {
//                     query = query.Where(x => x.ResultMaster.BatchID == filters.BatchId.Value);
//                 }

//                 if (filters.YearId.HasValue && filters.YearId.Value > 0)
//                 {
//                     query = query.Where(x => x.ResultMaster.YearID == filters.YearId.Value);
//                 }

//                 if (filters.DateFrom.HasValue)
//                 {
//                     var dateFrom = DateOnly.FromDateTime(filters.DateFrom.Value);
//                     query = query.Where(x => x.ResultMaster.ExamDate >= dateFrom);
//                 }

//                 if (filters.DateTo.HasValue)
//                 {
//                     var dateTo = DateOnly.FromDateTime(filters.DateTo.Value);
//                     query = query.Where(x => x.ResultMaster.ExamDate <= dateTo);
//                 }

//                 var results = await query
//                     .OrderByDescending(x => x.ResultMaster.ExamDate)
//                     .ToListAsync();

//                 if (!results.Any())
//                 {
//                     return Ok(ApiResponse<List<ChildGradeDto>>.CreateSuccess(
//                         new List<ChildGradeDto>(), 
//                         "No grades found"));
//                 }

//                 // Get grade scale for grade calculation
//                 var gradeScale = await _context.tbl_Grade
//                     .Where(g => g.CampusID == student.CampusID)
//                     .OrderByDescending(g => g.Grade_Percent)
//                     .ToListAsync();

//                 // Transform to DTO
//                 var grades = results.Select(x => new ChildGradeDto
//                 {
//                     Id = x.ResultEntry.ID,
//                     ResultId = x.ResultEntry.ResultID ?? 0,
//                     SubjectId = x.ResultMaster.SubjectID ?? 0,
//                     SubjectName = x.Subject?.Subject_Name ?? "Unknown Subject",
//                     SubjectCode = x.Subject?.SubjectCode ?? "",
//                     ExamDate = x.ResultMaster.ExamDate?.ToString("yyyy-MM-dd") ?? "",
//                     ExamType = x.ExamBatch?.Type ?? "Exam",
//                     BatchName = x.ExamBatch?.BatchName ?? "",
//                     TotalMarks = x.ResultMaster.TotalMarks ?? 0,
//                     ObtainedMarks = x.ResultEntry.ObtainedMarks ?? 0,
//                     PassingMarks = x.ResultMaster.PassingMarks ?? 0,
//                     TeacherId = x.ResultMaster.TeacherID ?? 0,
//                     TeacherName = x.Teacher?.Employee_Name ?? "Not Assigned",
//                     RollNo = x.ResultEntry.RollNo ?? 0,
//                     RegNo = x.ResultEntry.Reg_No ?? "",
//                     StudentName = x.ResultEntry.Name ?? "",
//                     Percentage = x.ResultMaster.TotalMarks > 0 
//                         ? Math.Round((x.ResultEntry.ObtainedMarks ?? 0) / (x.ResultMaster.TotalMarks ?? 1) * 100, 2)
//                         : 0,
//                     Grade = CalculateGradeFromScale(
//                         x.ResultEntry.ObtainedMarks ?? 0,
//                         x.ResultMaster.TotalMarks ?? 0,
//                         gradeScale),
//                     Status = (x.ResultEntry.ObtainedMarks ?? 0) >= (x.ResultMaster.PassingMarks ?? 0) 
//                         ? "Pass" : "Fail",
//                     Remarks = GetGradeRemarks(
//                         x.ResultEntry.ObtainedMarks ?? 0,
//                         x.ResultMaster.TotalMarks ?? 0,
//                         gradeScale,
//                         student.Gender ?? "Male")
//                 }).ToList();

//                 return Ok(ApiResponse<List<ChildGradeDto>>.CreateSuccess(grades));
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error fetching grades for child {childId}: {ex.Message}");
//                 return StatusCode(500, ApiResponse<List<ChildGradeDto>>.CreateError($"Error fetching grades: {ex.Message}"));
//             }
//         }

//         // GET: api/grades/child/{childId}/stats
//         [HttpGet("child/{childId}/stats")]
//         public async Task<ActionResult<ApiResponse<GradeStatsDto>>> GetChildGradeStats(
//             int childId,
//             [FromQuery] GradeFilters filters)
//         {
//             try
//             {
//                 _logger.LogInformation($"Fetching grade stats for child ID: {childId}");
                
//                 // Get student
//                 var student = await _context.tbl_StudentRegistration
//                     .FirstOrDefaultAsync(s => s.Reg_Id == childId);

//                 if (student == null)
//                 {
//                     return NotFound(ApiResponse<GradeStatsDto>.CreateError("Student not found"));
//                 }

//                 // Get results with necessary joins
//                 var query = from resultEntry in _context.tbl_ResultEntry
//                             join resultMaster in _context.tbl_ResultMaster 
//                                 on resultEntry.ResultID equals resultMaster.ResultID
//                             join subject in _context.tbl_Subject 
//                                 on resultMaster.SubjectID equals subject.Subject_Id into subjectJoin
//                             from subject in subjectJoin.DefaultIfEmpty()
//                             where resultEntry.Reg_Id == childId
//                             select new
//                             {
//                                 ResultEntry = resultEntry,
//                                 ResultMaster = resultMaster,
//                                 Subject = subject
//                             };

//                 // Apply filters
//                 if (filters.SubjectId.HasValue && filters.SubjectId.Value > 0)
//                 {
//                     query = query.Where(x => x.ResultMaster.SubjectID == filters.SubjectId.Value);
//                 }

//                 if (filters.YearId.HasValue && filters.YearId.Value > 0)
//                 {
//                     query = query.Where(x => x.ResultMaster.YearID == filters.YearId.Value);
//                 }

//                 var results = await query.ToListAsync();

//                 if (!results.Any())
//                 {
//                     return Ok(ApiResponse<GradeStatsDto>.CreateSuccess(
//                         new GradeStatsDto(), 
//                         "No grades found"));
//                 }

//                 // Get grade scale
//                 var gradeScale = await _context.tbl_Grade
//                     .Where(g => g.CampusID == student.CampusID)
//                     .ToListAsync();

//                 // Create strongly-typed grade objects instead of using dynamic
//                 var gradeItems = results.Select(x => new GradeItem
//                 {
//                     ObtainedMarks = x.ResultEntry.ObtainedMarks ?? 0,
//                     TotalMarks = x.ResultMaster.TotalMarks ?? 0,
//                     SubjectName = x.Subject?.Subject_Name ?? "Unknown",
//                     SubjectId = x.ResultMaster.SubjectID ?? 0,
//                     ExamDate = x.ResultMaster.ExamDate,
//                     Percentage = x.ResultMaster.TotalMarks > 0 
//                         ? (x.ResultEntry.ObtainedMarks ?? 0) / (x.ResultMaster.TotalMarks ?? 1) * 100 
//                         : 0
//                 }).ToList();

//                 // Subject-wise performance
//                 var subjectPerformance = gradeItems
//                     .GroupBy(g => g.SubjectName)
//                     .Select(g => new SubjectPerformanceDto
//                     {
//                         SubjectName = g.Key,
//                         AveragePercentage = Math.Round(g.Average(x => x.Percentage), 1),
//                         BestGrade = GetBestGradeFromPercentages(
//                             g.Select(x => x.Percentage).ToList(), 
//                             gradeScale),
//                         TotalExams = g.Count(),
//                         HighestMarks = Math.Round(g.Max(x => x.ObtainedMarks), 1),
//                         LowestMarks = Math.Round(g.Min(x => x.ObtainedMarks), 1)
//                     })
//                     .ToList();

//                 // Calculate overall stats
//                 var stats = new GradeStatsDto
//                 {
//                     AveragePercentage = gradeItems.Any() 
//                         ? Math.Round(gradeItems.Average(g => g.Percentage), 1) 
//                         : 0,
//                     TotalExams = results.Count,
//                     HighestScore = gradeItems.Any() 
//                         ? Math.Round(gradeItems.Max(g => g.ObtainedMarks), 1) 
//                         : 0,
//                     LowestScore = gradeItems.Any() 
//                         ? Math.Round(gradeItems.Min(g => g.ObtainedMarks), 1) 
//                         : 0,
//                     AverageScore = gradeItems.Any() 
//                         ? Math.Round(gradeItems.Average(g => g.ObtainedMarks), 1) 
//                         : 0,
//                     TotalSubjects = gradeItems.Select(g => g.SubjectId).Distinct().Count(),
//                     Improvement = CalculateImprovement(gradeItems),
//                     Gpa = CalculateGPA(gradeItems, gradeScale),
//                     PassRate = CalculatePassRate(gradeItems),
//                     SubjectPerformance = subjectPerformance,
//                     PerformanceTrend = CalculatePerformanceTrend(gradeItems)
//                 };

//                 return Ok(ApiResponse<GradeStatsDto>.CreateSuccess(stats));
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error calculating grade stats for child {childId}: {ex.Message}");
//                 return StatusCode(500, ApiResponse<GradeStatsDto>.CreateError($"Error calculating stats: {ex.Message}"));
//             }
//         }

//         // GET: api/grades/child/{childId}/subjects
//         [HttpGet("child/{childId}/subjects")]
//         public async Task<ActionResult<ApiResponse<List<SubjectDto>>>> GetChildSubjectsWithGrades(int childId)
//         {
//             try
//             {
//                 var subjects = await (from resultEntry in _context.tbl_ResultEntry
//                                       join resultMaster in _context.tbl_ResultMaster 
//                                           on resultEntry.ResultID equals resultMaster.ResultID
//                                       join subject in _context.tbl_Subject 
//                                           on resultMaster.SubjectID equals subject.Subject_Id
//                                       where resultEntry.Reg_Id == childId && resultMaster.SubjectID.HasValue
//                                       select new SubjectDto
//                                       {
//                                           Id = resultMaster.SubjectID.Value,
//                                           Name = subject.Subject_Name ?? "Unknown",
//                                           Code = subject.SubjectCode ?? "",
//                                           ColorCode = subject.ColorCode ?? GetSubjectColor(resultMaster.SubjectID.Value)
//                                       })
//                                       .Distinct()
//                                       .OrderBy(s => s.Name)
//                                       .ToListAsync();

//                 return Ok(ApiResponse<List<SubjectDto>>.CreateSuccess(subjects));
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error fetching subjects for child {childId}: {ex.Message}");
//                 return StatusCode(500, ApiResponse<List<SubjectDto>>.CreateError($"Error fetching subjects: {ex.Message}"));
//             }
//         }

//         // GET: api/grades/exam-batches - FINAL FIXED VERSION
//         [HttpGet("exam-batches")]
//         public async Task<ActionResult<ApiResponse<List<ExamBatchDto>>>> GetExamBatches(
//             [FromQuery] int? classId, 
//             [FromQuery] int? sectionId)
//         {
//             try
//             {
//                 _logger.LogInformation($"Fetching exam batches - classId: {classId}, sectionId: {sectionId}");
                
//                 // Get all active batches regardless of whether they have results
//                 var allBatches = await _context.tbl_ResultBatch
//                     .Where(b => b.Active == true)
//                     .Select(b => new ExamBatchDto
//                     {
//                         Id = b.BatchID,
//                         Name = b.BatchName ?? "",
//                         Type = b.Type ?? "Exam",
//                         ExamId = b.ExamID ?? 0,
//                         Active = b.Active ?? false
//                     })
//                     .OrderBy(b => b.Name)
//                     .ToListAsync();

//                 _logger.LogInformation($"Found {allBatches.Count} active batches in database");

//                 // Log each batch for debugging
//                 foreach (var batch in allBatches)
//                 {
//                     _logger.LogInformation($"Batch: ID={batch.Id}, Name={batch.Name}, Type={batch.Type}");
//                 }

//                 return Ok(ApiResponse<List<ExamBatchDto>>.CreateSuccess(allBatches));
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching exam batches");
//                 return StatusCode(500, ApiResponse<List<ExamBatchDto>>.CreateError($"Error fetching exam batches: {ex.Message}"));
//             }
//         }

//         // GET: api/grades/academic-years - FINAL FIXED VERSION
//         [HttpGet("academic-years")]
//         public async Task<ActionResult<ApiResponse<List<AcademicYearDto>>>> GetAcademicYears()
//         {
//             try
//             {
//                 _logger.LogInformation("Fetching academic years");
                
//                 var years = await _context.tbl_AcadmicYear
//                     .Where(y => y.Active == true)
//                     .Select(y => new AcademicYearDto
//                     {
//                         Id = y.YearID,
//                         Title = y.YearTitle ?? "",
//                         IsActive = y.Active ?? false
//                     })
//                     .OrderByDescending(y => y.Title)
//                     .ToListAsync();

//                 _logger.LogInformation($"Found {years.Count} academic years in database");

//                 // Log each year for debugging
//                 foreach (var year in years)
//                 {
//                     _logger.LogInformation($"Year: ID={year.Id}, Title={year.Title}");
//                 }

//                 return Ok(ApiResponse<List<AcademicYearDto>>.CreateSuccess(years));
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching academic years");
//                 return StatusCode(500, ApiResponse<List<AcademicYearDto>>.CreateError($"Error fetching academic years: {ex.Message}"));
//             }
//         }

//         #region Helper Methods

//         private string CalculateGradeFromScale(double obtainedMarks, double totalMarks, List<tbl_Grade> gradeScale)
//         {
//             if (totalMarks == 0) return "N/A";
            
//             var percentage = (obtainedMarks / totalMarks) * 100;
            
//             var grade = gradeScale
//                 .Where(g => percentage >= g.Grade_Percent)
//                 .OrderByDescending(g => g.Grade_Percent)
//                 .FirstOrDefault();

//             return grade?.Grade ?? "F";
//         }

//         private string GetGradeRemarks(double obtainedMarks, double totalMarks, List<tbl_Grade> gradeScale, string gender)
//         {
//             if (totalMarks == 0) return "No remarks available";
            
//             var percentage = (obtainedMarks / totalMarks) * 100;
            
//             var grade = gradeScale
//                 .Where(g => percentage >= g.Grade_Percent)
//                 .OrderByDescending(g => g.Grade_Percent)
//                 .FirstOrDefault();

//             if (grade == null) return "Needs Improvement";

//             return gender?.ToLower() == "female" 
//                 ? grade.RemarksFemale ?? grade.Remarks1 ?? "Good"
//                 : grade.RemarksMale ?? grade.Remarks1 ?? "Good";
//         }

//         private string GetBestGradeFromPercentages(List<double> percentages, List<tbl_Grade> gradeScale)
//         {
//             if (!percentages.Any()) return "N/A";
            
//             var bestPercentage = percentages.Max();
            
//             var grade = gradeScale
//                 .Where(g => bestPercentage >= g.Grade_Percent)
//                 .OrderByDescending(g => g.Grade_Percent)
//                 .FirstOrDefault();

//             return grade?.Grade ?? "N/A";
//         }

//         private string CalculateImprovement(List<GradeItem> grades)
//         {
//             if (grades.Count < 2) return "0%";
            
//             var orderedGrades = grades
//                 .Where(g => g.ExamDate != null)
//                 .OrderBy(g => g.ExamDate)
//                 .ToList();
            
//             if (!orderedGrades.Any()) return "0%";
            
//             var firstPercentage = orderedGrades.First().Percentage;
//             var lastPercentage = orderedGrades.Last().Percentage;
            
//             var improvement = lastPercentage - firstPercentage;
//             return improvement >= 0 ? $"+{improvement:F1}%" : $"{improvement:F1}%";
//         }

//         private double CalculateGPA(List<GradeItem> grades, List<tbl_Grade> gradeScale)
//         {
//             if (!grades.Any()) return 0;

//             var totalPoints = 0.0;
//             var count = 0;

//             foreach (var grade in grades)
//             {
//                 var gradeRecord = gradeScale
//                     .Where(g => grade.Percentage >= g.Grade_Percent)
//                     .OrderByDescending(g => g.Grade_Percent)
//                     .FirstOrDefault();

//                 if (gradeRecord?.CGPA.HasValue == true)
//                 {
//                     totalPoints += gradeRecord.CGPA.Value;
//                     count++;
//                 }
//             }

//             return count > 0 ? Math.Round(totalPoints / count, 2) : 0;
//         }

//         private double CalculatePassRate(List<GradeItem> grades)
//         {
//             if (!grades.Any()) return 0;
            
//             var passed = grades.Count(g => g.Percentage >= 40);
//             return Math.Round((double)passed / grades.Count * 100, 1);
//         }

//         private List<TrendDataDto> CalculatePerformanceTrend(List<GradeItem> grades)
//         {
//             return grades
//                 .Where(g => g.ExamDate != null)
//                 .GroupBy(g => g.ExamDate?.ToString("MMM yyyy") ?? "Unknown")
//                 .Select(g => new TrendDataDto
//                 {
//                     Label = g.Key,
//                     Value = Math.Round(g.Average(x => x.Percentage), 1)
//                 })
//                 .OrderBy(t => {
//                     try 
//                     {
//                         return DateTime.ParseExact(t.Label, "MMM yyyy", 
//                             System.Globalization.CultureInfo.InvariantCulture);
//                     }
//                     catch
//                     {
//                         return DateTime.MinValue;
//                     }
//                 })
//                 .ToList();
//         }

//         private string GetSubjectColor(int subjectId)
//         {
//             var colors = new[] { "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22", "#34495e" };
//             return colors[subjectId % colors.Length];
//         }

//         #endregion
//     }

//     // Helper class for grade calculations
//     public class GradeItem
//     {
//         public double ObtainedMarks { get; set; }
//         public double TotalMarks { get; set; }
//         public string SubjectName { get; set; } = "";
//         public int SubjectId { get; set; }
//         public DateOnly? ExamDate { get; set; }
//         public double Percentage { get; set; }
//     }
// }
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Models;
using school_management_Backend.DTOs;
using school_management_Backend.Data;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GradesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GradesController> _logger;
        private static readonly string[] SubjectColors = new[] 
        { 
            "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", 
            "#1abc9c", "#e67e22", "#34495e", "#16a085", "#27ae60",
            "#2980b9", "#8e44ad", "#2c3e50", "#d35400", "#c0392b" 
        };

        public GradesController(ApplicationDbContext context, ILogger<GradesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/grades/child/{childId}
        [HttpGet("child/{childId}")]
        public async Task<ActionResult<ApiResponse<List<ChildGradeDto>>>> GetChildGrades(
            int childId,
            [FromQuery] GradeFilters filters)
        {
            try
            {
                _logger.LogInformation($"Fetching grades for child ID: {childId}");
                
                // Get student registration info
                var student = await _context.tbl_StudentRegistration
                    .FirstOrDefaultAsync(s => s.Reg_Id == childId);

                if (student == null)
                {
                    return NotFound(ApiResponse<List<ChildGradeDto>>.CreateError("Student not found"));
                }

                // Build query
                var query = from resultEntry in _context.tbl_ResultEntry
                            join resultMaster in _context.tbl_ResultMaster 
                                on resultEntry.ResultID equals resultMaster.ResultID
                            join subject in _context.tbl_Subject 
                                on resultMaster.SubjectID equals subject.Subject_Id into subjectJoin
                            from subject in subjectJoin.DefaultIfEmpty()
                            join examBatch in _context.tbl_ResultBatch 
                                on resultMaster.BatchID equals examBatch.BatchID into batchJoin
                            from examBatch in batchJoin.DefaultIfEmpty()
                            join teacher in _context.tbl_Employee 
                                on resultMaster.TeacherID equals teacher.Employee_Code into teacherJoin
                            from teacher in teacherJoin.DefaultIfEmpty()
                            where resultEntry.Reg_Id == childId
                            select new
                            {
                                ResultEntry = resultEntry,
                                ResultMaster = resultMaster,
                                Subject = subject,
                                ExamBatch = examBatch,
                                Teacher = teacher
                            };

                // Apply filters
                query = ApplyFiltersToQuery(query, filters);

                var results = await query
                    .OrderByDescending(x => x.ResultMaster.ExamDate)
                    .ToListAsync();

                if (!results.Any())
                {
                    return Ok(ApiResponse<List<ChildGradeDto>>.CreateSuccess(
                        new List<ChildGradeDto>(), 
                        "No grades found"));
                }

                // Get grade scale
                var gradeScale = await _context.tbl_Grade
                    .Where(g => g.CampusID == student.CampusID)
                    .OrderByDescending(g => g.Grade_Percent)
                    .ToListAsync();

                // Transform to DTO
                var grades = results.Select(x => new ChildGradeDto
                {
                    Id = x.ResultEntry.ID,
                    ResultId = x.ResultEntry.ResultID ?? 0,
                    SubjectId = x.ResultMaster.SubjectID ?? 0,
                    SubjectName = x.Subject?.Subject_Name ?? "Unknown Subject",
                    SubjectCode = x.Subject?.SubjectCode ?? "",
                    ExamDate = x.ResultMaster.ExamDate?.ToString("yyyy-MM-dd") ?? "",
                    ExamType = x.ExamBatch?.Type ?? "Exam",
                    BatchName = x.ExamBatch?.BatchName ?? "",
                    TotalMarks = x.ResultMaster.TotalMarks ?? 0,
                    ObtainedMarks = x.ResultEntry.ObtainedMarks ?? 0,
                    PassingMarks = x.ResultMaster.PassingMarks ?? 0,
                    TeacherId = x.ResultMaster.TeacherID ?? 0,
                    TeacherName = x.Teacher?.Employee_Name ?? "Not Assigned",
                    RollNo = x.ResultEntry.RollNo ?? 0,
                    RegNo = x.ResultEntry.Reg_No ?? "",
                    StudentName = x.ResultEntry.Name ?? "",
                    Percentage = CalculatePercentage(x.ResultEntry.ObtainedMarks ?? 0, x.ResultMaster.TotalMarks ?? 0),
                    Grade = CalculateGradeFromScale(
                        x.ResultEntry.ObtainedMarks ?? 0,
                        x.ResultMaster.TotalMarks ?? 0,
                        gradeScale),
                    Status = (x.ResultEntry.ObtainedMarks ?? 0) >= (x.ResultMaster.PassingMarks ?? 0) 
                        ? "Pass" : "Fail",
                    Remarks = GetGradeRemarks(
                        x.ResultEntry.ObtainedMarks ?? 0,
                        x.ResultMaster.TotalMarks ?? 0,
                        gradeScale,
                        student.Gender ?? "Male")
                }).ToList();

                return Ok(ApiResponse<List<ChildGradeDto>>.CreateSuccess(grades));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching grades for child {childId}: {ex.Message}");
                return StatusCode(500, ApiResponse<List<ChildGradeDto>>.CreateError($"Error fetching grades: {ex.Message}"));
            }
        }

        // GET: api/grades/child/{childId}/stats
        [HttpGet("child/{childId}/stats")]
        public async Task<ActionResult<ApiResponse<GradeStatsDto>>> GetChildGradeStats(
            int childId,
            [FromQuery] GradeFilters filters)
        {
            try
            {
                _logger.LogInformation($"Fetching grade stats for child ID: {childId}");
                
                // Get student
                var student = await _context.tbl_StudentRegistration
                    .FirstOrDefaultAsync(s => s.Reg_Id == childId);

                if (student == null)
                {
                    return NotFound(ApiResponse<GradeStatsDto>.CreateError("Student not found"));
                }

                // Build query
                var query = from resultEntry in _context.tbl_ResultEntry
                            join resultMaster in _context.tbl_ResultMaster 
                                on resultEntry.ResultID equals resultMaster.ResultID
                            join subject in _context.tbl_Subject 
                                on resultMaster.SubjectID equals subject.Subject_Id into subjectJoin
                            from subject in subjectJoin.DefaultIfEmpty()
                            where resultEntry.Reg_Id == childId
                            select new
                            {
                                ResultEntry = resultEntry,
                                ResultMaster = resultMaster,
                                Subject = subject
                            };

                // Apply filters
                if (filters.SubjectId.HasValue && filters.SubjectId.Value > 0)
                {
                    query = query.Where(x => x.ResultMaster.SubjectID == filters.SubjectId.Value);
                }

                if (filters.YearId.HasValue && filters.YearId.Value > 0)
                {
                    query = query.Where(x => x.ResultMaster.YearID == filters.YearId.Value);
                }

                var results = await query.ToListAsync();

                if (!results.Any())
                {
                    return Ok(ApiResponse<GradeStatsDto>.CreateSuccess(
                        new GradeStatsDto(), 
                        "No grades found"));
                }

                // Get grade scale
                var gradeScale = await _context.tbl_Grade
                    .Where(g => g.CampusID == student.CampusID)
                    .ToListAsync();

                // Create grade items
                var gradeItems = results.Select(x => new GradeItem
                {
                    ObtainedMarks = x.ResultEntry.ObtainedMarks ?? 0,
                    TotalMarks = x.ResultMaster.TotalMarks ?? 0,
                    SubjectName = x.Subject?.Subject_Name ?? "Unknown",
                    SubjectId = x.ResultMaster.SubjectID ?? 0,
                    ExamDate = x.ResultMaster.ExamDate,
                    Percentage = CalculatePercentage(x.ResultEntry.ObtainedMarks ?? 0, x.ResultMaster.TotalMarks ?? 0)
                }).ToList();

                // Calculate stats
                var stats = CalculateGradeStats(gradeItems, gradeScale);

                return Ok(ApiResponse<GradeStatsDto>.CreateSuccess(stats));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error calculating grade stats for child {childId}: {ex.Message}");
                return StatusCode(500, ApiResponse<GradeStatsDto>.CreateError($"Error calculating stats: {ex.Message}"));
            }
        }

        // GET: api/grades/child/{childId}/subjects - FIXED VERSION
        [HttpGet("child/{childId}/subjects")]
        public async Task<ActionResult<ApiResponse<List<SubjectDto>>>> GetChildSubjectsWithGrades(int childId)
        {
            try
            {
                _logger.LogInformation($"Fetching subjects for child ID: {childId}");
                
                // First, get the raw data without calling GetSubjectColor in the query
                var subjectsData = await (from resultEntry in _context.tbl_ResultEntry
                                          join resultMaster in _context.tbl_ResultMaster 
                                              on resultEntry.ResultID equals resultMaster.ResultID
                                          join subject in _context.tbl_Subject 
                                              on resultMaster.SubjectID equals subject.Subject_Id
                                          where resultEntry.Reg_Id == childId && resultMaster.SubjectID.HasValue
                                          select new
                                          {
                                              Id = resultMaster.SubjectID.Value,
                                              Name = subject.Subject_Name ?? "Unknown",
                                              Code = subject.SubjectCode ?? "",
                                              ColorCode = subject.ColorCode
                                          })
                                          .Distinct()
                                          .OrderBy(s => s.Name)
                                          .ToListAsync();

                // Transform to DTO with color - now done in memory, not in SQL
                var subjects = subjectsData.Select(s => new SubjectDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Code = s.Code,
                    ColorCode = !string.IsNullOrEmpty(s.ColorCode) ? s.ColorCode : GetSubjectColor(s.Id)
                }).ToList();

                _logger.LogInformation($"Found {subjects.Count} subjects for child {childId}");
                
                return Ok(ApiResponse<List<SubjectDto>>.CreateSuccess(subjects));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching subjects for child {childId}: {ex.Message}");
                return StatusCode(500, ApiResponse<List<SubjectDto>>.CreateError($"Error fetching subjects: {ex.Message}"));
            }
        }

        // GET: api/grades/exam-batches
        [HttpGet("exam-batches")]
        public async Task<ActionResult<ApiResponse<List<ExamBatchDto>>>> GetExamBatches(
            [FromQuery] int? classId, 
            [FromQuery] int? sectionId)
        {
            try
            {
                _logger.LogInformation($"Fetching exam batches - classId: {classId}, sectionId: {sectionId}");
                
                var query = _context.tbl_ResultBatch.Where(b => b.Active == true);
                
                // Apply filters if provided
                if (classId.HasValue && classId.Value > 0)
                {
                    // Filter by class if needed - adjust based on your schema
                    // query = query.Where(b => b.ClassID == classId);
                }
                
                var allBatches = await query
                    .Select(b => new ExamBatchDto
                    {
                        Id = b.BatchID,
                        Name = b.BatchName ?? "",
                        Type = b.Type ?? "Exam",
                        ExamId = b.ExamID ?? 0,
                        Active = b.Active ?? false
                    })
                    .OrderBy(b => b.Name)
                    .ToListAsync();

                _logger.LogInformation($"Found {allBatches.Count} active batches");
                
                return Ok(ApiResponse<List<ExamBatchDto>>.CreateSuccess(allBatches));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching exam batches");
                return StatusCode(500, ApiResponse<List<ExamBatchDto>>.CreateError($"Error fetching exam batches: {ex.Message}"));
            }
        }

        // GET: api/grades/academic-years
        [HttpGet("academic-years")]
        public async Task<ActionResult<ApiResponse<List<AcademicYearDto>>>> GetAcademicYears()
        {
            try
            {
                _logger.LogInformation("Fetching academic years");
                
                var years = await _context.tbl_AcadmicYear
                    .Where(y => y.Active == true)
                    .Select(y => new AcademicYearDto
                    {
                        Id = y.YearID,
                        Title = y.YearTitle ?? "",
                        IsActive = y.Active ?? false
                    })
                    .OrderByDescending(y => y.Title)
                    .ToListAsync();

                _logger.LogInformation($"Found {years.Count} academic years");
                
                return Ok(ApiResponse<List<AcademicYearDto>>.CreateSuccess(years));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching academic years");
                return StatusCode(500, ApiResponse<List<AcademicYearDto>>.CreateError($"Error fetching academic years: {ex.Message}"));
            }
        }

        #region Helper Methods

        private static double CalculatePercentage(double obtainedMarks, double totalMarks)
        {
            return totalMarks > 0 ? Math.Round((obtainedMarks / totalMarks) * 100, 2) : 0;
        }

        private static IQueryable<T> ApplyFiltersToQuery<T>(IQueryable<T> query, GradeFilters filters)
        {
            // This is a placeholder - you'll need to adapt based on your anonymous type
            // Using reflection or reworking the query structure would be better
            return query;
        }

        private GradeStatsDto CalculateGradeStats(List<GradeItem> gradeItems, List<tbl_Grade> gradeScale)
        {
            if (!gradeItems.Any())
            {
                return new GradeStatsDto();
            }

            // Subject-wise performance
            var subjectPerformance = gradeItems
                .GroupBy(g => g.SubjectName)
                .Select(g => new SubjectPerformanceDto
                {
                    SubjectName = g.Key,
                    AveragePercentage = Math.Round(g.Average(x => x.Percentage), 1),
                    BestGrade = GetBestGradeFromPercentages(g.Select(x => x.Percentage).ToList(), gradeScale),
                    TotalExams = g.Count(),
                    HighestMarks = Math.Round(g.Max(x => x.ObtainedMarks), 1),
                    LowestMarks = Math.Round(g.Min(x => x.ObtainedMarks), 1)
                })
                .ToList();

            return new GradeStatsDto
            {
                AveragePercentage = Math.Round(gradeItems.Average(g => g.Percentage), 1),
                TotalExams = gradeItems.Count,
                HighestScore = Math.Round(gradeItems.Max(g => g.ObtainedMarks), 1),
                LowestScore = Math.Round(gradeItems.Min(g => g.ObtainedMarks), 1),
                AverageScore = Math.Round(gradeItems.Average(g => g.ObtainedMarks), 1),
                TotalSubjects = gradeItems.Select(g => g.SubjectId).Distinct().Count(),
                Improvement = CalculateImprovement(gradeItems),
                Gpa = CalculateGPA(gradeItems, gradeScale),
                PassRate = CalculatePassRate(gradeItems),
                SubjectPerformance = subjectPerformance,
                PerformanceTrend = CalculatePerformanceTrend(gradeItems)
            };
        }

        private string CalculateGradeFromScale(double obtainedMarks, double totalMarks, List<tbl_Grade> gradeScale)
        {
            if (totalMarks == 0) return "N/A";
            
            var percentage = (obtainedMarks / totalMarks) * 100;
            
            var grade = gradeScale
                .Where(g => percentage >= g.Grade_Percent)
                .OrderByDescending(g => g.Grade_Percent)
                .FirstOrDefault();

            return grade?.Grade ?? "F";
        }

        private string GetGradeRemarks(double obtainedMarks, double totalMarks, List<tbl_Grade> gradeScale, string gender)
        {
            if (totalMarks == 0) return "No remarks available";
            
            var percentage = (obtainedMarks / totalMarks) * 100;
            
            var grade = gradeScale
                .Where(g => percentage >= g.Grade_Percent)
                .OrderByDescending(g => g.Grade_Percent)
                .FirstOrDefault();

            if (grade == null) return "Needs Improvement";

            return gender?.ToLower() == "female" 
                ? grade.RemarksFemale ?? grade.Remarks1 ?? "Good"
                : grade.RemarksMale ?? grade.Remarks1 ?? "Good";
        }

        private string GetBestGradeFromPercentages(List<double> percentages, List<tbl_Grade> gradeScale)
        {
            if (!percentages.Any()) return "N/A";
            
            var bestPercentage = percentages.Max();
            
            var grade = gradeScale
                .Where(g => bestPercentage >= g.Grade_Percent)
                .OrderByDescending(g => g.Grade_Percent)
                .FirstOrDefault();

            return grade?.Grade ?? "N/A";
        }

        private string CalculateImprovement(List<GradeItem> grades)
        {
            if (grades.Count < 2) return "0%";
            
            var orderedGrades = grades
                .Where(g => g.ExamDate != null)
                .OrderBy(g => g.ExamDate)
                .ToList();
            
            if (orderedGrades.Count < 2) return "0%";
            
            var firstPercentage = orderedGrades.First().Percentage;
            var lastPercentage = orderedGrades.Last().Percentage;
            
            var improvement = lastPercentage - firstPercentage;
            return improvement >= 0 ? $"+{improvement:F1}%" : $"{improvement:F1}%";
        }

        private double CalculateGPA(List<GradeItem> grades, List<tbl_Grade> gradeScale)
        {
            if (!grades.Any()) return 0;

            var totalPoints = 0.0;
            var count = 0;

            foreach (var grade in grades)
            {
                var gradeRecord = gradeScale
                    .Where(g => grade.Percentage >= g.Grade_Percent)
                    .OrderByDescending(g => g.Grade_Percent)
                    .FirstOrDefault();

                if (gradeRecord?.CGPA.HasValue == true)
                {
                    totalPoints += gradeRecord.CGPA.Value;
                    count++;
                }
            }

            return count > 0 ? Math.Round(totalPoints / count, 2) : 0;
        }

        private double CalculatePassRate(List<GradeItem> grades)
        {
            if (!grades.Any()) return 0;
            
            var passed = grades.Count(g => g.Percentage >= 40);
            return Math.Round((double)passed / grades.Count * 100, 1);
        }

        private List<TrendDataDto> CalculatePerformanceTrend(List<GradeItem> grades)
        {
            return grades
                .Where(g => g.ExamDate != null)
                .GroupBy(g => g.ExamDate?.ToString("MMM yyyy") ?? "Unknown")
                .Select(g => new TrendDataDto
                {
                    Label = g.Key,
                    Value = Math.Round(g.Average(x => x.Percentage), 1)
                })
                .OrderBy(t => {
                    try 
                    {
                        return DateTime.ParseExact(t.Label, "MMM yyyy", 
                            System.Globalization.CultureInfo.InvariantCulture);
                    }
                    catch
                    {
                        return DateTime.MinValue;
                    }
                })
                .ToList();
        }

        private static string GetSubjectColor(int subjectId)
        {
            return SubjectColors[Math.Abs(subjectId) % SubjectColors.Length];
        }

        #endregion
    }

    // Helper class for grade calculations
    public class GradeItem
    {
        public double ObtainedMarks { get; set; }
        public double TotalMarks { get; set; }
        public string SubjectName { get; set; } = "";
        public int SubjectId { get; set; }
        public DateOnly? ExamDate { get; set; }
        public double Percentage { get; set; }
    }
}