using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_TargetFeeCollection
{
    public int Id { get; set; }

    public string? VoucherNo { get; set; }

    public DateOnly? EntryDate { get; set; }

    public string? Notes { get; set; }

    public int? ClassID { get; set; }

    public int? CountStudent { get; set; }

    public long? AnnualFundBalance { get; set; }

    public long? FeeBalance { get; set; }

    public long? TransportBalance { get; set; }

    public long? AnnualFundTarget { get; set; }

    public long? FeeTarget { get; set; }

    public long? TransportTarget { get; set; }

    public string? Month { get; set; }

    public int? Year { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public long? CMonthFee { get; set; }

    public long? CMonthAnnual { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }
}
