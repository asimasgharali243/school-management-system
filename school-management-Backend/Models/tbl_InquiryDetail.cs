using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_InquiryDetail
{
    public long ID { get; set; }

    public long? InquiryID { get; set; }

    public int? ClassID { get; set; }

    public int? StudentQty { get; set; }

    public int? ParentsDemand { get; set; }

    public int? SchoolOffer { get; set; }

    public int? FeeDone { get; set; }

    public virtual tbl_InquiryMaster? Inquiry { get; set; }
}
