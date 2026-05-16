using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_LibBookIssueMaster
{
    public long LibBookIssueID { get; set; }

    public int? StudentID { get; set; }

    public int? EmployeeCode { get; set; }

    public DateOnly? IssueDate { get; set; }

    public string? IssueBy { get; set; }

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

    public virtual ICollection<tbl_LibBookIssueDetail> tbl_LibBookIssueDetail { get; set; } = new List<tbl_LibBookIssueDetail>();
}
