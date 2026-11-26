
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Data.SqlClient;
// using Microsoft.EntityFrameworkCore;
// using school_management_Backend.Data;
// using school_management_Backend.DTOs;
// using System;
// using System.Collections.Generic;
// using System.Data;
// using System.Linq;
// using System.Threading.Tasks;

// namespace school_management_Backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize]
//     public class PerformanceController : BaseApiController
//     {


      

//         [HttpGet("student-performance/{regId}")]
//         public async Task<IActionResult> GetStudentPerformance(
//             int regId,
//             [FromQuery] int sessionYear,
//             [FromQuery] int classId = 0,
//             [FromQuery] int sectionId = 0,
//             [FromQuery] string dateFrom = null,
//             [FromQuery] string dateTo = null)
//         {
//             try
//             {
//                 DateTime fromDate, toDate;
                
//                 if (!string.IsNullOrEmpty(dateFrom) && DateTime.TryParse(dateFrom, out fromDate)) { }
//                 else fromDate = new DateTime(sessionYear, 3, 1);

//                 if (!string.IsNullOrEmpty(dateTo) && DateTime.TryParse(dateTo, out toDate)) { }
//                 else toDate = new DateTime(sessionYear + 1, 2, DateTime.IsLeapYear(sessionYear + 1) ? 29 : 28);

//                 var parameters = new[]
//                 {
//                     new SqlParameter("@SessionYear", SqlDbType.Int) { Value = sessionYear },
//                     new SqlParameter("@RegID", SqlDbType.Int) { Value = regId },
//                     new SqlParameter("@ClassID", SqlDbType.Int) { Value = classId },
//                     new SqlParameter("@SectionID", SqlDbType.Int) { Value = sectionId },
//                     new SqlParameter("@DateFrom", SqlDbType.Date) { Value = fromDate },
//                     new SqlParameter("@DateTo", SqlDbType.Date) { Value = toDate }
//                 };

//                 var rawData = await DbContext.PerformanceResults
//                     .FromSqlRaw("EXEC sp_rptStudentPerformance @SessionYear, @RegID, @ClassID, @SectionID, @DateFrom, @DateTo", parameters)
//                     .AsNoTracking()
//                     .ToListAsync();

//                 if (rawData == null || !rawData.Any())
//                 {
//                     return Ok(new { success = true, data = GetEmptyResponse() });
//                 }

//                 var firstRow = rawData.First();

//                 // Build categories
//                 var categories = rawData
//                     .GroupBy(x => new { x.PCategoryID, x.PCategoryName })
//                     .OrderBy(x => x.Key.PCategoryID)
//                     .Select(cat => new
//                     {
//                         categoryId = cat.Key.PCategoryID,
//                         categoryName = (cat.Key.PCategoryName ?? "").Trim(),
//                         totalMarks = cat.GroupBy(s => s.PSubCategoryID).Sum(g => g.First().TotalMarks),
//                         subCategories = cat.GroupBy(s => new { s.PSubCategoryID, s.PSubCategoryName })
//                             .OrderBy(s => s.Key.PSubCategoryID)
//                             .Select(sub => new
//                             {
//                                 subCategoryId = sub.Key.PSubCategoryID,
//                                 subCategoryName = (sub.Key.PSubCategoryName ?? "").Trim(),
//                                 totalMarks = sub.First().TotalMarks,
//                                 monthlyMarks = Enumerable.Range(1, 12).Select(m => new
//                                 {
//                                     month = m,
//                                     monthName = GetMonthName(m),
//                                     obtained = sub.Where(x => x.Month == m).Sum(x => x.Obtained)
//                                 }).ToList()
//                             }).ToList()
//                     }).ToList();

//                 // Monthly totals
//                 var monthlyTotals = Enumerable.Range(1, 12).Select(m =>
//                 {
//                     var monthData = rawData.Where(x => x.Month == m).ToList();
//                     var total = monthData.Sum(x => x.TotalMarks);
//                     var obtained = monthData.Sum(x => x.Obtained);
//                     return new
//                     {
//                         month = m,
//                         monthName = GetMonthName(m),
//                         totalMarks = total,
//                         obtainedMarks = obtained,
//                         percentage = total > 0 ? (int)Math.Round(((double)obtained / (double)total) * 100, 0) : 0
//                     };
//                 }).ToList();

//                 // Monthly remarks
//                 var monthlyRemarks = Enumerable.Range(1, 12).Select(m =>
//                 {
//                     var remark = rawData
//                         .Where(x => x.Month == m && !string.IsNullOrWhiteSpace(x.Remarks))
//                         .Select(x => x.Remarks.Trim())
//                         .FirstOrDefault();
//                     return new { month = m, monthName = GetMonthName(m), remarks = remark ?? "" };
//                 }).ToList();

//                 var overallObtained = rawData.Sum(x => (long)x.Obtained);
//                 var overallTotal = rawData.Sum(x => (long)x.TotalMarks);
//                 var overallPercentage = overallTotal > 0 ? Math.Round((overallObtained / (double)overallTotal) * 100, 2) : 0;

//                 return Ok(new
//                 {
//                     success = true,
//                     data = new
//                     {
//                         studentName = firstRow.StudentName ?? "",
//                         className = firstRow.Class_Name ?? "",
//                         section = firstRow.Section ?? "",
//                         campusName = firstRow.CampusName ?? "",
//                         image = firstRow.Image ?? "",
//                         sessionYear = firstRow.YearTitle ?? sessionYear.ToString(),
//                         overallObtained,
//                         overallTotal,
//                         overallPercentage,
//                         overallGrade = GetGrade(overallPercentage),
//                         categories,
//                         monthlyTotals,
//                         monthlyRemarks
//                     }
//                 });
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { success = false, message = ex.Message });
//             }
//         }

//         private string GetMonthName(int month) => month switch
//         {
//             1 => "Jan", 2 => "Feb", 3 => "Mar", 4 => "Apr",
//             5 => "May", 6 => "Jun", 7 => "Jul", 8 => "Aug",
//             9 => "Sep", 10 => "Oct", 11 => "Nov", 12 => "Dec",
//             _ => "Unknown"
//         };

//         private string GetGrade(double p) => p switch
//         {
//             >= 90 => "A+", >= 80 => "A", >= 70 => "B+",
//             >= 60 => "B", >= 50 => "C", >= 40 => "D",
//             _ => "F"
//         };

//         private object GetEmptyResponse() => new
//         {
//             studentName = "", className = "", section = "", campusName = "", image = "", sessionYear = "",
//             overallObtained = 0, overallTotal = 0, overallPercentage = 0, overallGrade = "N/A",
//             categories = new List<object>(),
//             monthlyTotals = Enumerable.Range(1, 12).Select(m => new { month = m, monthName = GetMonthName(m), totalMarks = 0, obtainedMarks = 0, percentage = 0 }).ToList(),
//             monthlyRemarks = Enumerable.Range(1, 12).Select(m => new { month = m, monthName = GetMonthName(m), remarks = "" }).ToList()
//         };
//     }
// }
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging; 
using school_management_Backend.Models;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PerformanceController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<PerformanceController> _logger;

        public PerformanceController(IConfiguration configuration, ILogger<PerformanceController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet("student-performance/{regId}")]
        public async Task<IActionResult> GetStudentPerformance(
            int regId,
            [FromQuery] int sessionYear,
            [FromQuery] int classId = 0,
            [FromQuery] int sectionId = 0,
            [FromQuery] string dateFrom = null,
            [FromQuery] string dateTo = null)
        {
            try
            {
                // ✅ Get database from token
                var currentDatabase = DatabaseResolver.GetCurrentDatabase();
                var databases = _configuration.GetSection("DatabaseConfig:Databases").Get<List<DatabaseConfig>>();
                var dbConfig = databases?.FirstOrDefault(d => d.Name == currentDatabase);
                string connectionString = dbConfig?.ConnectionString ?? _configuration.GetConnectionString("DefaultConnection");
                
                _logger.LogInformation($"📊 Using database: {currentDatabase ?? "Default"} for student performance");

                DateTime fromDate, toDate;
                
                if (!string.IsNullOrEmpty(dateFrom) && DateTime.TryParse(dateFrom, out fromDate)) { }
                else fromDate = new DateTime(sessionYear, 3, 1);

                if (!string.IsNullOrEmpty(dateTo) && DateTime.TryParse(dateTo, out toDate)) { }
                else toDate = new DateTime(sessionYear + 1, 2, DateTime.IsLeapYear(sessionYear + 1) ? 29 : 28);

                // ✅ Use dynamic connection string for raw SQL
                List<PerformanceResult> rawData = new List<PerformanceResult>();

                using (var connection = new SqlConnection(connectionString))
                {
                    using (var command = new SqlCommand("sp_rptStudentPerformance", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@SessionYear", sessionYear);
                        command.Parameters.AddWithValue("@RegID", regId);
                        command.Parameters.AddWithValue("@ClassID", classId);
                        command.Parameters.AddWithValue("@SectionID", sectionId);
                        command.Parameters.AddWithValue("@DateFrom", fromDate);
                        command.Parameters.AddWithValue("@DateTo", toDate);

                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new PerformanceResult
                                {
                                    PCategoryID = reader["PCategoryID"] != DBNull.Value ? Convert.ToInt32(reader["PCategoryID"]) : 0,
                                    PCategoryName = reader["PCategoryName"]?.ToString(),
                                    PSubCategoryID = reader["PSubCategoryID"] != DBNull.Value ? Convert.ToInt32(reader["PSubCategoryID"]) : 0,
                                    PSubCategoryName = reader["PSubCategoryName"]?.ToString(),
                                    Month = reader["Month"] != DBNull.Value ? Convert.ToInt32(reader["Month"]) : 0,
                                    TotalMarks = reader["TotalMarks"] != DBNull.Value ? Convert.ToDecimal(reader["TotalMarks"]) : 0,
                                    Obtained = reader["Obtained"] != DBNull.Value ? Convert.ToDecimal(reader["Obtained"]) : 0,
                                    Remarks = reader["Remarks"]?.ToString(),
                                    StudentName = reader["StudentName"]?.ToString(),
                                    Class_Name = reader["Class_Name"]?.ToString(),
                                    Section = reader["Section"]?.ToString(),
                                    CampusName = reader["CampusName"]?.ToString(),
                                    Image = reader["Image"]?.ToString(),
                                    YearTitle = reader["YearTitle"]?.ToString()
                                };
                                rawData.Add(item);
                            }
                        }
                    }
                }

                if (rawData == null || !rawData.Any())
                {
                    return Ok(new { success = true, data = GetEmptyResponse() });
                }

                var firstRow = rawData.First();

                // Build categories
                var categories = rawData
                    .GroupBy(x => new { x.PCategoryID, x.PCategoryName })
                    .OrderBy(x => x.Key.PCategoryID)
                    .Select(cat => new
                    {
                        categoryId = cat.Key.PCategoryID,
                        categoryName = (cat.Key.PCategoryName ?? "").Trim(),
                        totalMarks = cat.GroupBy(s => s.PSubCategoryID).Sum(g => g.First().TotalMarks),
                        subCategories = cat.GroupBy(s => new { s.PSubCategoryID, s.PSubCategoryName })
                            .OrderBy(s => s.Key.PSubCategoryID)
                            .Select(sub => new
                            {
                                subCategoryId = sub.Key.PSubCategoryID,
                                subCategoryName = (sub.Key.PSubCategoryName ?? "").Trim(),
                                totalMarks = sub.First().TotalMarks,
                                monthlyMarks = Enumerable.Range(1, 12).Select(m => new
                                {
                                    month = m,
                                    monthName = GetMonthName(m),
                                    obtained = sub.Where(x => x.Month == m).Sum(x => x.Obtained)
                                }).ToList()
                            }).ToList()
                    }).ToList();

                // Monthly totals
                var monthlyTotals = Enumerable.Range(1, 12).Select(m =>
                {
                    var monthData = rawData.Where(x => x.Month == m).ToList();
                    var total = monthData.Sum(x => x.TotalMarks);
                    var obtained = monthData.Sum(x => x.Obtained);
                    return new
                    {
                        month = m,
                        monthName = GetMonthName(m),
                        totalMarks = total,
                        obtainedMarks = obtained,
                        percentage = total > 0 ? (int)Math.Round(((double)obtained / (double)total) * 100, 0) : 0
                    };
                }).ToList();

                // Monthly remarks
                var monthlyRemarks = Enumerable.Range(1, 12).Select(m =>
                {
                    var remark = rawData
                        .Where(x => x.Month == m && !string.IsNullOrWhiteSpace(x.Remarks))
                        .Select(x => x.Remarks.Trim())
                        .FirstOrDefault();
                    return new { month = m, monthName = GetMonthName(m), remarks = remark ?? "" };
                }).ToList();

                var overallObtained = rawData.Sum(x => (long)x.Obtained);
                var overallTotal = rawData.Sum(x => (long)x.TotalMarks);
                var overallPercentage = overallTotal > 0 ? Math.Round((overallObtained / (double)overallTotal) * 100, 2) : 0;

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        studentName = firstRow.StudentName ?? "",
                        className = firstRow.Class_Name ?? "",
                        section = firstRow.Section ?? "",
                        campusName = firstRow.CampusName ?? "",
                        image = firstRow.Image ?? "",
                        sessionYear = firstRow.YearTitle ?? sessionYear.ToString(),
                        overallObtained,
                        overallTotal,
                        overallPercentage,
                        overallGrade = GetGrade(overallPercentage),
                        categories,
                        monthlyTotals,
                        monthlyRemarks
                    }
                });
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error getting student performance");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }





[HttpGet("session-years")]
public async Task<IActionResult> GetSessionYears()
{
    try
    {
        // ✅ Get the current database from token
        var currentDatabase = DatabaseResolver.GetCurrentDatabase();
        var databases = _configuration.GetSection("DatabaseConfig:Databases").Get<List<DatabaseConfig>>();
        var dbConfig = databases?.FirstOrDefault(d => d.Name == currentDatabase);
        
        _logger?.LogInformation($"📊 Using database: {currentDatabase ?? "Default"} for session years");

        // ✅ Get distinct session years with proper handling
        var sessionYears = await DbContext.tbl_PerformanceMasterStudent
            .Where(s => s.SessionYear.HasValue && s.SessionYear.Value > 2020 && s.SessionYear.Value < 2030)
            .Select(s => s.SessionYear.Value)
            .Distinct()
            .OrderByDescending(y => y)
            .ToListAsync();

        // ✅ If no valid session years found, return current year
        if (sessionYears == null || !sessionYears.Any())
        {
            var currentYear = DateTime.Now.Year;
            sessionYears = new List<int> { currentYear };
        }

        var result = sessionYears.Select(y => new { id = y, name = y.ToString() }).ToList();

        _logger?.LogInformation($"Found {result.Count} unique session years: {string.Join(", ", sessionYears)}");

        return Ok(new { success = true, data = result });
    }
    catch (Exception ex)
    {
        _logger?.LogError(ex, "Error getting session years");
        
        // ✅ Return current year on error
        var currentYear = DateTime.Now.Year;
        var defaultYears = new List<object> { new { id = currentYear, name = currentYear.ToString() } };
        
        return Ok(new { success = true, data = defaultYears });
    }
}
        private string GetMonthName(int month) => month switch
        {
            1 => "Jan", 2 => "Feb", 3 => "Mar", 4 => "Apr",
            5 => "May", 6 => "Jun", 7 => "Jul", 8 => "Aug",
            9 => "Sep", 10 => "Oct", 11 => "Nov", 12 => "Dec",
            _ => "Unknown"
        };

        private string GetGrade(double p) => p switch
        {
            >= 90 => "A+", >= 80 => "A", >= 70 => "B+",
            >= 60 => "B", >= 50 => "C", >= 40 => "D",
            _ => "F"
        };

        private object GetEmptyResponse() => new
        {
            studentName = "", className = "", section = "", campusName = "", image = "", sessionYear = "",
            overallObtained = 0, overallTotal = 0, overallPercentage = 0, overallGrade = "N/A",
            categories = new List<object>(),
            monthlyTotals = Enumerable.Range(1, 12).Select(m => new { month = m, monthName = GetMonthName(m), totalMarks = 0, obtainedMarks = 0, percentage = 0 }).ToList(),
            monthlyRemarks = Enumerable.Range(1, 12).Select(m => new { month = m, monthName = GetMonthName(m), remarks = "" }).ToList()
        };
    }

    // PerformanceResult class - make sure this matches your stored procedure output
    public class PerformanceResult
    {
        public int PCategoryID { get; set; }
        public string PCategoryName { get; set; }
        public int PSubCategoryID { get; set; }
        public string PSubCategoryName { get; set; }
        public int Month { get; set; }
        public decimal TotalMarks { get; set; }
        public decimal Obtained { get; set; }
        public string Remarks { get; set; }
        public string StudentName { get; set; }
        public string Class_Name { get; set; }
        public string Section { get; set; }
        public string CampusName { get; set; }
        public string Image { get; set; }
        public string YearTitle { get; set; }
    }
}