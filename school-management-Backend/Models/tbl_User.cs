using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_User
{
    public int ID { get; set; }

    public string? Name { get; set; }

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public string? Designation { get; set; }

    public bool? Status { get; set; }

    public int? CampusID { get; set; }

    public int? RoleID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreateDT { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDT { get; set; }

    public string? UserImage { get; set; }

    public string? OTP { get; set; }

    public int? EmployeeCode { get; set; }

    public int? FamilyID { get; set; }

    

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_Employee? EmployeeCodeNavigation { get; set; }

    public virtual tbl_UserRole? Role { get; set; }

    public virtual ICollection<tbl_AcadmicYear> tbl_AcadmicYearCreatedByNavigation { get; set; } = new List<tbl_AcadmicYear>();

    public virtual ICollection<tbl_AcadmicYear> tbl_AcadmicYearModifyByNavigation { get; set; } = new List<tbl_AcadmicYear>();

    public virtual ICollection<tbl_Attendence> tbl_AttendenceCreatedByNavigation { get; set; } = new List<tbl_Attendence>();

    public virtual ICollection<tbl_Attendence> tbl_AttendenceModifyByNavigation { get; set; } = new List<tbl_Attendence>();

    public virtual ICollection<tbl_BankMaster> tbl_BankMasterApprovedByNavigation { get; set; } = new List<tbl_BankMaster>();

    public virtual ICollection<tbl_BankMaster> tbl_BankMasterCreatedByNavigation { get; set; } = new List<tbl_BankMaster>();

    public virtual ICollection<tbl_BankMaster> tbl_BankMasterModifiedByNavigation { get; set; } = new List<tbl_BankMaster>();

    public virtual ICollection<tbl_CashMaster> tbl_CashMasterApprovedByNavigation { get; set; } = new List<tbl_CashMaster>();

    public virtual ICollection<tbl_CashMaster> tbl_CashMasterCreatedByNavigation { get; set; } = new List<tbl_CashMaster>();

    public virtual ICollection<tbl_CashMaster> tbl_CashMasterModifiedByNavigation { get; set; } = new List<tbl_CashMaster>();

    public virtual ICollection<tbl_ComplaintReply> tbl_ComplaintReply { get; set; } = new List<tbl_ComplaintReply>();

    public virtual ICollection<tbl_EmployeeIncrement> tbl_EmployeeIncrementApprovedByNavigation { get; set; } = new List<tbl_EmployeeIncrement>();

    public virtual ICollection<tbl_EmployeeIncrement> tbl_EmployeeIncrementCreatedByNavigation { get; set; } = new List<tbl_EmployeeIncrement>();

    public virtual ICollection<tbl_EmployeeIncrement> tbl_EmployeeIncrementModifiedByNavigation { get; set; } = new List<tbl_EmployeeIncrement>();

    public virtual ICollection<tbl_Family_Code> tbl_Family_CodeCreatedByNavigation { get; set; } = new List<tbl_Family_Code>();

    public virtual ICollection<tbl_Family_Code> tbl_Family_CodeModifyByNavigation { get; set; } = new List<tbl_Family_Code>();

    public virtual ICollection<tbl_FeePosting> tbl_FeePostingApprovedByNavigation { get; set; } = new List<tbl_FeePosting>();

    public virtual ICollection<tbl_FeePosting> tbl_FeePostingCreatedByNavigation { get; set; } = new List<tbl_FeePosting>();

    public virtual ICollection<tbl_FeePosting> tbl_FeePostingModifyByNavigation { get; set; } = new List<tbl_FeePosting>();

    public virtual ICollection<tbl_FeeReceiveMaster> tbl_FeeReceiveMasterApprovedByNavigation { get; set; } = new List<tbl_FeeReceiveMaster>();

    public virtual ICollection<tbl_FeeReceiveMaster> tbl_FeeReceiveMasterCreatedByNavigation { get; set; } = new List<tbl_FeeReceiveMaster>();

    public virtual ICollection<tbl_FeeReceiveMaster> tbl_FeeReceiveMasterModifiyByNavigation { get; set; } = new List<tbl_FeeReceiveMaster>();

    public virtual ICollection<tbl_Funds> tbl_FundsCreatedByNavigation { get; set; } = new List<tbl_Funds>();

    public virtual ICollection<tbl_Funds> tbl_FundsModifyByNavigation { get; set; } = new List<tbl_Funds>();

    public virtual ICollection<tbl_Grade> tbl_Grade { get; set; } = new List<tbl_Grade>();

    public virtual ICollection<tbl_Item> tbl_Item { get; set; } = new List<tbl_Item>();

    public virtual ICollection<tbl_JVMaster> tbl_JVMasterApprovedByNavigation { get; set; } = new List<tbl_JVMaster>();

    public virtual ICollection<tbl_JVMaster> tbl_JVMasterCreatedByNavigation { get; set; } = new List<tbl_JVMaster>();

    public virtual ICollection<tbl_JVMaster> tbl_JVMasterModifiedByNavigation { get; set; } = new List<tbl_JVMaster>();

    public virtual ICollection<tbl_LibBookIssueMaster> tbl_LibBookIssueMasterCreatedByNavigation { get; set; } = new List<tbl_LibBookIssueMaster>();

    public virtual ICollection<tbl_LibBookIssueMaster> tbl_LibBookIssueMasterModifyByNavigation { get; set; } = new List<tbl_LibBookIssueMaster>();

    public virtual ICollection<tbl_MaterialIssueMaster> tbl_MaterialIssueMasterCreatedByNavigation { get; set; } = new List<tbl_MaterialIssueMaster>();

    public virtual ICollection<tbl_MaterialIssueMaster> tbl_MaterialIssueMasterModifyByNavigation { get; set; } = new List<tbl_MaterialIssueMaster>();

    public virtual ICollection<tbl_MaterialReceiveMaster> tbl_MaterialReceiveMasterCreatedByNavigation { get; set; } = new List<tbl_MaterialReceiveMaster>();

    public virtual ICollection<tbl_MaterialReceiveMaster> tbl_MaterialReceiveMasterModifyByNavigation { get; set; } = new List<tbl_MaterialReceiveMaster>();

    public virtual ICollection<tbl_MaterialRequestMaster> tbl_MaterialRequestMasterCreatedByNavigation { get; set; } = new List<tbl_MaterialRequestMaster>();

    public virtual ICollection<tbl_MaterialRequestMaster> tbl_MaterialRequestMasterModifyByNavigation { get; set; } = new List<tbl_MaterialRequestMaster>();

    public virtual ICollection<tbl_MaterialTransferMaster> tbl_MaterialTransferMasterCreatedByNavigation { get; set; } = new List<tbl_MaterialTransferMaster>();

    public virtual ICollection<tbl_MaterialTransferMaster> tbl_MaterialTransferMasterModifyByNavigation { get; set; } = new List<tbl_MaterialTransferMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMasterApprovedByNavigation { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMasterCreatedByNavigation { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMasterModifyByNavigation { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_PolicySOPMaster> tbl_PolicySOPMasterCreatedByNavigation { get; set; } = new List<tbl_PolicySOPMaster>();

    public virtual ICollection<tbl_PolicySOPMaster> tbl_PolicySOPMasterModifyByNavigation { get; set; } = new List<tbl_PolicySOPMaster>();

    public virtual ICollection<tbl_ReamsDefine> tbl_ReamsDefineCreatedByNavigation { get; set; } = new List<tbl_ReamsDefine>();

    public virtual ICollection<tbl_ReamsDefine> tbl_ReamsDefineModifyByNavigation { get; set; } = new List<tbl_ReamsDefine>();

    public virtual ICollection<tbl_ReamsReceive> tbl_ReamsReceiveCreatedByNavigation { get; set; } = new List<tbl_ReamsReceive>();

    public virtual ICollection<tbl_ReamsReceive> tbl_ReamsReceiveModifyByNavigation { get; set; } = new List<tbl_ReamsReceive>();

    public virtual ICollection<tbl_ResultBatch> tbl_ResultBatchCreatedByNavigation { get; set; } = new List<tbl_ResultBatch>();

    public virtual ICollection<tbl_ResultBatch> tbl_ResultBatchModifyByNavigation { get; set; } = new List<tbl_ResultBatch>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMasterCreatedByNavigation { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_ResultMaster> tbl_ResultMasterModifyByNavigation { get; set; } = new List<tbl_ResultMaster>();

    public virtual ICollection<tbl_SalaryVoucherMaster> tbl_SalaryVoucherMasterCreatedByNavigation { get; set; } = new List<tbl_SalaryVoucherMaster>();

    public virtual ICollection<tbl_SalaryVoucherMaster> tbl_SalaryVoucherMasterModifyByNavigation { get; set; } = new List<tbl_SalaryVoucherMaster>();

    public virtual ICollection<tbl_SalaryVoucherMaster> tbl_SalaryVoucherMasterPostByNavigation { get; set; } = new List<tbl_SalaryVoucherMaster>();

    public virtual ICollection<tbl_StudentAttMaster> tbl_StudentAttMasterCreatedByNavigation { get; set; } = new List<tbl_StudentAttMaster>();

    public virtual ICollection<tbl_StudentAttMaster> tbl_StudentAttMasterModifyByNavigation { get; set; } = new List<tbl_StudentAttMaster>();

    public virtual ICollection<tbl_StudentFollowup> tbl_StudentFollowupCreatedByNavigation { get; set; } = new List<tbl_StudentFollowup>();

    public virtual ICollection<tbl_StudentFollowup> tbl_StudentFollowupModifyByNavigation { get; set; } = new List<tbl_StudentFollowup>();

    public virtual ICollection<tbl_TargetFeeCollection> tbl_TargetFeeCollectionCreatedByNavigation { get; set; } = new List<tbl_TargetFeeCollection>();

    public virtual ICollection<tbl_TargetFeeCollection> tbl_TargetFeeCollectionModifyByNavigation { get; set; } = new List<tbl_TargetFeeCollection>();

    public virtual ICollection<tbl_UserRightsCampus> tbl_UserRightsCampus { get; set; } = new List<tbl_UserRightsCampus>();

    public virtual ICollection<tbl_feeStudentMaster> tbl_feeStudentMasterCreatedByNavigation { get; set; } = new List<tbl_feeStudentMaster>();

    public virtual ICollection<tbl_feeStudentMaster> tbl_feeStudentMasterModifyByNavigation { get; set; } = new List<tbl_feeStudentMaster>();

    public virtual ICollection<tbl_pPurchaseMaster> tbl_pPurchaseMasterApprovedByNavigation { get; set; } = new List<tbl_pPurchaseMaster>();

    public virtual ICollection<tbl_pPurchaseMaster> tbl_pPurchaseMasterCreatedByNavigation { get; set; } = new List<tbl_pPurchaseMaster>();

    public virtual ICollection<tbl_pPurchaseMaster> tbl_pPurchaseMasterModifyByNavigation { get; set; } = new List<tbl_pPurchaseMaster>();

    public virtual ICollection<tbl_pPurchaseOrderMaster> tbl_pPurchaseOrderMasterApprovedByNavigation { get; set; } = new List<tbl_pPurchaseOrderMaster>();

    public virtual ICollection<tbl_pPurchaseOrderMaster> tbl_pPurchaseOrderMasterCreatedByNavigation { get; set; } = new List<tbl_pPurchaseOrderMaster>();

    public virtual ICollection<tbl_pPurchaseOrderMaster> tbl_pPurchaseOrderMasterModifyByNavigation { get; set; } = new List<tbl_pPurchaseOrderMaster>();

    public virtual ICollection<tbl_pPurchaseReturnMaster> tbl_pPurchaseReturnMasterApprovedByNavigation { get; set; } = new List<tbl_pPurchaseReturnMaster>();

    public virtual ICollection<tbl_pPurchaseReturnMaster> tbl_pPurchaseReturnMasterCreatedByNavigation { get; set; } = new List<tbl_pPurchaseReturnMaster>();

    public virtual ICollection<tbl_pPurchaseReturnMaster> tbl_pPurchaseReturnMasterModifyByNavigation { get; set; } = new List<tbl_pPurchaseReturnMaster>();

    public virtual ICollection<tbl_ClassDiary> tbl_ClassDiaries { get; set; } = new List<tbl_ClassDiary>();
    
    // For ModifyBy relationship
    public virtual ICollection<tbl_ClassDiary> tbl_ClassDiariesModified { get; set; } = new List<tbl_ClassDiary>();
    
    // For ApprovedBy relationship
    public virtual ICollection<tbl_ClassDiary> tbl_ClassDiariesApproved { get; set; } = new List<tbl_ClassDiary>();
}
