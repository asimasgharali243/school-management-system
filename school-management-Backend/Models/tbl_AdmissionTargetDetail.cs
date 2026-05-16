using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AdmissionTargetDetail
{
    public int ID { get; set; }

    public int? TargetID { get; set; }

    public int? ForMonth { get; set; }

    public int? ForYear { get; set; }

    public int? CampusID { get; set; }

    public int? TargetQty { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_AdmissionTargetMaster? Target { get; set; }
}
