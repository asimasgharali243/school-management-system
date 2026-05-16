using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_InputPosition
{
    public int ID { get; set; }

    public int? Position { get; set; }

    public int? Reg_ID { get; set; }

    public int? YearID { get; set; }

    public int? ExamID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }
}
