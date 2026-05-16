using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_UserRole
{
    public int ID { get; set; }

    public string? Role { get; set; }

    public virtual ICollection<tbl_User> tbl_User { get; set; } = new List<tbl_User>();
}
