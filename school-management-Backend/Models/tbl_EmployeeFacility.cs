using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_EmployeeFacility
{
    public int ID { get; set; }

    public int? Employee_Code { get; set; }

    public string? Facility { get; set; }

    public string? Value { get; set; }

    public virtual tbl_Employee? Employee_CodeNavigation { get; set; }
}
