using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Item
{
    public int Item_ID { get; set; }

    public string? Item_Type { get; set; }

    public string? Item_Code { get; set; }

    public string? ProductSr { get; set; }

    public string? Item_NameUrdu { get; set; }

    public string? Item_Name { get; set; }

    public int? Main_CategoryID { get; set; }

    public int? Category_ID { get; set; }

    public int? SubCategory_ID { get; set; }

    public decimal? MinStock { get; set; }

    public bool? Active { get; set; }

    public DateOnly? Date { get; set; }

    public int? UnitOfStoreID { get; set; }

    public int? UnitOfConsumptionID { get; set; }

    public int? UnitOfPurchaseID { get; set; }

    public int? SubAccountID { get; set; }

    public int? EOQ { get; set; }

    public string? Notes { get; set; }

    public int? StoreID { get; set; }

    public int? GlStockAccount { get; set; }

    public int? PcsPerBox { get; set; }

    public string? Place { get; set; }

    public bool? IsBook { get; set; }

    public string? Picture_Path { get; set; }

    public int? Created_By { get; set; }

    public DateTime? Creation_DateTime { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public double? OpeningQty { get; set; }

    public double? OpeningRate { get; set; }

    public int? OpeningUserID { get; set; }

    public DateTime? OpeningDT { get; set; }

    public DateOnly? OpeningDate { get; set; }

    public virtual tbl_ItemCategory? Category { get; set; }

    public virtual tbl_User? Created_ByNavigation { get; set; }

    public virtual tbl_ItemMainCategory? Main_Category { get; set; }

    public virtual tbl_AcadmicYear? SessionYearNavigation { get; set; }

    public virtual tbl_ItemSubCategory? SubCategory { get; set; }

    public virtual ICollection<tbl_ItemOpeningDetail> tbl_ItemOpeningDetail { get; set; } = new List<tbl_ItemOpeningDetail>();

    public virtual ICollection<tbl_MaterialIssueDetail> tbl_MaterialIssueDetail { get; set; } = new List<tbl_MaterialIssueDetail>();

    public virtual ICollection<tbl_MaterialReceiveDetail> tbl_MaterialReceiveDetail { get; set; } = new List<tbl_MaterialReceiveDetail>();

    public virtual ICollection<tbl_MaterialRequestDetail> tbl_MaterialRequestDetail { get; set; } = new List<tbl_MaterialRequestDetail>();

    public virtual ICollection<tbl_MaterialTransferDetail> tbl_MaterialTransferDetail { get; set; } = new List<tbl_MaterialTransferDetail>();

    public virtual ICollection<tbl_POSDetail> tbl_POSDetail { get; set; } = new List<tbl_POSDetail>();

    public virtual ICollection<tbl_ReamsReceive> tbl_ReamsReceive { get; set; } = new List<tbl_ReamsReceive>();

    public virtual ICollection<tbl_pPurchaseDetail> tbl_pPurchaseDetail { get; set; } = new List<tbl_pPurchaseDetail>();

    public virtual ICollection<tbl_pPurchaseOrderDetail> tbl_pPurchaseOrderDetail { get; set; } = new List<tbl_pPurchaseOrderDetail>();

    public virtual ICollection<tbl_pPurchaseReturnDetail> tbl_pPurchaseReturnDetail { get; set; } = new List<tbl_pPurchaseReturnDetail>();
}
