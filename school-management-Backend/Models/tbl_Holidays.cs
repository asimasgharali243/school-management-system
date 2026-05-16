using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Holidays
{
    public int ID { get; set; }

    public DateOnly? Holiday_Date { get; set; }

    public string? Holiday_For { get; set; }
}
