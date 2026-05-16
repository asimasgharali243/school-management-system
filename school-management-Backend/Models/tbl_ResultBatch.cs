using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ResultBatch
{
    public int BatchID { get; set; }

    public string? Type { get; set; }

    public int? ExamID { get; set; }

    public string? BatchName { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public bool? Active { get; set; }

    public int? CampusID { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Exams? Exam { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMaster { get; set; } = new List<tbl_ResultMaster>();
}
