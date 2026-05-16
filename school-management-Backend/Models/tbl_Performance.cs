using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Performance
{
    public long PID { get; set; }

    public DateOnly? Date { get; set; }

    public string? Remarks { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }
}
