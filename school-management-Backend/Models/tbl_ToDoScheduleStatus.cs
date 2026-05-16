using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ToDoScheduleStatus
{
    public long ID { get; set; }

    public long? ToDoMasterID { get; set; }

    public int? TeacherID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public string? ToDo { get; set; }

    public string? TimeDuration { get; set; }

    public string? Status { get; set; }

    public string? Reason { get; set; }

    public string? Remarks { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_AddSection? Section { get; set; }

    public virtual tbl_Employee? Teacher { get; set; }

    public virtual tbl_ToDoMaster? ToDoMaster { get; set; }
}
