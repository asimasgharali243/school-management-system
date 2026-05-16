using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_EmployeeExperience
{
    public int ID { get; set; }

    public int? Employee_Code { get; set; }

    public string? Description { get; set; }

    public string? Institiute { get; set; }

    public string? Duration { get; set; }

    public virtual tbl_Employee? Employee_CodeNavigation { get; set; }
}
