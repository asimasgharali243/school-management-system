using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ToDoGeneralScheduleStatus
{
    public long ID { get; set; }

    public long? ToDoMasterID { get; set; }

    public string? ToDo { get; set; }

    public string? TimeDuration { get; set; }

    public string? Status { get; set; }

    public string? Reason { get; set; }

    public virtual tbl_ToDoMaster? ToDoMaster { get; set; }
}
