using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PerformanceMasterEmp
{
    public long PIDE { get; set; }

    public int? EmployeeCode { get; set; }

    public DateOnly? Date { get; set; }

    public string? Remarks { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public int? TotalMarks { get; set; }

    public int? ObtainedMarks { get; set; }

    public double? ObtainPercent { get; set; }

    public virtual ICollection<tbl_PerformanceDetailEmp> tbl_PerformanceDetailEmp { get; set; } = new List<tbl_PerformanceDetailEmp>();
}
