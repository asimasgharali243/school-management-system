using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Exams
{
    public int ExamID { get; set; }

    public string? ExamTitle { get; set; }

    public int? YearID { get; set; }

    public int? SortOrderNo { get; set; }

    public string? Type { get; set; }

    public bool? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public virtual ICollection<tbl_ResultBatch> tbl_ResultBatch { get; set; } = new List<tbl_ResultBatch>();
}
