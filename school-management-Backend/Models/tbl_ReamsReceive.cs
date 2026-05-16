using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ReamsReceive
{
    public int RecId { get; set; }

    public long? VoucherId { get; set; }

    public DateOnly? Date { get; set; }

    public int? RegID { get; set; }

    public int? SessionId { get; set; }

    public int? RecQty { get; set; }

    public int? WO { get; set; }

    public string? Remarks { get; set; }

    public int? Item_ID { get; set; }

    public int? StoreID { get; set; }

    public int? CampusId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Item? Item { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_StudentRegistration? Reg { get; set; }

    public virtual tbl_AcadmicYear? Session { get; set; }

    public virtual tbl_Store? Store { get; set; }
}
