using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Level4
{
    public int ID { get; set; }

    public int LID3 { get; set; }

    public string? LID4 { get; set; }

    public string? Titlle4 { get; set; }

    public string? Type { get; set; }

    public virtual tbl_Level3 LID3Navigation { get; set; } = null!;

    public virtual ICollection<tbl_BankDetail> tbl_BankDetail { get; set; } = new List<tbl_BankDetail>();

    public virtual ICollection<tbl_BankMaster> tbl_BankMaster { get; set; } = new List<tbl_BankMaster>();

    public virtual ICollection<tbl_CashDetail> tbl_CashDetail { get; set; } = new List<tbl_CashDetail>();

    public virtual ICollection<tbl_CashMaster> tbl_CashMaster { get; set; } = new List<tbl_CashMaster>();

    public virtual ICollection<tbl_Department> tbl_Department { get; set; } = new List<tbl_Department>();

    public virtual ICollection<tbl_Employee> tbl_EmployeeLiability_LID4Navigation { get; set; } = new List<tbl_Employee>();

    public virtual ICollection<tbl_Employee> tbl_Employeeadvsalary_LID4Navigation { get; set; } = new List<tbl_Employee>();

    public virtual ICollection<tbl_FeeReceiveMaster> tbl_FeeReceiveMaster { get; set; } = new List<tbl_FeeReceiveMaster>();

    public virtual ICollection<tbl_Funds> tbl_Funds { get; set; } = new List<tbl_Funds>();

    public virtual ICollection<tbl_JVDetail> tbl_JVDetail { get; set; } = new List<tbl_JVDetail>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMasterCashAc { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMasterLevel4 { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_StudentRegistration> tbl_StudentRegistration { get; set; } = new List<tbl_StudentRegistration>();

    public virtual ICollection<tbl_SubAccount> tbl_SubAccount { get; set; } = new List<tbl_SubAccount>();
}
