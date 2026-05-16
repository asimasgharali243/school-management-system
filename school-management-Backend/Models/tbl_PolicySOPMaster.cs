using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PolicySOPMaster
{
    public long PSID { get; set; }

    public string? Type { get; set; }

    public string? Code { get; set; }

    public string? Number { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateOnly? ImplementDate { get; set; }

    public bool? Active { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public string? FileAttach { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual ICollection<tbl_PolicySOPDetail> tbl_PolicySOPDetail { get; set; } = new List<tbl_PolicySOPDetail>();
}
