using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class vw_gledgerUnionGLBatch
{
    public int ID { get; set; }

    public DateOnly? Date { get; set; }

    public string? VoucherID { get; set; }

    public string? Notes { get; set; }

    public int? LID4 { get; set; }

    public int? SubAccount_ID { get; set; }

    public int? StudentID { get; set; }

    public int? EmployeeID { get; set; }

    public decimal? Debit { get; set; }

    public decimal? Credit { get; set; }

    public int? WO { get; set; }

    public DateTime? CreatedDT { get; set; }

    public string Type { get; set; } = null!;

    public bool? IsApproved { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public string RefNo { get; set; } = null!;

    public string? AcType { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }
}
