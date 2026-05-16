using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SalaryVoucherMaster
{
    public int ID { get; set; }

    public DateOnly? Entry_Date { get; set; }

    public long? VoucherID { get; set; }

    public string? VoucherNo { get; set; }

    public string? Month { get; set; }

    public int? Year { get; set; }

    public int? CampusID { get; set; }

    public string? Days_In_Month { get; set; }

    public int? TotalBasic { get; set; }

    public int? TotalGross { get; set; }

    public int? TotalDeduction { get; set; }

    public int? TotalAllowance { get; set; }

    public int? TotalGratuity { get; set; }

    public int? TotalNetPayable { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? PostBy { get; set; }

    public DateTime? PostDT { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual tbl_User? PostByNavigation { get; set; }

    public virtual ICollection<tbl_SalaryVoucherDetails> tbl_SalaryVoucherDetails { get; set; } = new List<tbl_SalaryVoucherDetails>();
}
