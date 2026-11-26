using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace school_management_Backend.DTOs
{
    [Keyless]
    public class PerformanceResult
    {
        public int? Month { get; set; }
        public int? Obtained { get; set; }        // ⭐ Changed from decimal to int
        public int? TotalMarks { get; set; }       // ⭐ Changed from decimal to int
        public int? PCategoryID { get; set; }
        public string? PCategoryName { get; set; }
        public int? PSubCategoryID { get; set; }
        public string? Remarks { get; set; }
        public string? PSubCategoryName { get; set; }
        public string? CampusName { get; set; }
        public string? StudentName { get; set; }
        public string? Class_Name { get; set; }
        public string? Section { get; set; }
        public string? Image { get; set; }
        public string? YearTitle { get; set; }
    }
}