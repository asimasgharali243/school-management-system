using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PeriodAllocationMaster
{
    public int AllocMasterID { get; set; }

    public string? Title { get; set; }

    public int? PeriodsID { get; set; }

    public TimeOnly? TimeFrom { get; set; }

    public TimeOnly? TimeTo { get; set; }

    public DateOnly? DateFrom { get; set; }

    public DateOnly? DateTo { get; set; }

    public int? TimeTableGroupID { get; set; }

    public int? Periods { get; set; }

    public int? DurationMin { get; set; }

    public int? BreakPeriodAfter { get; set; }

    public int? BreakMin { get; set; }

    public int? AssemblyDuration { get; set; }

    public bool? Active { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual ICollection<tbl_PeriodAllocation> tbl_PeriodAllocation { get; set; } = new List<tbl_PeriodAllocation>();
}
