using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class Temp_SingleResult
{
    public int? Reg_Id { get; set; }

    public int? Reg_No { get; set; }

    public int? ExamID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? SubjectID { get; set; }

    public int? Total_Marks { get; set; }

    public int? Passing_Marks { get; set; }

    public string? Obtained_Marks { get; set; }

    public int? Position { get; set; }

    public string? Grade { get; set; }

    public int? Percentage { get; set; }

    public string? Attendence { get; set; }

    public string? Remarks { get; set; }

    public string? RemarksMale { get; set; }

    public string? RemarksfeMale { get; set; }
}
