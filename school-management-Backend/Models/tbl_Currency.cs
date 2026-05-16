using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Currency
{
    public int Currency_ID { get; set; }

    public string? Currency { get; set; }

    public bool? IsChoice { get; set; }
}
