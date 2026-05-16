using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_InputGrade
{
    public int ID { get; set; }

    public int? GradeID { get; set; }

    public int? Reg_ID { get; set; }

    public int? YearID { get; set; }

    public int? ExamID { get; set; }

    public double? Percent { get; set; }
}
