using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_UserRights_Policy
{
    public int Id { get; set; }

    public int? UserID { get; set; }

    public int? DepartmentID { get; set; }
}
