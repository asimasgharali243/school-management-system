using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_InquiryMaster
{
    public long InquiryID { get; set; }

    public int? InquiryNo { get; set; }

    public DateOnly? InquiryDate { get; set; }

    public string? VisitorName { get; set; }

    public string? VisitorMobile1 { get; set; }

    public string? VisitorMobile2 { get; set; }

    public string? VisitorPhone { get; set; }

    public string? VisitorEmail { get; set; }

    public int? AreaID { get; set; }

    public string? VOC { get; set; }

    public string? WeOffer { get; set; }

    public string? Status { get; set; }

    public string? ReferBy { get; set; }

    public string? CancelReason { get; set; }

    public string? CancelResonNotes { get; set; }

    public DateOnly? CancelDate { get; set; }

    public bool? SmsSend { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public virtual ICollection<tbl_InquiryDetail> tbl_InquiryDetail { get; set; } = new List<tbl_InquiryDetail>();
}
