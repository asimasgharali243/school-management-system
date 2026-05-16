using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_subjectGroup
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? ClassID { get; set; }

    public string? SubjectIDs { get; set; }

    public int? CampusID { get; set; }

    public virtual ICollection<tbl_StudentRegistration> tbl_StudentRegistration { get; set; } = new List<tbl_StudentRegistration>();
}
