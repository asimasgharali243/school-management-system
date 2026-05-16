using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ClassWiseSubject
{
    public int ID { get; set; }

    public int? ClassID { get; set; }

    public int? SubjectID { get; set; }

    public bool? Active { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SubjectHeadID { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_Subject? Subject { get; set; }
}
