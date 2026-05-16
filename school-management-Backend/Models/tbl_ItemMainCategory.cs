using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_ItemMainCategory
{
    public int MainCategory_ID { get; set; }

    public string? MainCategory_Name { get; set; }

    public string? MainCategory_NameInUrdu { get; set; }

    public string? Type { get; set; }

    public bool? Active { get; set; }

    public int? Created_By { get; set; }

    public DateTime? Creation_DateTime { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual ICollection<tbl_Item> tbl_Item { get; set; } = new List<tbl_Item>();

    public virtual ICollection<tbl_ItemCategory> tbl_ItemCategory { get; set; } = new List<tbl_ItemCategory>();

    public virtual ICollection<tbl_ItemSubCategory> tbl_ItemSubCategory { get; set; } = new List<tbl_ItemSubCategory>();
}
