using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PolicySOPDetail
{
    public long ID { get; set; }

    public long? PSID { get; set; }

    public int? Department_ID { get; set; }

    public virtual tbl_PolicySOPMaster? PS { get; set; }
}
