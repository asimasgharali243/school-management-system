using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SubjectChapter
{
    public long ChapterID { get; set; }

    public int? ChapterNo { get; set; }

    public string? ChapterName { get; set; }

    public int? SubjectID { get; set; }

    public int? ClassID { get; set; }

    public int? BookID { get; set; }

    public bool? Active { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusId { get; set; }

    public int? SessionYear { get; set; }

    public virtual tbl_SubjectBook? Book { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_Subject? Subject { get; set; }
}
