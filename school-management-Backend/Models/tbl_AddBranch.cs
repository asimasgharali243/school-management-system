using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AddBranch
{
    public int Branch_ID { get; set; }

    public string? Branch_Name { get; set; }

    public string? Address { get; set; }

    public int? City_ID { get; set; }

    public string? Phone { get; set; }

    public string? Contact_Person { get; set; }

    public string? Mobile { get; set; }
}
