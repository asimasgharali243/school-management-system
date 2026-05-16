using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_EmployeeQualification
{
    public int ID { get; set; }

    public int Employee_Code { get; set; }

    public string? Board_University { get; set; }

    public string? Grade { get; set; }

    public string? Marks { get; set; }

    public int? Year { get; set; }

    public string? Remarks { get; set; }

    public int? DegreeID { get; set; }

    public virtual tbl_Employee Employee_CodeNavigation { get; set; } = null!;
}
