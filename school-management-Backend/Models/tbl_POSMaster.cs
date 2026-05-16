using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_POSMaster
{
    public int Invoice_No { get; set; }

    public string? Typ { get; set; }

    public int? VendorID { get; set; }

    public int? EmployeeID { get; set; }

    public int? Level4ID { get; set; }

    public int? StudentID { get; set; }

    public long? VNo { get; set; }

    public string? VoucherNo { get; set; }

    public DateOnly? Date { get; set; }

    public string? Ref_No { get; set; }

    public int? CreditDays { get; set; }

    public string? Notes { get; set; }

    public decimal? DiscPerc { get; set; }

    public decimal? DiscAmt { get; set; }

    public decimal? TotalBill { get; set; }

    public decimal? TotalNetBill { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public string? PaymentMode { get; set; }

    public int? CashReceived { get; set; }

    public int? CashAcID { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_Level4? CashAc { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Employee? Employee { get; set; }

    public virtual tbl_Level4? Level4 { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_StudentRegistration? Student { get; set; }

    public virtual tbl_SubAccount? Vendor { get; set; }

    public virtual ICollection<tbl_POSDetail> tbl_POSDetail { get; set; } = new List<tbl_POSDetail>();
}
