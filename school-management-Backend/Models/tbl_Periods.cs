using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Periods
{
    public int PeriodID { get; set; }

    public string? PeriodsTitle { get; set; }

    public int? VoucherID { get; set; }

    public int? PeriodNo { get; set; }

    public int? Minutes { get; set; }

    public int? WeekDay { get; set; }

    public int? GroupID { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }
}
