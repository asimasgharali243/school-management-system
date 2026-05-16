using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ChapterTopic
{
    public long TopicID { get; set; }

    public int? TopicNo { get; set; }

    public string? TopicName { get; set; }

    public int? ClassID { get; set; }

    public int? BookID { get; set; }

    public int? SubjectID { get; set; }

    public int? ChapterID { get; set; }

    public bool? Active { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }
}
