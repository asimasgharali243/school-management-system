using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Company
{
    public int ID { get; set; }

    public string? Company { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? Mobile { get; set; }

    public string? Fax { get; set; }

    public string? WebSite { get; set; }

    public string? Email { get; set; }

    public string? LogoPath { get; set; }

    public string? LogoPath2 { get; set; }
}
