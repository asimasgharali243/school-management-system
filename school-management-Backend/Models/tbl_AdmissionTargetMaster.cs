using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AdmissionTargetMaster
{
    public int TargetID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public virtual ICollection<tbl_AdmissionTargetDetail> tbl_AdmissionTargetDetail { get; set; } = new List<tbl_AdmissionTargetDetail>();
}
