using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ItemSubCategory
{
    public int SubCategory_ID { get; set; }

    public string? SubCategory_Name { get; set; }

    public string? SubCategory_NameInUrdu { get; set; }

    public bool? Active { get; set; }

    public int? Category_ID { get; set; }

    public int? MainCategoryID { get; set; }

    public int? Created_By { get; set; }

    public DateTime? Creation_DateTime { get; set; }

    public string? ColorName { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual tbl_ItemCategory? Category { get; set; }

    public virtual tbl_ItemMainCategory? MainCategory { get; set; }

    public virtual ICollection<tbl_Item> tbl_Item { get; set; } = new List<tbl_Item>();
}
