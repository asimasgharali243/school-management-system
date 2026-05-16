using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_BankMaster
{
    public int BankMasterID { get; set; }

    public string? VoucherID { get; set; }

    public int? vNo { get; set; }

    public DateOnly? Date { get; set; }

    public DateOnly? PostDate { get; set; }

    public int Level4ID { get; set; }

    public string? ByName { get; set; }

    public string? ChqNo { get; set; }

    public int? Type { get; set; }

    public string? DocType { get; set; }

    public string? PartyBank { get; set; }

    public string BankType { get; set; } = null!;

    public int? Fiscal_year { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public decimal? TotalAmount { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Level4 Level4 { get; set; } = null!;

    public virtual tbl_User? ModifiedByNavigation { get; set; }

    public virtual tbl_AcadmicYear? SessionYearNavigation { get; set; }

    public virtual ICollection<tbl_BankDetail> tbl_BankDetail { get; set; } = new List<tbl_BankDetail>();
}
