using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Level3
{
    public int ID { get; set; }

    public int LID2 { get; set; }

    public string? LID3 { get; set; }

    public string? Title3 { get; set; }

    public virtual tbl_Level2 LID2Navigation { get; set; } = null!;

    public virtual ICollection<tbl_Level4> tbl_Level4 { get; set; } = new List<tbl_Level4>();
}
