using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Store
{
    public int StoreID { get; set; }

    public string? StoreCode { get; set; }

    public string? StoreName { get; set; }

    public bool? Active { get; set; }

    public string? StoreNameUrdu { get; set; }

    public int? Created_By { get; set; }

    public DateTime? Creation_DateTime { get; set; }

    public int? SessionYear { get; set; }

    public virtual ICollection<tbl_MaterialIssueDetail> tbl_MaterialIssueDetail { get; set; } = new List<tbl_MaterialIssueDetail>();

    public virtual ICollection<tbl_MaterialReceiveDetail> tbl_MaterialReceiveDetail { get; set; } = new List<tbl_MaterialReceiveDetail>();

    public virtual ICollection<tbl_MaterialTransferDetail> tbl_MaterialTransferDetailStoreIDFromNavigation { get; set; } = new List<tbl_MaterialTransferDetail>();

    public virtual ICollection<tbl_MaterialTransferDetail> tbl_MaterialTransferDetailStoreIDToNavigation { get; set; } = new List<tbl_MaterialTransferDetail>();

    public virtual ICollection<tbl_POSDetail> tbl_POSDetail { get; set; } = new List<tbl_POSDetail>();

    public virtual ICollection<tbl_ReamsReceive> tbl_ReamsReceive { get; set; } = new List<tbl_ReamsReceive>();
}
