using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_feeStudentDetail
{
    public int ID { get; set; }

    public long mId { get; set; }

    public int? FundID { get; set; }

    public int? Fee { get; set; }

    public virtual tbl_Funds? Fund { get; set; }

    public virtual tbl_feeStudentMaster mIdNavigation { get; set; } = null!;
}
