using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ScheduleCalender
{
    public int SchID { get; set; }

    public DateOnly? Date { get; set; }

    public string? Description { get; set; }

    public bool? IsHoliday { get; set; }

    public bool? IsFullDay { get; set; }

    public string? ColorCode { get; set; }

    public int CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public bool? IsPerformed { get; set; }

    public string? PerformedNotes { get; set; }

    public int? ClassGroupID { get; set; }

    public virtual tbl_ClassGroup? ClassGroup { get; set; }
}
