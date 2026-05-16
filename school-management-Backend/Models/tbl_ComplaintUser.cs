using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ComplaintUser
{
    public long ID { get; set; }

    public long? ComplainID { get; set; }

    public int? UserID { get; set; }

    public virtual tbl_Complaint? Complain { get; set; }
}
