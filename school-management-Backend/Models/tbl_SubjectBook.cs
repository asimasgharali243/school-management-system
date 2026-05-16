using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SubjectBook
{
    public int BookID { get; set; }

    public int? ClassID { get; set; }

    public int? SubjectID { get; set; }

    public string? Book { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public bool? Active { get; set; }

    public virtual ICollection<tbl_SubjectChapter> tbl_SubjectChapter { get; set; } = new List<tbl_SubjectChapter>();
}
