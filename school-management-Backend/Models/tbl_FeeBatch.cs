using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_FeeBatch
{
    public int Batch_ID { get; set; }

    public string? Batch_Period { get; set; }

    public DateOnly? Issue_Date { get; set; }

    public DateOnly? Due_Date { get; set; }

    public int? Fine { get; set; }
}
