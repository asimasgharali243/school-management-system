using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Employee
{
    public int Employee_Code { get; set; }

    public string? Employee_Name { get; set; }

    public string? Father_Name { get; set; }

    public string? Present_Address { get; set; }

    public string? Permanent_Address { get; set; }

    public int? Department_ID { get; set; }

    public int? Designation_ID { get; set; }

    public string? Phone { get; set; }

    public string? Mobile { get; set; }

    public string? Emergency_Contact { get; set; }

    public string? CNIC { get; set; }

    public string? Email { get; set; }

    public string? Blood_Group { get; set; }

    public DateTime? InTime { get; set; }

    public DateTime? OutTime { get; set; }

    public int? ExpectedSalary { get; set; }

    public decimal? Salary { get; set; }

    public int? Duty_Hours { get; set; }

    public string? Marital_Status { get; set; }

    public string? Religion { get; set; }

    public string? Gender { get; set; }

    public string? FatherOccupation { get; set; }

    public string? TravelDistance { get; set; }

    public DateOnly? DoB { get; set; }

    public DateOnly? Joining_Date { get; set; }

    public DateOnly? WeddingDate { get; set; }

    public string? OnlineTeamId { get; set; }

    public string? Thumb_ID { get; set; }

    public string? Sick_Leve { get; set; }

    public string? Special_Leve { get; set; }

    public int? Casual_Leve { get; set; }

    public bool? Active { get; set; }

    public string? VerifiedBy { get; set; }

    public string? ApprovedBy { get; set; }

    public string? Personality { get; set; }

    public string? Confidance { get; set; }

    public string? Locality { get; set; }

    public string? Trained_Untrained { get; set; }

    public string? CNICPdf { get; set; }

    public string? EducationalDocumentsPdf { get; set; }

    public string? ExperienceLetterPdf { get; set; }

    public string? EmployeeImg { get; set; }

    public string? CVPdf { get; set; }

    public DateOnly? Leaving_Date { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public int? Allownce { get; set; }

    public string? AllownceCategory { get; set; }

    public double? GratuityPerc { get; set; }

    public int? advsalary_LID4 { get; set; }

    public string? LeftStatus { get; set; }

    public DateOnly? LeftDate { get; set; }

    public string? LeftRemarks { get; set; }

    public int? Liability_LID4 { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_Department? Department { get; set; }

    public virtual tbl_Designation? Designation { get; set; }

    public virtual tbl_Level4? Liability_LID4Navigation { get; set; }

    public virtual tbl_Level4? advsalary_LID4Navigation { get; set; }

    public virtual ICollection<tbl_AttendanceDetail> tbl_AttendanceDetail { get; set; } = new List<tbl_AttendanceDetail>();

    public virtual ICollection<tbl_BankDetail> tbl_BankDetail { get; set; } = new List<tbl_BankDetail>();

    public virtual ICollection<tbl_CashDetail> tbl_CashDetail { get; set; } = new List<tbl_CashDetail>();

    public virtual ICollection<tbl_EmployeeExperience> tbl_EmployeeExperience { get; set; } = new List<tbl_EmployeeExperience>();

    public virtual ICollection<tbl_EmployeeFacility> tbl_EmployeeFacility { get; set; } = new List<tbl_EmployeeFacility>();

    public virtual ICollection<tbl_EmployeeIncrement> tbl_EmployeeIncrement { get; set; } = new List<tbl_EmployeeIncrement>();

    public virtual ICollection<tbl_EmployeeQualification> tbl_EmployeeQualification { get; set; } = new List<tbl_EmployeeQualification>();

    public virtual ICollection<tbl_EmployeeReference> tbl_EmployeeReference { get; set; } = new List<tbl_EmployeeReference>();

    public virtual ICollection<tbl_EmployeeSubject> tbl_EmployeeSubject { get; set; } = new List<tbl_EmployeeSubject>();

    public virtual ICollection<tbl_JVDetail> tbl_JVDetail { get; set; } = new List<tbl_JVDetail>();

    public virtual ICollection<tbl_MaterialIssueMaster> tbl_MaterialIssueMaster { get; set; } = new List<tbl_MaterialIssueMaster>();

    public virtual ICollection<tbl_MaterialRequestMaster> tbl_MaterialRequestMaster { get; set; } = new List<tbl_MaterialRequestMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMaster { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_PeriodAllocation> tbl_PeriodAllocation { get; set; } = new List<tbl_PeriodAllocation>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMaster { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_ToDoScheduleDetail> tbl_ToDoScheduleDetail { get; set; } = new List<tbl_ToDoScheduleDetail>();

    public virtual ICollection<tbl_ToDoScheduleMaster> tbl_ToDoScheduleMaster { get; set; } = new List<tbl_ToDoScheduleMaster>();

    public virtual ICollection<tbl_ToDoScheduleStatus> tbl_ToDoScheduleStatus { get; set; } = new List<tbl_ToDoScheduleStatus>();

    public virtual ICollection<tbl_User> tbl_User { get; set; } = new List<tbl_User>();
}
