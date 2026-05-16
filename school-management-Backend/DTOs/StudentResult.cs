

// DTOs/GradeDTOs.cs
namespace school_management_Backend.DTOs
{
    public class ChildGradeDto
    {
        public int Id { get; set; }
        public int ResultId { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string SubjectCode { get; set; } = string.Empty;
        public string ExamDate { get; set; } = string.Empty;
        public string ExamType { get; set; } = string.Empty;
        public string BatchName { get; set; } = string.Empty;
        public double TotalMarks { get; set; }
        public double ObtainedMarks { get; set; }
        public double PassingMarks { get; set; }
        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public int RollNo { get; set; }
        public string RegNo { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public double Percentage { get; set; }
        public string Grade { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
    }

    public class GradeStatsDto
    {
        public double AveragePercentage { get; set; }
        public int TotalExams { get; set; }
        public double HighestScore { get; set; }
        public double LowestScore { get; set; }
        public double AverageScore { get; set; }
        public int TotalSubjects { get; set; }
        public string Improvement { get; set; } = string.Empty;
        public double Gpa { get; set; }
        public double PassRate { get; set; }
        public List<SubjectPerformanceDto> SubjectPerformance { get; set; } = new();
        public List<TrendDataDto> PerformanceTrend { get; set; } = new();
    }

    public class SubjectPerformanceDto
    {
        public string SubjectName { get; set; } = string.Empty;
        public double AveragePercentage { get; set; }
        public string BestGrade { get; set; } = string.Empty;
        public int TotalExams { get; set; }
        public double HighestMarks { get; set; }
        public double LowestMarks { get; set; }
    }

    public class SubjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string ColorCode { get; set; } = string.Empty;
    }

    public class ExamBatchDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int ExamId { get; set; }
        public bool Active { get; set; }
    }

    public class AcademicYearDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class TrendDataDto
    {
        public string Label { get; set; } = string.Empty;
        public double Value { get; set; }
    }

    public class GradeFilters
    {
        public int? SubjectId { get; set; }
        public int? BatchId { get; set; }
        public int? YearId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Error { get; set; }
        public string? Message { get; set; }

        public static ApiResponse<T> CreateSuccess(T data, string? message = null) => 
            new() { Success = true, Data = data, Message = message };
        
        public static ApiResponse<T> CreateError(string error) => 
            new() { Success = false, Error = error };
    }
}