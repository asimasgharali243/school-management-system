using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_StudentFollowup
{
    public long Id { get; set; }

    public long? VoucherID { get; set; }

    public int? Reg_ID { get; set; }

    public DateOnly? Date { get; set; }

    public string? Remarks { get; set; }

    public DateOnly? ComittmentDate { get; set; }

    public string? fType { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_StudentRegistration? Reg { get; set; }
}
