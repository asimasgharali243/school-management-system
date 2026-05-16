using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Campus
{
    public int CampusID { get; set; }

    public string? CampusCode { get; set; }

    public string? CampusName { get; set; }

    public string? CampusAddress { get; set; }

    public string? CampusPhone1 { get; set; }

    public string? CampusPhone2 { get; set; }

    public string? CampusMobile { get; set; }

    public string? CampusEmail { get; set; }

    public string? CampusContactPerson { get; set; }

    public DateOnly? CampusStartDate { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreateDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }


        public virtual ICollection<tbl_AddClass> tbl_AddClass { get; set; } = new List<tbl_AddClass>();
    
    public virtual ICollection<tbl_AdmissionTargetDetail> tbl_AdmissionTargetDetail { get; set; } = new List<tbl_AdmissionTargetDetail>();

    public virtual ICollection<tbl_Attendence> tbl_Attendence { get; set; } = new List<tbl_Attendence>();

    public virtual ICollection<tbl_BankDetail> tbl_BankDetail { get; set; } = new List<tbl_BankDetail>();

    public virtual ICollection<tbl_BankMaster> tbl_BankMaster { get; set; } = new List<tbl_BankMaster>();

    public virtual ICollection<tbl_CashDetail> tbl_CashDetail { get; set; } = new List<tbl_CashDetail>();

    public virtual ICollection<tbl_CashMaster> tbl_CashMaster { get; set; } = new List<tbl_CashMaster>();

    public virtual ICollection<tbl_Employee> tbl_Employee { get; set; } = new List<tbl_Employee>();

    public virtual ICollection<tbl_EmployeeIncrement> tbl_EmployeeIncrement { get; set; } = new List<tbl_EmployeeIncrement>();

    public virtual ICollection<tbl_Family_Code> tbl_Family_Code { get; set; } = new List<tbl_Family_Code>();

    public virtual ICollection<tbl_FeePosting> tbl_FeePosting { get; set; } = new List<tbl_FeePosting>();

    public virtual ICollection<tbl_FeeReceiveMaster> tbl_FeeReceiveMaster { get; set; } = new List<tbl_FeeReceiveMaster>();

    public virtual ICollection<tbl_Funds> tbl_Funds { get; set; } = new List<tbl_Funds>();

    public virtual ICollection<tbl_Grade> tbl_Grade { get; set; } = new List<tbl_Grade>();

    public virtual ICollection<tbl_JVDetail> tbl_JVDetail { get; set; } = new List<tbl_JVDetail>();

    public virtual ICollection<tbl_JVMaster> tbl_JVMaster { get; set; } = new List<tbl_JVMaster>();

    public virtual ICollection<tbl_LibBookIssueMaster> tbl_LibBookIssueMaster { get; set; } = new List<tbl_LibBookIssueMaster>();

    public virtual ICollection<tbl_MaterialIssueMaster> tbl_MaterialIssueMaster { get; set; } = new List<tbl_MaterialIssueMaster>();

    public virtual ICollection<tbl_MaterialReceiveMaster> tbl_MaterialReceiveMaster { get; set; } = new List<tbl_MaterialReceiveMaster>();

    public virtual ICollection<tbl_MaterialRequestMaster> tbl_MaterialRequestMaster { get; set; } = new List<tbl_MaterialRequestMaster>();

    public virtual ICollection<tbl_MaterialTransferMaster> tbl_MaterialTransferMaster { get; set; } = new List<tbl_MaterialTransferMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMaster { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_PolicySOPMaster> tbl_PolicySOPMaster { get; set; } = new List<tbl_PolicySOPMaster>();

    public virtual ICollection<tbl_ReamsDefine> tbl_ReamsDefine { get; set; } = new List<tbl_ReamsDefine>();

    public virtual ICollection<tbl_ReamsReceive> tbl_ReamsReceive { get; set; } = new List<tbl_ReamsReceive>();

    public virtual ICollection<tbl_ResultBatch> tbl_ResultBatch { get; set; } = new List<tbl_ResultBatch>();

    public virtual ICollection<tbl_SalaryVoucherMaster> tbl_SalaryVoucherMaster { get; set; } = new List<tbl_SalaryVoucherMaster>();

    public virtual ICollection<tbl_StudentAttMaster> tbl_StudentAttMaster { get; set; } = new List<tbl_StudentAttMaster>();

    public virtual ICollection<tbl_StudentFollowup> tbl_StudentFollowup { get; set; } = new List<tbl_StudentFollowup>();

    public virtual ICollection<tbl_StudentRegistration> tbl_StudentRegistration { get; set; } = new List<tbl_StudentRegistration>();

    public virtual ICollection<tbl_User> tbl_User { get; set; } = new List<tbl_User>();

    public virtual ICollection<tbl_feeStudentMaster> tbl_feeStudentMaster { get; set; } = new List<tbl_feeStudentMaster>();

    public virtual ICollection<tbl_pPurchaseMaster> tbl_pPurchaseMaster { get; set; } = new List<tbl_pPurchaseMaster>();

    public virtual ICollection<tbl_pPurchaseOrderMaster> tbl_pPurchaseOrderMaster { get; set; } = new List<tbl_pPurchaseOrderMaster>();

    public virtual ICollection<tbl_pPurchaseReturnMaster> tbl_pPurchaseReturnMaster { get; set; } = new List<tbl_pPurchaseReturnMaster>();
}
