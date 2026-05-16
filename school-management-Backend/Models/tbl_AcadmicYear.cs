using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_AcadmicYear
{
    public int YearID { get; set; }

    public string? YearTitle { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public bool? Active { get; set; }

    public virtual tbl_User? CreatedByNavigation { get; set; }

    public virtual tbl_User? ModifyByNavigation { get; set; }

    public virtual ICollection<tbl_BankMaster> tbl_BankMaster { get; set; } = new List<tbl_BankMaster>();

    public virtual ICollection<tbl_CashMaster> tbl_CashMaster { get; set; } = new List<tbl_CashMaster>();

    public virtual ICollection<tbl_Item> tbl_Item { get; set; } = new List<tbl_Item>();

    public virtual ICollection<tbl_JVMaster> tbl_JVMaster { get; set; } = new List<tbl_JVMaster>();

    public virtual ICollection<tbl_ReamsDefine> tbl_ReamsDefine { get; set; } = new List<tbl_ReamsDefine>();

    public virtual ICollection<tbl_ReamsReceive> tbl_ReamsReceive { get; set; } = new List<tbl_ReamsReceive>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMaster { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_StudentRegistration> tbl_StudentRegistration { get; set; } = new List<tbl_StudentRegistration>();

    public virtual ICollection<tbl_feeStudentMaster> tbl_feeStudentMaster { get; set; } = new List<tbl_feeStudentMaster>();
}
