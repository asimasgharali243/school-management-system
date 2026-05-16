using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Grade
{
    public int GradeID { get; set; }

    public int? CampusID { get; set; }

    public int? ClassGroupID { get; set; }

    public int? Grade_Percent { get; set; }

    public string? Grade { get; set; }

    public string? Remarks1 { get; set; }

    public string? RemarksMale { get; set; }

    public string? RemarksFemale { get; set; }

    public string? GradesImg { get; set; }

    public string? PositionImg { get; set; }

    public double? CGPA { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_ClassGroup? ClassGroup { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }
}
