using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ResultEntry
{
    public int ID { get; set; }

    public int? RollNo { get; set; }

    public int? Reg_Id { get; set; }

    public string? Reg_No { get; set; }

    public string? Name { get; set; }

    public double? ObtainedMarks { get; set; }

    public int? ResultID { get; set; }

    public virtual tbl_ResultMaster? Result { get; set; }
}
