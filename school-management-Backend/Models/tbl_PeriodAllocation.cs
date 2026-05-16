using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PeriodAllocation
{
    public long AllocID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? PeriodID { get; set; }

    public int? WeekDay { get; set; }

    public int? TeacherID { get; set; }

    public int? SubjecID { get; set; }

    public int? GroupId { get; set; }

    public int? AllocMasterID { get; set; }

    public virtual tbl_PeriodAllocationMaster? AllocMaster { get; set; }

    public virtual tbl_Subject? Subjec { get; set; }

    public virtual tbl_Employee? Teacher { get; set; }
}
