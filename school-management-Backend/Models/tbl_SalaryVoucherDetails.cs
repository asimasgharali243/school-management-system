using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SalaryVoucherDetails
{
    public int ID { get; set; }

    public int? Entry_No { get; set; }

    public int? Emp_ID { get; set; }

    public double? Duty_Hours { get; set; }

    public double? GratuityPerc { get; set; }

    public double? PerDay_Salary { get; set; }

    public int? BasicSalary { get; set; }

    public int? Present { get; set; }

    public int? GrossSalary { get; set; }

    public int? Balance { get; set; }

    public int Allownce { get; set; }

    public int? Deduction { get; set; }

    public double? Gratuity { get; set; }

    public int? Other_Allownce { get; set; }

    public int? Net_Salary { get; set; }

    public virtual tbl_SalaryVoucherMaster? Entry_NoNavigation { get; set; }
}
