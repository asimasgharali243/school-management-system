using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_StudentAndClassroomPsychoDetail2
{
    public long ID { get; set; }

    public long? AssessID { get; set; }

    public int? RegID { get; set; }

    public virtual tbl_StudentAndClassroomPsychoMaster? Assess { get; set; }

    public virtual tbl_StudentRegistration? Reg { get; set; }
}
