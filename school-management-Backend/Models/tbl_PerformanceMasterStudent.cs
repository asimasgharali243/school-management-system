using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PerformanceMasterStudent
{
    public long PID { get; set; }

    public DateOnly? Date { get; set; }

    public int? ClassGroupID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? RegID { get; set; }

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

    public virtual ICollection<tbl_PerformanceDetailStudent> tbl_PerformanceDetailStudent { get; set; } = new List<tbl_PerformanceDetailStudent>();
}
