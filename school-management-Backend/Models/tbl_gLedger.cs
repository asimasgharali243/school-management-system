using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_gLedger
{
    public int ID { get; set; }

    public DateOnly? Date { get; set; }

    public int LID4 { get; set; }

    public string? Description { get; set; }

    public double? Debit { get; set; }

    public double? Credit { get; set; }

    public int? SubAccID { get; set; }

    public int UID { get; set; }

    public string? Type { get; set; }

    public decimal? VNo { get; set; }

    public int? JvType { get; set; }

    public bool? IsPost { get; set; }
}
