using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class vw_gledger
{
    public int LID1 { get; set; }

    public string? Title1 { get; set; }

    public string? LID2 { get; set; }

    public string? Title2 { get; set; }

    public string? LID3 { get; set; }

    public string? Title3 { get; set; }

    public int LID4 { get; set; }

    public string? Titlle4 { get; set; }

    public int ID { get; set; }

    public int? StudentID { get; set; }

    public int? EmployeeID { get; set; }

    public int? SubAccount_ID { get; set; }

    public DateOnly? Date { get; set; }

    public string? Notes { get; set; }

    public decimal? Debit { get; set; }

    public decimal? Credit { get; set; }

    public string Type { get; set; } = null!;

    public int? LID5Code { get; set; }

    public string? Titlle5 { get; set; }

    public string? VoucherID { get; set; }
}
