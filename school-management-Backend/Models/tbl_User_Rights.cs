using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_User_Rights
{
    public int ID { get; set; }

    public int? FormID { get; set; }

    public int UID { get; set; }

    public bool? New { get; set; }

    public bool? Edit { get; set; }

    public bool? View { get; set; }

    public bool? Delete { get; set; }

    public bool? Print { get; set; }

    public bool? BackDate { get; set; }

    public int? RoleID { get; set; }

    public virtual tbl_UserForm? Form { get; set; }
}
