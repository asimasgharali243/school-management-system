using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_EmployeeSubject
{
    public int ID { get; set; }

    public int? Employee_Code { get; set; }

    public int? Subject_Id { get; set; }

    public int? Class_ID { get; set; }

    public int? Section_ID { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_Employee? Employee_CodeNavigation { get; set; }

    public virtual tbl_AddSection? Section { get; set; }

    public virtual tbl_Subject? Subject { get; set; }
}
