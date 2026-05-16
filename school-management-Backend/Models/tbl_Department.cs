using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Department
{
    public int Department_ID { get; set; }

    public string? Department_Name { get; set; }

    public bool? Department_Active { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public DateTime? TimeStart { get; set; }

    public DateTime? TimeEnd { get; set; }

    public int? salaryLID4 { get; set; }

    public virtual tbl_Level4? salaryLID4Navigation { get; set; }

    public virtual ICollection<tbl_Employee> tbl_Employee { get; set; } = new List<tbl_Employee>();
}
