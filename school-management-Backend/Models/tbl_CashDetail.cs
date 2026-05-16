using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_CashDetail
{
    public int ID { get; set; }

    public int? Level4ID { get; set; }

    public int? EmployeeID { get; set; }

    public int? SubAccID { get; set; }

    public string? Narration { get; set; }

    public string? RectNo { get; set; }

    public decimal? Amount { get; set; }

    public int CashMasterID { get; set; }

    public string? Typ { get; set; }

    public int? CampID { get; set; }

    public virtual tbl_Campus? Camp { get; set; }

    public virtual tbl_CashMaster CashMaster { get; set; } = null!;

    public virtual tbl_Employee? Employee { get; set; }

    public virtual tbl_Level4? Level4 { get; set; }

    public virtual tbl_SubAccount? SubAcc { get; set; }
}
