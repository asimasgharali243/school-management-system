using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ReamsDefine
{
    public int Rid { get; set; }

    public int? ClassId { get; set; }

    public int? SessionId { get; set; }

    public string? Remarks { get; set; }

    public int? CampusId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? Reams { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_AcadmicYear? Session { get; set; }
}
