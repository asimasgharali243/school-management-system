using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PerformanceDetailStudent
{
    public long ID { get; set; }

    public long? PID { get; set; }

    public int? PSubCategoryID { get; set; }

    public int? TotalMarks { get; set; }

    public int? ObtainedMarks { get; set; }

    public virtual tbl_PerformanceMasterStudent? PIDNavigation { get; set; }
}
