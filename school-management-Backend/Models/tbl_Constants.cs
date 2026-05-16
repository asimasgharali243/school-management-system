using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Constants
{
    public int ID { get; set; }

    public string? Type { get; set; }

    public int? WhereID { get; set; }

    public int? CampusID { get; set; }
}
