using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Subject
{
    public int Subject_Id { get; set; }

    public string? Subject_Name { get; set; }

    public string? Level { get; set; }

    public int Total_Marks { get; set; }

    public int? Passing_Marks { get; set; }

    public string? SubjectCode { get; set; }

    public string? SubjectCode2 { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public string? ColorCode { get; set; }

    public virtual ICollection<tbl_ClassWiseSubject> tbl_ClassWiseSubject { get; set; } = new List<tbl_ClassWiseSubject>();

    public virtual ICollection<tbl_EmployeeSubject> tbl_EmployeeSubject { get; set; } = new List<tbl_EmployeeSubject>();

    public virtual ICollection<tbl_PeriodAllocation> tbl_PeriodAllocation { get; set; } = new List<tbl_PeriodAllocation>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMaster { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_SubjectChapter> tbl_SubjectChapter { get; set; } = new List<tbl_SubjectChapter>();
    public virtual ICollection<tbl_ClassDiary> tbl_ClassDiaries { get; set; } = new List<tbl_ClassDiary>();

}
