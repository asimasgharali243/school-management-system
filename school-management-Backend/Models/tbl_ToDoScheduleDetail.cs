using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ToDoScheduleDetail
{
    public long ID { get; set; }

    public long? ToDoID { get; set; }

    public DateOnly? Date { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? TeacherID { get; set; }

    public string? Duration { get; set; }

    public string? PeriodNo { get; set; }

    public string? WorkType { get; set; }

    public string? Remarks { get; set; }

    public int? SubjectID { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_AddSection? Section { get; set; }

    public virtual tbl_Employee? Teacher { get; set; }

    public virtual tbl_ToDoScheduleMaster? ToDo { get; set; }
}
