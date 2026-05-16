using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Level2
{
    public int? LID1 { get; set; }

    public string? LID2 { get; set; }

    public string? Title2 { get; set; }

    public int ID { get; set; }

    public virtual tbl_Level1? LID1Navigation { get; set; }

    public virtual ICollection<tbl_Level3> tbl_Level3 { get; set; } = new List<tbl_Level3>();
}
