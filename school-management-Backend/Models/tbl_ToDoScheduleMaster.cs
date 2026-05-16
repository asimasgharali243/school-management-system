using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ToDoScheduleMaster
{
    public long ToDoID { get; set; }

    public int? EmployeeCode { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual tbl_Employee? EmployeeCodeNavigation { get; set; }

    public virtual ICollection<tbl_ToDoScheduleDetail> tbl_ToDoScheduleDetail { get; set; } = new List<tbl_ToDoScheduleDetail>();
}
