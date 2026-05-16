using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_MaterialTransferMaster
{
    public long TransferID { get; set; }

    public int? VoucherID { get; set; }

    public DateOnly? Date { get; set; }

    public string? Notes { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual ICollection<tbl_MaterialTransferDetail> tbl_MaterialTransferDetail { get; set; } = new List<tbl_MaterialTransferDetail>();
}
