using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_StudentRegistration
{
    public int Reg_Id { get; set; }

    public long? Reg_No { get; set; }

    public string? Frist_Name { get; set; }

    public string? NameUrdu { get; set; }

    public string? Caste { get; set; }

    public bool? isOrphan { get; set; }

    public string? Image { get; set; }

    public bool? isHafiz { get; set; }

    public int? LocalityID { get; set; }

    public string? Gender { get; set; }

    public string? SpecialNotes { get; set; }

    public string? Bay_form_No { get; set; }

    public DateOnly? Date_of_Brith { get; set; }

    public DateOnly? Reg_Date { get; set; }

    public string? Type { get; set; }

    public string? Language { get; set; }

    public string? Religion { get; set; }

    public string? Blood { get; set; }

    public string? Medium { get; set; }

    public string? School_ID { get; set; }

    public int? Class_ID { get; set; }

    public int? Section_ID { get; set; }

    public int? Acad_Year { get; set; }

    public string? Prev_School { get; set; }

    public string? Reference { get; set; }

    public string? Activity { get; set; }

    public string? Other { get; set; }

    public int? Town_ID { get; set; }

    public string? Street_Address { get; set; }

    public string? Contact_Person { get; set; }

    public string? Father_CNIC { get; set; }

    public string? Father_Name { get; set; }

    public bool? Father_NIC { get; set; }

    public string? Father_Occupation { get; set; }

    public string? Father_Occupation_Type { get; set; }

    public string? Father_Qualification { get; set; }

    public string? Father_Email { get; set; }

    public string? FatherContact_Number { get; set; }

    public string? Mother_Name { get; set; }

    public string? Mother_Cnic { get; set; }

    public string? Mother_Occupation { get; set; }

    public string? Mother_Qualification { get; set; }

    public string? Mother_Email { get; set; }

    public string? MotherContact_Number { get; set; }

    public string? Home_Address { get; set; }

    public string? Home_Phone { get; set; }

    public string? Work_Address { get; set; }

    public string? Work_Phone { get; set; }

    public string? Nationality { get; set; }

    public bool? B_Certificate { get; set; }

    public bool? S_L_Certificate { get; set; }

    public bool? L_R_Form { get; set; }

    public bool? L_S_C_Certificate { get; set; }

    public int? Family_Code { get; set; }

    public string? Prev_Class { get; set; }

    public DateOnly? Leave_Date { get; set; }

    public string? Mark_Of_Identification { get; set; }

    public string? ReasonRemarks { get; set; }

    public string? Mobile1 { get; set; }

    public string? Mobile2 { get; set; }

    public string? Mobile3 { get; set; }

    public string? Admitted_by { get; set; }

    public int? subject_group_id { get; set; }

    public int? RollNo { get; set; }

    public int? UID { get; set; }

    public string? FatherNameUrdu { get; set; }

    public string? Home_Address_Urdu { get; set; }

    public int? AttendantID { get; set; }

    public int? admccode { get; set; }

    public int? Adm_Class_Code { get; set; }

    public string? dosdescription { get; set; }

    public string? cur_Status { get; set; }

    public bool? Promote { get; set; }

    public int? prv_Regid { get; set; }

    public string? Admission_Type { get; set; }

    public DateOnly? DeActive_Date { get; set; }

    public int? DeActive_Reason_ID { get; set; }

    public string? DeActiveRemarks { get; set; }

    public string? House { get; set; }

    public string? SubHouse { get; set; }

    public int? CampusID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? LID4 { get; set; }

    public string? Mother_Occupation_Type { get; set; }

    public virtual tbl_AcadmicYear? Acad_YearNavigation { get; set; }

    public virtual tbl_Campus? Campus { get; set; }

    public virtual tbl_AddClass? Class { get; set; }

    public virtual tbl_Level4? LID4Navigation { get; set; }

    public virtual tbl_AddTown? Locality { get; set; }

    public virtual tbl_AddSection? Section { get; set; }

    public virtual tbl_subjectGroup? subject_group { get; set; }

    public virtual ICollection<tbl_Complaint> tbl_Complaint { get; set; } = new List<tbl_Complaint>();

    public virtual ICollection<tbl_FeePosting> tbl_FeePosting { get; set; } = new List<tbl_FeePosting>();

    public virtual ICollection<tbl_FeeReceiveMaster> tbl_FeeReceiveMaster { get; set; } = new List<tbl_FeeReceiveMaster>();

    public virtual ICollection<tbl_LibBookIssueMaster> tbl_LibBookIssueMaster { get; set; } = new List<tbl_LibBookIssueMaster>();

    public virtual ICollection<tbl_MaterialIssueMaster> tbl_MaterialIssueMaster { get; set; } = new List<tbl_MaterialIssueMaster>();

    public virtual ICollection<tbl_MaterialRequestMaster> tbl_MaterialRequestMaster { get; set; } = new List<tbl_MaterialRequestMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMaster { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_ReamsReceive> tbl_ReamsReceive { get; set; } = new List<tbl_ReamsReceive>();

    public virtual ICollection<tbl_StudentAndClassroomPsychoDetail2> tbl_StudentAndClassroomPsychoDetail2 { get; set; } = new List<tbl_StudentAndClassroomPsychoDetail2>();

    public virtual ICollection<tbl_StudentAttDetail> tbl_StudentAttDetail { get; set; } = new List<tbl_StudentAttDetail>();

    public virtual ICollection<tbl_StudentFollowup> tbl_StudentFollowup { get; set; } = new List<tbl_StudentFollowup>();

    public virtual ICollection<tbl_feeStudentMaster> tbl_feeStudentMaster { get; set; } = new List<tbl_feeStudentMaster>();
}
