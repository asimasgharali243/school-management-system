using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_MaterialReceiveMaster
{
    public long ReceiveID { get; set; }

    public int? VendorID { get; set; }

    public DateOnly? ReceiveDate { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_SubAccount? Vendor { get; set; }

    public virtual ICollection<tbl_MaterialReceiveDetail> tbl_MaterialReceiveDetail { get; set; } = new List<tbl_MaterialReceiveDetail>();

    public virtual ICollection<tbl_pPurchaseMaster> tbl_pPurchaseMaster { get; set; } = new List<tbl_pPurchaseMaster>();
}
