

namespace school_management_Backend.DTOs
{
    // Login Request
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Auth Response
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = new UserDto();
        public List<StudentDto> Children { get; set; } = new List<StudentDto>();
    }

    // User DTO
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public int? RoleID { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public int? CampusID { get; set; }
        public string CampusName { get; set; } = string.Empty;
        public string UserImage { get; set; } = string.Empty;
        public int? FamilyID { get; set; }
        public Dictionary<string, bool> Permissions { get; set; } = new Dictionary<string, bool>();
    }

    // Student DTO
    public class StudentDto
    {
        public int Reg_Id { get; set; }
        public long? Reg_No { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public int? Class_ID { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public int? Section_ID { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public string RollNo { get; set; } = string.Empty;
        public int? Family_Code { get; set; }
        public string CampusName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
         public int DiaryAccess { get; set; }
    }

    // Teacher Class DTO
    public class TeacherClassDto
    {
        public int ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public int? SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string SubjectCode { get; set; } = string.Empty;
    }

    // Student Attendance DTO
    public class StudentAttendanceDto
    {
        public int StudentId { get; set; }
        public string RollNo { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string FatherName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    // Attendance Record DTO
    public class AttendanceRecordDto
    {
        public int StudentId { get; set; }
        public string Status { get; set; } = string.Empty; // P = Present, A = Absent, L = Leave
        public string LateStatus { get; set; } = string.Empty; // OnTime, Late
        public string Remarks { get; set; } = string.Empty;
    }

    // Mark Attendance DTO
    public class MarkAttendanceDto
    {
        public int ClassId { get; set; }
        public int SectionId { get; set; }
        public List<AttendanceRecordDto> AttendanceRecords { get; set; } = new List<AttendanceRecordDto>();
        public string Remarks { get; set; } = string.Empty;
    }
}