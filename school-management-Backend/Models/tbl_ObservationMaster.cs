using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ObservationMaster
{
    public long ObvID { get; set; }

    public int? ClassID { get; set; }

    public int? TeacherID { get; set; }

    public int? SubjectID { get; set; }

    public DateOnly? Date { get; set; }

    public string? Strengths { get; set; }

    public string? AreaToImprove { get; set; }

    public string? TeacherComments { get; set; }

    public int? OverAllRating { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public int? SectionID { get; set; }

    public int? TotalMarks { get; set; }

    public int? ObtainedMarks { get; set; }

    public virtual ICollection<tbl_ObservationDetail> tbl_ObservationDetail { get; set; } = new List<tbl_ObservationDetail>();
}
