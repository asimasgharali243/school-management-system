using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_QuestionBank
{
    public int QuestionID { get; set; }

    public string? Title { get; set; }

    public string? Type { get; set; }

    public int? Marks { get; set; }

    public int? ClassID { get; set; }

    public int? SubjectID { get; set; }

    public int? BookID { get; set; }

    public int? ChapterID { get; set; }

    public int? ClassGroupID { get; set; }

    public string? Option1 { get; set; }

    public string? Option2 { get; set; }

    public string? Option3 { get; set; }

    public string? Option4 { get; set; }

    public string? Media { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? SessionYear { get; set; }
}
