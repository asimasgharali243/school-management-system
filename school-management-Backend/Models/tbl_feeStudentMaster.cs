using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_feeStudentMaster
{
    public long mId { get; set; }

    public int? Reg_ID { get; set; }

    public DateOnly? FeeStartingDate { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public int? FamilyCode { get; set; }

    public string? Notes { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_StudentRegistration? Reg { get; set; }

    public virtual tbl_AcadmicYear? SessionYearNavigation { get; set; }

    public virtual ICollection<tbl_feeStudentDetail> tbl_feeStudentDetail { get; set; } = new List<tbl_feeStudentDetail>();
}
