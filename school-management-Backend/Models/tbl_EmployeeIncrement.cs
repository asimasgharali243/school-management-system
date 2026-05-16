using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_EmployeeIncrement
{
    public int Id { get; set; }

    public int? vNo { get; set; }

    public string? VoucherID { get; set; }

    public DateOnly? Date { get; set; }

    public int? Employee_Code { get; set; }

    public int? PreviousSalary { get; set; }

    public int? IncrmentAmount { get; set; }

    public int? CurrentSalary { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

    public virtual tbl_User? ApprovedByNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_Employee? Employee_CodeNavigation { get; set; }

    public virtual tbl_User? ModifiedByNavigation { get; set; }
}
