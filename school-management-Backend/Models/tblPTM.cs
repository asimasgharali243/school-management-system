using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tblPTM
{
    public long PTMID { get; set; }

    public string? Title { get; set; }

    public DateOnly? PTMDate { get; set; }

    public long? RoomID { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public string? Description { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? CreatedBy { get; set; }

    public int? CreatedDT { get; set; }

    public int? ModifiedBy { get; set; }

    public int? ModifiedDT { get; set; }
}
