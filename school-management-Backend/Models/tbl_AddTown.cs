using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AddTown
{
    public int ID { get; set; }

    public string? Town { get; set; }

    public bool? Active { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public virtual ICollection<tbl_StudentRegistration> tbl_StudentRegistration { get; set; } = new List<tbl_StudentRegistration>();
}
