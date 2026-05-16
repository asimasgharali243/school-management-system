using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Funds
{
    public int FundID { get; set; }

    public string? FundName { get; set; }

    public string? FeeCycle { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? LID4 { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Level4? LID4Navigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual ICollection<tbl_FeePosting> tbl_FeePosting { get; set; } = new List<tbl_FeePosting>();

    public virtual ICollection<tbl_FeeReceiveDetail> tbl_FeeReceiveDetail { get; set; } = new List<tbl_FeeReceiveDetail>();

    public virtual ICollection<tbl_feeStudentDetail> tbl_feeStudentDetail { get; set; } = new List<tbl_feeStudentDetail>();
}
