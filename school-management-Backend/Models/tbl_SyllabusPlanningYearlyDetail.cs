using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SyllabusPlanningYearlyDetail
{
    public long ID { get; set; }

    public long? sowID { get; set; }

    public int? BookID { get; set; }

    public long? ChapterID { get; set; }

    public int? TopicID { get; set; }

    public virtual tbl_SyllabusPlanningYearly? sow { get; set; }
}
