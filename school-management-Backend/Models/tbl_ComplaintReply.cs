using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ComplaintReply
{
    public long ReplyID { get; set; }

    public long? ComplainID { get; set; }

    public string? Remarks { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual tbl_Complaint? Complain { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }
}
