using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AttendanceDetail
{
    public long Id { get; set; }

    public int? MasterId { get; set; }

    public int? EmployeeId { get; set; }

    public DateTime? TimeIn { get; set; }

    public DateTime? TimeOut { get; set; }

    public string? Status { get; set; }

    public string? Remarks { get; set; }

    public bool? Is_Manual { get; set; }

    public virtual tbl_Employee? Employee { get; set; }

    public virtual tbl_Attendence? Master { get; set; }
}
