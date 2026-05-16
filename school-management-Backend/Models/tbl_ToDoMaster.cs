using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ToDoMaster
{
    public long ToDoMasterID { get; set; }

    public int? EmployeeCode { get; set; }

    public DateOnly? Date { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<tbl_ToDoGeneralScheduleStatus> tbl_ToDoGeneralScheduleStatus { get; set; } = new List<tbl_ToDoGeneralScheduleStatus>();

    public virtual ICollection<tbl_ToDoScheduleStatus> tbl_ToDoScheduleStatus { get; set; } = new List<tbl_ToDoScheduleStatus>();
}
