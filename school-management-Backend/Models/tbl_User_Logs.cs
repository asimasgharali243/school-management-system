using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_User_Logs
{
    public int ID { get; set; }

    public int UID { get; set; }

    public DateTime? DateTime { get; set; }

    public string? VoucherNo { get; set; }

    public string? FormName { get; set; }

    public string? Action { get; set; }
}
