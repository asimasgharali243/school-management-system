using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_LibBookIssueDetail
{
    public long ID { get; set; }

    public long? LibBookIssueID { get; set; }

    public long? LibBookID { get; set; }

    public DateOnly? ReceiveBackDate { get; set; }

    public string? ReceivedBy { get; set; }

    public bool? IsRecieved { get; set; }

    public DateOnly? ReceivedDate { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public bool? IsLost { get; set; }

    public string? LostNotes { get; set; }

    public virtual tbl_LibBookIssueMaster? LibBookIssue { get; set; }
}
