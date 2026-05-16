using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Family_Code
{
    public int Family_ID { get; set; }

    public string? Father_Name { get; set; }

    public string? CNIC { get; set; }

    public int? SessionYearID { get; set; }

    public int? CampusId { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? UserImg { get; set; }

    public bool? LoginStatus { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public string? Mobile1_SMS { get; set; }

    public string? Mobile2_SMS { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }
}
