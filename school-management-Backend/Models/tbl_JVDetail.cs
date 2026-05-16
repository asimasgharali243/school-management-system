using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_JVDetail
{
    public int ID { get; set; }

    public int? Level4ID { get; set; }

    public int? EmployeeID { get; set; }

    public int? SubAccID { get; set; }

    public string? Narration { get; set; }

    public string? RectNo { get; set; }

    public decimal? Debit { get; set; }

    public decimal? Credit { get; set; }

    public int JVMasterID { get; set; }

    public string? Type { get; set; }

    public int? CampID { get; set; }

    public virtual tbl_Campus? Camp { get; set; }

    public virtual tbl_Employee? Employee { get; set; }

    public virtual tbl_JVMaster JVMaster { get; set; } = null!;

    public virtual tbl_Level4? Level4 { get; set; }

    public virtual tbl_SubAccount? SubAcc { get; set; }
}
