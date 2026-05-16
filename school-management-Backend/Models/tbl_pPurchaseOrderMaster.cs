using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_pPurchaseOrderMaster
{
    public int Order_ID { get; set; }

    public int? Supplier_ID { get; set; }

    public DateOnly? Date { get; set; }

    public long? VNo { get; set; }

    public string? VoucherNo { get; set; }

    public string? PType { get; set; }

    public decimal? Discount { get; set; }

    public decimal? Tax { get; set; }

    public string? Notes { get; set; }

    public string? MOP { get; set; }

    public int? Fiscal_Year { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public int? CampusID { get; set; }

    public bool? IsClose { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_SubAccount? Supplier { get; set; }

    public virtual ICollection<tbl_pPurchaseOrderDetail> tbl_pPurchaseOrderDetail { get; set; } = new List<tbl_pPurchaseOrderDetail>();
}
