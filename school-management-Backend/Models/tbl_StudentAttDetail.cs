using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_StudentAttDetail
{
    public long Id { get; set; }

    public int? MasterId { get; set; }

    public int? RegID { get; set; }

    public string? Status { get; set; }

    public string? LateStatus { get; set; }

    public string? Remarks { get; set; }

    public bool? Is_Manual { get; set; }

    public bool? SmsSend { get; set; }

    public DateTime? SmsDT { get; set; }

    public virtual tbl_StudentAttMaster? Master { get; set; }

    public virtual tbl_StudentRegistration? Reg { get; set; }
}
