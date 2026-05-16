using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_pPurchaseReturnDetail
{
    public int ID { get; set; }

    public int? Item_ID { get; set; }

    public decimal? Discount { get; set; }

    public decimal? Qty { get; set; }

    public decimal? Rate { get; set; }

    public int? Invoice_No { get; set; }

    public int? MouID { get; set; }

    public virtual tbl_pPurchaseReturnMaster? Invoice_NoNavigation { get; set; }

    public virtual tbl_Item? Item { get; set; }
}
