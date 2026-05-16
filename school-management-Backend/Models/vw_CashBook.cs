using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class vw_CashBook
{
    public string? VoucherID { get; set; }

    public int? MasterLID4 { get; set; }

    public int? vNo { get; set; }

    public DateOnly? Date { get; set; }

    public string Type { get; set; } = null!;

    public int? Level4ID { get; set; }

    public int? SubAccID { get; set; }

    public int? EmployeeID { get; set; }

    public int? StudentID { get; set; }

    public string? Narration { get; set; }

    public string? RectNo { get; set; }

    public decimal? AmountIn { get; set; }

    public decimal? AmountOut { get; set; }

    public string IsPost { get; set; } = null!;

    public int? CampusID { get; set; }

    public string? AcType { get; set; }
}
