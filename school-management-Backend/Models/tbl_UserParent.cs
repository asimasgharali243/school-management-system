using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_UserParent
{
    public int UserID { get; set; }

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public string? UserImg { get; set; }

    public bool? Status { get; set; }

    public int? FamilyID { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreateDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public string? OTP { get; set; }
}
