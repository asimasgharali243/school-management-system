using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_UserForm
{
    public int ID { get; set; }

    public string Name { get; set; } = null!;

    public string? Display_Name { get; set; }

    public string? FormType { get; set; }

    public int? sort_order { get; set; }

    public bool? isPublished { get; set; }

    public virtual ICollection<tbl_User_Rights> tbl_User_Rights { get; set; } = new List<tbl_User_Rights>();
}
