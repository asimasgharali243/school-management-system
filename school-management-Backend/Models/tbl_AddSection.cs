using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AddSection
{
    public int ID { get; set; }

    public string? Section { get; set; }

    public int? Class_ID { get; set; }

    public int? Fee { get; set; }

    public bool? Active { get; set; }

    public int? ClassInchargeID { get; set; }

    public int? CoordinatorID { get; set; }

    public int? Male_Seat { get; set; }

    public int? Female_Seat { get; set; }

    public int? Class_Incharg_ID { get; set; }

    public string? Section_Gender { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? sortby { get; set; }

    public virtual ICollection<tbl_EmployeeSubject> tbl_EmployeeSubject { get; set; } = new List<tbl_EmployeeSubject>();

    public virtual ICollection<tbl_FeePosting> tbl_FeePosting { get; set; } = new List<tbl_FeePosting>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMaster { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_StudentAttMaster> tbl_StudentAttMaster { get; set; } = new List<tbl_StudentAttMaster>();

    public virtual ICollection<tbl_StudentRegistration> tbl_StudentRegistration { get; set; } = new List<tbl_StudentRegistration>();

    public virtual ICollection<tbl_ToDoScheduleDetail> tbl_ToDoScheduleDetail { get; set; } = new List<tbl_ToDoScheduleDetail>();

    public virtual ICollection<tbl_ToDoScheduleStatus> tbl_ToDoScheduleStatus { get; set; } = new List<tbl_ToDoScheduleStatus>();
public virtual ICollection<tbl_ClassDiary> tbl_ClassDiaries { get; set; } = new List<tbl_ClassDiary>();
}
