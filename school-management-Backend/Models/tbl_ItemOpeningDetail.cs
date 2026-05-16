using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ItemOpeningDetail
{
    public int ID { get; set; }

    public int? OpeningID { get; set; }

    public int? Item_ID { get; set; }

    public decimal? Qty { get; set; }

    public decimal? Rate { get; set; }

    public int? Amount { get; set; }

    public int? StoreID { get; set; }

    public virtual tbl_Item? Item { get; set; }

    public virtual tbl_ItemOpening? Opening { get; set; }
}
