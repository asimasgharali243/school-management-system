using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tblActivityCalandar
{
    public long CalendarID { get; set; }

    public string? Title { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool? IsHoliday { get; set; }

    public string? Description { get; set; }

    public int? CampusID { get; set; }

    public int? AcadYear { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public virtual ICollection<tblActivityCalendarDetail> tblActivityCalendarDetail { get; set; } = new List<tblActivityCalendarDetail>();
}
