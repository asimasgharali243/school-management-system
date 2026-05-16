using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_FeePosting
{
    public int ID { get; set; }

    public int? Reg_ID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public DateOnly? IssueDate { get; set; }

    public DateOnly? DueDate { get; set; }

    public int? FundID { get; set; }

    public int? Amount { get; set; }

    public int? Fine { get; set; }

    public long? VoucherID { get; set; }

    public string? ChallanNo { get; set; }

    public string? Remarks { get; set; }

    public string? Type { get; set; }

    public string? FeeMonth { get; set; }

    public string? FeeYear { get; set; }

    public int? SessionYear { get; set; }

    public string? CommandType { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Funds? Fund { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_StudentRegistration? Reg { get; set; }

    public virtual tbl_AddSection? Section { get; set; }
}
