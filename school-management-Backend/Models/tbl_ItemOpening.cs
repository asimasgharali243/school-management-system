using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ItemOpening
{
    public int OpeningID { get; set; }

    public int? VoucherID { get; set; }

    public DateOnly? Date { get; set; }

    public string? Remarks { get; set; }

    public decimal? TotalAmount { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual ICollection<tbl_ItemOpeningDetail> tbl_ItemOpeningDetail { get; set; } = new List<tbl_ItemOpeningDetail>();
}
