using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_MaterialRequestDetail
{
    public long ID { get; set; }

    public long? RequestID { get; set; }

    public int? ItemID { get; set; }

    public int? Quantity { get; set; }

    public bool? IsApproved { get; set; }

    public int? ApproveQuantity { get; set; }

    public int? Approvedby { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public virtual tbl_Item? Item { get; set; }

    public virtual tbl_MaterialRequestMaster? Request { get; set; }
}
