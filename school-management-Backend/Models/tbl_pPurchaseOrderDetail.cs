using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_pPurchaseOrderDetail
{
    public int ID { get; set; }

    public int? Item_ID { get; set; }

    public decimal? Qty { get; set; }

    public decimal? Rate { get; set; }

    public decimal? Disc { get; set; }

    public int? Order_ID { get; set; }

    public int? MouID { get; set; }

    public virtual tbl_Item? Item { get; set; }

    public virtual tbl_pPurchaseOrderMaster? Order { get; set; }
}
