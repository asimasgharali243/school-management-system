using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AddClass
{
    public int Class_ID { get; set; }

    public string? School { get; set; }

    public string? Class_Name { get; set; }

    public bool? Active { get; set; }

    public int? sort_by { get; set; }

    public bool? isHifz { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? Fee { get; set; }

    public int? ClassGroupID { get; set; }

    public int? TimeTableGroupID { get; set; }

    public virtual tbl_ClassGroup? ClassGroup { get; set; }
    public virtual tbl_Campus? Campus { get; set; }

    public virtual ICollection<tbl_ClassWiseSubject> tbl_ClassWiseSubject { get; set; } = new List<tbl_ClassWiseSubject>();

    public virtual ICollection<tbl_EmployeeSubject> tbl_EmployeeSubject { get; set; } = new List<tbl_EmployeeSubject>();

    public virtual ICollection<tbl_ReamsDefine> tbl_ReamsDefine { get; set; } = new List<tbl_ReamsDefine>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMaster { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_StudentAttMaster> tbl_StudentAttMaster { get; set; } = new List<tbl_StudentAttMaster>();

    public virtual ICollection<tbl_StudentRegistration> tbl_StudentRegistration { get; set; } = new List<tbl_StudentRegistration>();

    public virtual ICollection<tbl_SubjectChapter> tbl_SubjectChapter { get; set; } = new List<tbl_SubjectChapter>();

    public virtual ICollection<tbl_TargetFeeCollection> tbl_TargetFeeCollection { get; set; } = new List<tbl_TargetFeeCollection>();

    public virtual ICollection<tbl_ToDoScheduleDetail> tbl_ToDoScheduleDetail { get; set; } = new List<tbl_ToDoScheduleDetail>();

    public virtual ICollection<tbl_ToDoScheduleStatus> tbl_ToDoScheduleStatus { get; set; } = new List<tbl_ToDoScheduleStatus>();

 public virtual ICollection<tbl_ClassDiary> tbl_ClassDiaries { get; set; } = new List<tbl_ClassDiary>();
}
