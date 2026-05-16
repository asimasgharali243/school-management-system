using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PerformanceDetailEmp
{
    public long ID { get; set; }

    public long? PIDE { get; set; }

    public int? PSubCategoryID { get; set; }

    public int? TotalMarks { get; set; }

    public int? ObtainedMarks { get; set; }

    public virtual tbl_PerformanceMasterEmp? PIDENavigation { get; set; }
}
