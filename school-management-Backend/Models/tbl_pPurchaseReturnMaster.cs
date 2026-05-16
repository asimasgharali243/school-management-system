using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_pPurchaseReturnMaster
{
    public int Invoice_No { get; set; }

    public int? Supplier_ID { get; set; }

    public string? VoucherNo { get; set; }

    public int? VNo { get; set; }

    public DateOnly? Date { get; set; }

    public string? Ref_No { get; set; }

    public string? Notes { get; set; }

    public int? CreditDays { get; set; }

    public decimal? Disc { get; set; }

    public decimal? TotalBill { get; set; }

    public decimal? TotalDiscount { get; set; }

    public decimal? TotalNetBill { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public int? CampusID { get; set; }

    public DateTime? ModifyDT { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_SubAccount? Supplier { get; set; }

    public virtual ICollection<tbl_pPurchaseReturnDetail> tbl_pPurchaseReturnDetail { get; set; } = new List<tbl_pPurchaseReturnDetail>();
}
