using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ItemMou
{
    public int Mou_ID { get; set; }

    public string? Mou_Name { get; set; }

    public string? Mou_NameUrdu { get; set; }

    public int? Created_By { get; set; }

    public DateTime? Creation_DateTime { get; set; }

    public int? Fiscal_Year { get; set; }

    public virtual ICollection<tbl_MaterialIssueDetail> tbl_MaterialIssueDetail { get; set; } = new List<tbl_MaterialIssueDetail>();

    public virtual ICollection<tbl_MaterialReceiveDetail> tbl_MaterialReceiveDetail { get; set; } = new List<tbl_MaterialReceiveDetail>();

    public virtual ICollection<tbl_POSDetail> tbl_POSDetail { get; set; } = new List<tbl_POSDetail>();
}
