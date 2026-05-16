using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class vw_Stock
{
    public long ID { get; set; }

    public int? VoucherID { get; set; }

    public DateOnly? Date { get; set; }

    public string RefNo { get; set; } = null!;

    public int? Item_ID { get; set; }

    public decimal? QtyIn { get; set; }

    public int? QtyOut { get; set; }

    public decimal? AmountIn { get; set; }

    public int AmountOut { get; set; }

    public decimal? Rate { get; set; }

    public int? StoreID { get; set; }

    public int? Main_CategoryID { get; set; }

    public int? Category_ID { get; set; }

    public int? SubCategory_ID { get; set; }

    public int SubAccountID { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }
}
