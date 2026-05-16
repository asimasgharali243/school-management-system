using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tblDiary
{
    public long DiaryID { get; set; }

    public DateOnly? Date { get; set; }

    public int? SubjectID { get; set; }

    public int? EmployeeID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public bool? Status { get; set; }

    public string? Details { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }
}
