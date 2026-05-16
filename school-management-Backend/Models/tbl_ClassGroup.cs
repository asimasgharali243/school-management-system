using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ClassGroup
{
    public int ClassGroupID { get; set; }

    public string? GroupName { get; set; }

    public bool? ClassGroupActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public virtual ICollection<tbl_AddClass> tbl_AddClass { get; set; } = new List<tbl_AddClass>();

    public virtual ICollection<tbl_Grade> tbl_Grade { get; set; } = new List<tbl_Grade>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMaster { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_ScheduleCalender> tbl_ScheduleCalender { get; set; } = new List<tbl_ScheduleCalender>();
}
