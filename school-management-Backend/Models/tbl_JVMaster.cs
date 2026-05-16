using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_JVMaster
{
    public int JVMasterID { get; set; }

    public string? VoucherID { get; set; }

    public int? vNo { get; set; }

    public DateOnly? Date { get; set; }

    public int Type { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public decimal? TotalDebit { get; set; }

    public decimal? TotalCredit { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifiedByNavigation { get; set; }

    public virtual tbl_AcadmicYear? SessionYearNavigation { get; set; }

    public virtual ICollection<tbl_JVDetail> tbl_JVDetail { get; set; } = new List<tbl_JVDetail>();
}
