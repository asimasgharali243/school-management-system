using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_EmployeeReference
{
    public int ID { get; set; }

    public int? EmpCode { get; set; }

    public string? RefName { get; set; }

    public string? RefContactNo { get; set; }

    public string? RefAddress { get; set; }

    public virtual tbl_Employee? EmpCodeNavigation { get; set; }
}
