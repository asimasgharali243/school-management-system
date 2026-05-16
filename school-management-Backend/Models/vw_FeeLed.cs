using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class vw_FeeLed
{
    public int ID { get; set; }

    public int? Reg_ID { get; set; }

    public DateOnly? Date { get; set; }

    public int? Debit { get; set; }

    public int? Credit { get; set; }

    public string? Remarks { get; set; }

    public string? Type { get; set; }

    public string? FeeMonth { get; set; }

    public string? FeeYear { get; set; }

    public int? SessionYear { get; set; }

    public int? FundID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? CampusID { get; set; }

    public long? VoucherID { get; set; }

    public int? Discount { get; set; }

    public string? InvoiceNo { get; set; }

    public string? ChallanNo { get; set; }

    public int? FamilyCode { get; set; }
}
