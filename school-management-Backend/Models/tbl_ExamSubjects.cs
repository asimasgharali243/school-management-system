using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ExamSubjects
{
    public int ID { get; set; }

    public int? Class_Code { get; set; }

    public string? Subject_Codes { get; set; }
}
