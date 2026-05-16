using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_UserRightsCampus
{
    public int ID { get; set; }

    public int? UserID { get; set; }

    public string? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public virtual tbl_User? User { get; set; }
}
