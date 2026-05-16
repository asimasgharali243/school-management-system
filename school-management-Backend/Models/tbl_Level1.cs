using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Level1
{
    public int LID1 { get; set; }

    public string? Title1 { get; set; }

    public virtual ICollection<tbl_Level2> tbl_Level2 { get; set; } = new List<tbl_Level2>();
}
