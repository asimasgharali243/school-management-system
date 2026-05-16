using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Designation
{
    public int Designation_ID { get; set; }

    public string? Designation_Name { get; set; }

    public bool? Designation_Active { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public virtual ICollection<tbl_Employee> tbl_Employee { get; set; } = new List<tbl_Employee>();
}
