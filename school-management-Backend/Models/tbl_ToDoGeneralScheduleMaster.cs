using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ToDoGeneralScheduleMaster
{
    public long ToDoGenSchID { get; set; }

    public int? EmployeeCode { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public string? GeneralNotes { get; set; }

    public string? Attachment { get; set; }

    public int? Designation_ID { get; set; }

    public virtual ICollection<tbl_ToDoGeneralScheduleDetail> tbl_ToDoGeneralScheduleDetail { get; set; } = new List<tbl_ToDoGeneralScheduleDetail>();
}
