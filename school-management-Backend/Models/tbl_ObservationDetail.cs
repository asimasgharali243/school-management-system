using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ObservationDetail
{
    public long ID { get; set; }

    public long? ObvID { get; set; }

    public int? PCategoryID { get; set; }

    public int? PSubCategoryID { get; set; }

    public int? ObtMarks { get; set; }

    public virtual tbl_ObservationMaster? Obv { get; set; }

    public virtual tbl_PerformanceCategory? PCategory { get; set; }

    public virtual tbl_PerformanceSubCategory? PSubCategory { get; set; }
}
