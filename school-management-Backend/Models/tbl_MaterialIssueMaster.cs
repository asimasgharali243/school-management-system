using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_MaterialIssueMaster
{
    public long IssueID { get; set; }

    public DateOnly? IssueDate { get; set; }

    public long RequestID { get; set; }

    public int? TeacherID { get; set; }

    public int? StudentID { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_StudentRegistration? Student { get; set; }

    public virtual tbl_Employee? Teacher { get; set; }

    public virtual ICollection<tbl_MaterialIssueDetail> tbl_MaterialIssueDetail { get; set; } = new List<tbl_MaterialIssueDetail>();
}
