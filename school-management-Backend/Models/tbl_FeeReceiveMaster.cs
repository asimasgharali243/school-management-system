using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_FeeReceiveMaster
{
    public int Receipt_ID { get; set; }

    public int? RegID { get; set; }

    public long? VoucherID { get; set; }

    public string? VoucherNo { get; set; }

    public DateOnly? Date { get; set; }

    public int? FamilyCode { get; set; }

    public string? RefNo { get; set; }

    public int? TotalFee { get; set; }

    public int? TotalReceived { get; set; }

    public int? TotalDiscount { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifiyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public string? PaymentMode { get; set; }

    public int? LID4 { get; set; }

    public string? Notes { get; set; }

    public string? ChallanNo { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public string? fbrInvoiceNo { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Level4? LID4Navigation { get; set; }

    public virtual tbl_User? ModifiyByNavigation { get; set; }

    public virtual tbl_StudentRegistration? Reg { get; set; }

    public virtual ICollection<tbl_FeeReceiveDetail> tbl_FeeReceiveDetail { get; set; } = new List<tbl_FeeReceiveDetail>();
}
