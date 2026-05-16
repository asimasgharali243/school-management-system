using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tblActivityCalendarDetail
{
    public long Id { get; set; }

    public long? CalendarID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public virtual tblActivityCalandar? Calendar { get; set; }
}
