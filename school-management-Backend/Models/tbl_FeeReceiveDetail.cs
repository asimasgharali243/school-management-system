using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_FeeReceiveDetail
{
    public int ID { get; set; }

    public int Receipt_ID { get; set; }

    public string? VoucherNo { get; set; }

    public int? Fee { get; set; }

    public int? Discount { get; set; }

    public int? Received { get; set; }

    public string? FeeMonth { get; set; }

    public string? FeeYear { get; set; }

    public int? FundID { get; set; }

    public int? Fine { get; set; }

    public string? Challan_No { get; set; }

    public string? Remarks { get; set; }

    public virtual tbl_Funds? Fund { get; set; }

    public virtual tbl_FeeReceiveMaster Receipt { get; set; } = null!;
}
