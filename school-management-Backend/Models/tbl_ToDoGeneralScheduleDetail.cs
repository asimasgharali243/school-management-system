using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ToDoGeneralScheduleDetail
{
    public long ID { get; set; }

    public long? ToDoGenSchID { get; set; }

    public string? ToDo { get; set; }

    public string? TimeDuration { get; set; }

    public virtual tbl_ToDoGeneralScheduleMaster? ToDoGenSch { get; set; }
}
