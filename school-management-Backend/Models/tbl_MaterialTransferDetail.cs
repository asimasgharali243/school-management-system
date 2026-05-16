using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_MaterialTransferDetail
{
    public long Id { get; set; }

    public long? TransferID { get; set; }

    public int? ItemID { get; set; }

    public int? StoreIDFrom { get; set; }

    public int? StoreIDTo { get; set; }

    public int? Qty { get; set; }

    public virtual tbl_Item? Item { get; set; }

    public virtual tbl_Store? StoreIDFromNavigation { get; set; }

    public virtual tbl_Store? StoreIDToNavigation { get; set; }

    public virtual tbl_MaterialTransferMaster? Transfer { get; set; }
}
