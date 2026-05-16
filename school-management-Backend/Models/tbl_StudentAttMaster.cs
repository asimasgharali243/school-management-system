using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_StudentAttMaster
{
    public int ID { get; set; }

    public DateOnly? AttDate { get; set; }

    public long? vNo { get; set; }

    public string? VoucherID { get; set; }

    public string? Type { get; set; }

    public string? Remarks { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_AddSection? Section { get; set; }

    public virtual ICollection<tbl_StudentAttDetail> tbl_StudentAttDetail { get; set; } = new List<tbl_StudentAttDetail>();
}
