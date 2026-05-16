using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_MaterialIssueDetail
{
    public long ID { get; set; }

    public long? IssueID { get; set; }

    public int? ItemID { get; set; }

    public int? Quantity { get; set; }

    public int? StoreID { get; set; }

    public int? MouID { get; set; }

    public virtual tbl_MaterialIssueMaster? Issue { get; set; }

    public virtual tbl_Item? Item { get; set; }

    public virtual tbl_ItemMou? Mou { get; set; }

    public virtual tbl_Store? Store { get; set; }
}
