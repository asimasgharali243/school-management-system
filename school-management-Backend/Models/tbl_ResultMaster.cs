using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ResultMaster
{
    public int ResultID { get; set; }

    public int? ClassGroupID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? SubjectID { get; set; }

    public DateOnly? ExamDate { get; set; }

    public int? YearID { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public double? TotalMarks { get; set; }

    public double? PassingMarks { get; set; }

    public int? TeacherID { get; set; }

    public int? BatchID { get; set; }

    public virtual tbl_ResultBatch? Batch { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_ClassGroup? ClassGroup { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_AddSection? Section { get; set; }

    public virtual tbl_Subject? Subject { get; set; }

    public virtual tbl_Employee? Teacher { get; set; }

    public virtual tbl_AcadmicYear? Year { get; set; }

    public virtual ICollection<tbl_ResultEntry> tbl_ResultEntry { get; set; } = new List<tbl_ResultEntry>();
}
