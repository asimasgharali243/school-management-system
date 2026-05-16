// Data/ApplicationDbContext.cs

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Models;

namespace school_management_Backend.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Temp_MultiResult> Temp_MultiResult { get; set; }

    public virtual DbSet<Temp_SingleResult> Temp_SingleResult { get; set; }

    public virtual DbSet<tblActivityCalandar> tblActivityCalandar { get; set; }

    public virtual DbSet<tblActivityCalendarDetail> tblActivityCalendarDetail { get; set; }

    public virtual DbSet<tblDiary> tblDiary { get; set; }

    public virtual DbSet<tblPTM> tblPTM { get; set; }

    public virtual DbSet<tblRoom> tblRoom { get; set; }

    public virtual DbSet<tbl_AcadmicYear> tbl_AcadmicYear { get; set; }

    public virtual DbSet<tbl_Acadmic_TimeTable> tbl_Acadmic_TimeTable { get; set; }

    public virtual DbSet<tbl_AddBranch> tbl_AddBranch { get; set; }

    public virtual DbSet<tbl_AddClass> tbl_AddClass { get; set; }

    public virtual DbSet<tbl_AddSection> tbl_AddSection { get; set; }

    public virtual DbSet<tbl_AddTown> tbl_AddTown { get; set; }

    public virtual DbSet<tbl_AddVerified> tbl_AddVerified { get; set; }

    public virtual DbSet<tbl_AdmissionTargetDetail> tbl_AdmissionTargetDetail { get; set; }

    public virtual DbSet<tbl_AdmissionTargetMaster> tbl_AdmissionTargetMaster { get; set; }

    public virtual DbSet<tbl_AssessmentDetail> tbl_AssessmentDetail { get; set; }

    public virtual DbSet<tbl_AssessmentMaster> tbl_AssessmentMaster { get; set; }

    public virtual DbSet<tbl_AttendanceDetail> tbl_AttendanceDetail { get; set; }

    public virtual DbSet<tbl_Attendence> tbl_Attendence { get; set; }

    public virtual DbSet<tbl_BankDetail> tbl_BankDetail { get; set; }

    public virtual DbSet<tbl_BankMaster> tbl_BankMaster { get; set; }

    public virtual DbSet<tbl_Branch> tbl_Branch { get; set; }

    public virtual DbSet<tbl_Campus> tbl_Campus { get; set; }

    public virtual DbSet<tbl_CashDetail> tbl_CashDetail { get; set; }

    public virtual DbSet<tbl_CashMaster> tbl_CashMaster { get; set; }

    public virtual DbSet<tbl_ChapterTopic> tbl_ChapterTopic { get; set; }

    public virtual DbSet<tbl_ClassDiary> tbl_ClassDiary { get; set; }

    public virtual DbSet<tbl_ClassGroup> tbl_ClassGroup { get; set; }

    public virtual DbSet<tbl_ClassWiseSubject> tbl_ClassWiseSubject { get; set; }

    public virtual DbSet<tbl_Company> tbl_Company { get; set; }

    public virtual DbSet<tbl_Complaint> tbl_Complaint { get; set; }

    public virtual DbSet<tbl_ComplaintCategory> tbl_ComplaintCategory { get; set; }

    public virtual DbSet<tbl_ComplaintReply> tbl_ComplaintReply { get; set; }

    public virtual DbSet<tbl_ComplaintUser> tbl_ComplaintUser { get; set; }

    public virtual DbSet<tbl_Constants> tbl_Constants { get; set; }

    public virtual DbSet<tbl_Currency> tbl_Currency { get; set; }

    public virtual DbSet<tbl_DefualtExam> tbl_DefualtExam { get; set; }

    public virtual DbSet<tbl_Department> tbl_Department { get; set; }

    public virtual DbSet<tbl_Designation> tbl_Designation { get; set; }

    public virtual DbSet<tbl_Employee> tbl_Employee { get; set; }

    public virtual DbSet<tbl_EmployeeExperience> tbl_EmployeeExperience { get; set; }

    public virtual DbSet<tbl_EmployeeFacility> tbl_EmployeeFacility { get; set; }

    public virtual DbSet<tbl_EmployeeIncrement> tbl_EmployeeIncrement { get; set; }

    public virtual DbSet<tbl_EmployeeQualification> tbl_EmployeeQualification { get; set; }

    public virtual DbSet<tbl_EmployeeReference> tbl_EmployeeReference { get; set; }

    public virtual DbSet<tbl_EmployeeSubject> tbl_EmployeeSubject { get; set; }

    public virtual DbSet<tbl_ExamSubjects> tbl_ExamSubjects { get; set; }

    public virtual DbSet<tbl_Exams> tbl_Exams { get; set; }

    public virtual DbSet<tbl_Family_Code> tbl_Family_Code { get; set; }

    public virtual DbSet<tbl_FatherMotherQualification> tbl_FatherMotherQualification { get; set; }

    public virtual DbSet<tbl_FeeBatch> tbl_FeeBatch { get; set; }

    public virtual DbSet<tbl_FeePosting> tbl_FeePosting { get; set; }

    public virtual DbSet<tbl_FeeReceiveDetail> tbl_FeeReceiveDetail { get; set; }

    public virtual DbSet<tbl_FeeReceiveMaster> tbl_FeeReceiveMaster { get; set; }

    public virtual DbSet<tbl_Funds> tbl_Funds { get; set; }

    public virtual DbSet<tbl_Grade> tbl_Grade { get; set; }

    public virtual DbSet<tbl_Holidays> tbl_Holidays { get; set; }

    public virtual DbSet<tbl_InputGrade> tbl_InputGrade { get; set; }

    public virtual DbSet<tbl_InputPosition> tbl_InputPosition { get; set; }

    public virtual DbSet<tbl_InputPositionClass> tbl_InputPositionClass { get; set; }

    public virtual DbSet<tbl_InputPositionSubject> tbl_InputPositionSubject { get; set; }

    public virtual DbSet<tbl_InputSubjectPercentage2> tbl_InputSubjectPercentage2 { get; set; }

    public virtual DbSet<tbl_InquiryDetail> tbl_InquiryDetail { get; set; }

    public virtual DbSet<tbl_InquiryMaster> tbl_InquiryMaster { get; set; }

    public virtual DbSet<tbl_Item> tbl_Item { get; set; }

    public virtual DbSet<tbl_ItemCategory> tbl_ItemCategory { get; set; }

    public virtual DbSet<tbl_ItemMainCategory> tbl_ItemMainCategory { get; set; }

    public virtual DbSet<tbl_ItemMou> tbl_ItemMou { get; set; }

    public virtual DbSet<tbl_ItemOpening> tbl_ItemOpening { get; set; }

    public virtual DbSet<tbl_ItemOpeningDetail> tbl_ItemOpeningDetail { get; set; }

    public virtual DbSet<tbl_ItemSubCategory> tbl_ItemSubCategory { get; set; }

    public virtual DbSet<tbl_JVDetail> tbl_JVDetail { get; set; }

    public virtual DbSet<tbl_JVMaster> tbl_JVMaster { get; set; }

    public virtual DbSet<tbl_Level1> tbl_Level1 { get; set; }

    public virtual DbSet<tbl_Level2> tbl_Level2 { get; set; }

    public virtual DbSet<tbl_Level3> tbl_Level3 { get; set; }

    public virtual DbSet<tbl_Level4> tbl_Level4 { get; set; }

    public virtual DbSet<tbl_LibBookIssueDetail> tbl_LibBookIssueDetail { get; set; }

    public virtual DbSet<tbl_LibBookIssueMaster> tbl_LibBookIssueMaster { get; set; }

    public virtual DbSet<tbl_MaterialIssueDetail> tbl_MaterialIssueDetail { get; set; }

    public virtual DbSet<tbl_MaterialIssueMaster> tbl_MaterialIssueMaster { get; set; }

    public virtual DbSet<tbl_MaterialReceiveDetail> tbl_MaterialReceiveDetail { get; set; }

    public virtual DbSet<tbl_MaterialReceiveMaster> tbl_MaterialReceiveMaster { get; set; }

    public virtual DbSet<tbl_MaterialRequestDetail> tbl_MaterialRequestDetail { get; set; }

    public virtual DbSet<tbl_MaterialRequestMaster> tbl_MaterialRequestMaster { get; set; }

    public virtual DbSet<tbl_MaterialTransferDetail> tbl_MaterialTransferDetail { get; set; }

    public virtual DbSet<tbl_MaterialTransferMaster> tbl_MaterialTransferMaster { get; set; }

    public virtual DbSet<tbl_ObservationDetail> tbl_ObservationDetail { get; set; }

    public virtual DbSet<tbl_ObservationMaster> tbl_ObservationMaster { get; set; }

    public virtual DbSet<tbl_POSDetail> tbl_POSDetail { get; set; }

    public virtual DbSet<tbl_POSMaster> tbl_POSMaster { get; set; }

    public virtual DbSet<tbl_Performance> tbl_Performance { get; set; }

    public virtual DbSet<tbl_PerformanceCategory> tbl_PerformanceCategory { get; set; }

    public virtual DbSet<tbl_PerformanceDetailEmp> tbl_PerformanceDetailEmp { get; set; }

    public virtual DbSet<tbl_PerformanceDetailStudent> tbl_PerformanceDetailStudent { get; set; }

    public virtual DbSet<tbl_PerformanceMasterEmp> tbl_PerformanceMasterEmp { get; set; }

    public virtual DbSet<tbl_PerformanceMasterStudent> tbl_PerformanceMasterStudent { get; set; }

    public virtual DbSet<tbl_PerformanceSubCategory> tbl_PerformanceSubCategory { get; set; }

    public virtual DbSet<tbl_PeriodAllocation> tbl_PeriodAllocation { get; set; }

    public virtual DbSet<tbl_PeriodAllocationMaster> tbl_PeriodAllocationMaster { get; set; }

    public virtual DbSet<tbl_Periods> tbl_Periods { get; set; }

    public virtual DbSet<tbl_PolicySOPDetail> tbl_PolicySOPDetail { get; set; }

    public virtual DbSet<tbl_PolicySOPMaster> tbl_PolicySOPMaster { get; set; }

    public virtual DbSet<tbl_QuestionBank> tbl_QuestionBank { get; set; }

    public virtual DbSet<tbl_ReamsDefine> tbl_ReamsDefine { get; set; }

    public virtual DbSet<tbl_ReamsReceive> tbl_ReamsReceive { get; set; }

    public virtual DbSet<tbl_Reason> tbl_Reason { get; set; }

    public virtual DbSet<tbl_ResultBatch> tbl_ResultBatch { get; set; }

    public virtual DbSet<tbl_ResultEntry> tbl_ResultEntry { get; set; }

    public virtual DbSet<tbl_ResultMaster> tbl_ResultMaster { get; set; }

    public virtual DbSet<tbl_SalaryVoucherDetails> tbl_SalaryVoucherDetails { get; set; }

    public virtual DbSet<tbl_SalaryVoucherMaster> tbl_SalaryVoucherMaster { get; set; }

    public virtual DbSet<tbl_ScheduleCalender> tbl_ScheduleCalender { get; set; }

    public virtual DbSet<tbl_StaffDegree> tbl_StaffDegree { get; set; }

    public virtual DbSet<tbl_Store> tbl_Store { get; set; }

    public virtual DbSet<tbl_StudentAndClassroomPsychoDetail> tbl_StudentAndClassroomPsychoDetail { get; set; }

    public virtual DbSet<tbl_StudentAndClassroomPsychoDetail2> tbl_StudentAndClassroomPsychoDetail2 { get; set; }

    public virtual DbSet<tbl_StudentAndClassroomPsychoMaster> tbl_StudentAndClassroomPsychoMaster { get; set; }

    public virtual DbSet<tbl_StudentAttDetail> tbl_StudentAttDetail { get; set; }

    public virtual DbSet<tbl_StudentAttMaster> tbl_StudentAttMaster { get; set; }

    public virtual DbSet<tbl_StudentFollowup> tbl_StudentFollowup { get; set; }

    public virtual DbSet<tbl_StudentRegistration> tbl_StudentRegistration { get; set; }

    public virtual DbSet<tbl_StudentRelation> tbl_StudentRelation { get; set; }

    public virtual DbSet<tbl_SubAccount> tbl_SubAccount { get; set; }

    public virtual DbSet<tbl_Subject> tbl_Subject { get; set; }

    public virtual DbSet<tbl_SubjectBook> tbl_SubjectBook { get; set; }

    public virtual DbSet<tbl_SubjectChapter> tbl_SubjectChapter { get; set; }

    public virtual DbSet<tbl_SyllabusPlanning> tbl_SyllabusPlanning { get; set; }

    public virtual DbSet<tbl_SyllabusPlanningYearly> tbl_SyllabusPlanningYearly { get; set; }

    public virtual DbSet<tbl_SyllabusPlanningYearlyDetail> tbl_SyllabusPlanningYearlyDetail { get; set; }

    public virtual DbSet<tbl_TargetFeeCollection> tbl_TargetFeeCollection { get; set; }

    public virtual DbSet<tbl_TeacherAndClassroomPsychoDetail> tbl_TeacherAndClassroomPsychoDetail { get; set; }

    public virtual DbSet<tbl_TeacherAndClassroomPsychoMaster> tbl_TeacherAndClassroomPsychoMaster { get; set; }

    public virtual DbSet<tbl_TimeTableGroup> tbl_TimeTableGroup { get; set; }

    public virtual DbSet<tbl_ToDoGeneralScheduleDetail> tbl_ToDoGeneralScheduleDetail { get; set; }

    public virtual DbSet<tbl_ToDoGeneralScheduleMaster> tbl_ToDoGeneralScheduleMaster { get; set; }

    public virtual DbSet<tbl_ToDoGeneralScheduleStatus> tbl_ToDoGeneralScheduleStatus { get; set; }

    public virtual DbSet<tbl_ToDoMaster> tbl_ToDoMaster { get; set; }

    public virtual DbSet<tbl_ToDoScheduleDetail> tbl_ToDoScheduleDetail { get; set; }

    public virtual DbSet<tbl_ToDoScheduleMaster> tbl_ToDoScheduleMaster { get; set; }

    public virtual DbSet<tbl_ToDoScheduleStatus> tbl_ToDoScheduleStatus { get; set; }

    public virtual DbSet<tbl_User> tbl_User { get; set; }

    public virtual DbSet<tbl_UserForm> tbl_UserForm { get; set; }

    public virtual DbSet<tbl_UserParent> tbl_UserParent { get; set; }

    public virtual DbSet<tbl_UserRightsCampus> tbl_UserRightsCampus { get; set; }

    public virtual DbSet<tbl_UserRights_Policy> tbl_UserRights_Policy { get; set; }

    public virtual DbSet<tbl_UserRole> tbl_UserRole { get; set; }

    public virtual DbSet<tbl_User_Logs> tbl_User_Logs { get; set; }

    public virtual DbSet<tbl_User_Rights> tbl_User_Rights { get; set; }

    public virtual DbSet<tbl_feeStudentDetail> tbl_feeStudentDetail { get; set; }

    public virtual DbSet<tbl_feeStudentMaster> tbl_feeStudentMaster { get; set; }

    public virtual DbSet<tbl_gLedger> tbl_gLedger { get; set; }

    public virtual DbSet<tbl_pPurchaseDetail> tbl_pPurchaseDetail { get; set; }

    public virtual DbSet<tbl_pPurchaseMaster> tbl_pPurchaseMaster { get; set; }

    public virtual DbSet<tbl_pPurchaseOrderDetail> tbl_pPurchaseOrderDetail { get; set; }

    public virtual DbSet<tbl_pPurchaseOrderMaster> tbl_pPurchaseOrderMaster { get; set; }

    public virtual DbSet<tbl_pPurchaseReturnDetail> tbl_pPurchaseReturnDetail { get; set; }

    public virtual DbSet<tbl_pPurchaseReturnMaster> tbl_pPurchaseReturnMaster { get; set; }

    public virtual DbSet<tbl_subjectGroup> tbl_subjectGroup { get; set; }

    public virtual DbSet<vw_CashBook> vw_CashBook { get; set; }

    public virtual DbSet<vw_FeeLed> vw_FeeLed { get; set; }

    public virtual DbSet<vw_Stock> vw_Stock { get; set; }

    public virtual DbSet<vw_gledger> vw_gledger { get; set; }

    public virtual DbSet<vw_gledgerUnion> vw_gledgerUnion { get; set; }

    public virtual DbSet<vw_gledgerUnionGLBatch> vw_gledgerUnionGLBatch { get; set; }

    public virtual DbSet<vw_gledgerUnionUnpost> vw_gledgerUnionUnpost { get; set; }

    // Notification tables
public virtual DbSet<NotificationRule> NotificationRules { get; set; }
public virtual DbSet<NotificationQueue> NotificationQueue { get; set; }
public virtual DbSet<UserDevice> UserDevices { get; set; }
public virtual DbSet<NotificationLog> NotificationLogs { get; set; }
public virtual DbSet<BatchNotification> BatchNotifications { get; set; }
public virtual DbSet<NotificationHistory> NotificationHistory { get; set; }
public DbSet<DiaryAccessControl> tbl_DiaryAccessControl { get; set; }
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    if (!optionsBuilder.IsConfigured)
    {
        optionsBuilder.UseSqlServer("Server=213.175.201.128;Database=ultsolrgs;User Id=ultsolrgs_user;Password=UltSol@123;TrustServerCertificate=true;Encrypt=False;Connection Timeout=60;");
    }
}
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Temp_MultiResult>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Attendence_E1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Attendence_E2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Attendence_E3)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Attendence_E4)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Attendence_E5)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade_E1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade_E2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade_E3)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade_E4)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade_E5)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Obtained_Marks_E1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Obtained_Marks_E2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Obtained_Marks_E3)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Obtained_Marks_E4)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Obtained_Marks_E5)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RemarksF_E1)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksF_E2)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksF_E3)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksF_E4)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksF_E5)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksM_E1)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksM_E2)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksM_E3)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksM_E4)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksM_E5)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Remarks_E1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Remarks_E2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Remarks_E3)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Remarks_E4)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Remarks_E5)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Temp_SingleResult>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Attendence)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Obtained_Marks)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Remarks)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RemarksMale)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksfeMale)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tblActivityCalandar>(entity =>
        {
            entity.HasKey(e => e.CalendarID).HasName("PK_tblActivityCalander");

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tblActivityCalendarDetail>(entity =>
        {
            entity.HasOne(d => d.Calendar).WithMany(p => p.tblActivityCalendarDetail)
                .HasForeignKey(d => d.CalendarID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tblActivityCalendarDetail_tblActivityCalandar");
        });

        modelBuilder.Entity<tblDiary>(entity =>
        {
            entity.HasKey(e => e.DiaryID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tblPTM>(entity =>
        {
            entity.HasKey(e => e.PTMID);
        });

        modelBuilder.Entity<tblRoom>(entity =>
        {
            entity.HasKey(e => e.RoomID);
        });

        modelBuilder.Entity<tbl_AcadmicYear>(entity =>
        {
            entity.HasKey(e => e.YearID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.YearTitle)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_AcadmicYearCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_AcadmicYear_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_AcadmicYearModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_AcadmicYear_tbl_User1");
        });

        modelBuilder.Entity<tbl_AddBranch>(entity =>
        {
            entity.HasKey(e => e.Branch_ID);

            entity.Property(e => e.Branch_ID).ValueGeneratedNever();
            entity.Property(e => e.Address)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Branch_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Contact_Person)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_AddClass>(entity =>
        {
            entity.HasKey(e => e.Class_ID);

            entity.Property(e => e.Class_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.School)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ClassGroup).WithMany(p => p.tbl_AddClass)
                .HasForeignKey(d => d.ClassGroupID)
                .HasConstraintName("FK_tbl_AddClass_tbl_ClassGroup");
        });

        modelBuilder.Entity<tbl_AddSection>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Section)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Section_Gender)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_AddTown>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Town)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_AddVerified>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_AdmissionTargetDetail>(entity =>
        {
            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_AdmissionTargetDetail)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_AdmissionTargetDetail_tbl_Campus");

            entity.HasOne(d => d.Target).WithMany(p => p.tbl_AdmissionTargetDetail)
                .HasForeignKey(d => d.TargetID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_AdmissionTargetDetail_tbl_AdmissionTargetMaster");
        });

        modelBuilder.Entity<tbl_AdmissionTargetMaster>(entity =>
        {
            entity.HasKey(e => e.TargetID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_AssessmentDetail>(entity =>
        {
            entity.HasOne(d => d.Assess).WithMany(p => p.tbl_AssessmentDetail)
                .HasForeignKey(d => d.AssessID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_AssessmentDetail_tbl_AssessmentMaster");

            entity.HasOne(d => d.PCategory).WithMany(p => p.tbl_AssessmentDetail)
                .HasForeignKey(d => d.PCategoryID)
                .HasConstraintName("FK_tbl_AssessmentDetail_tbl_PerformanceCategory");

            entity.HasOne(d => d.PSubCategory).WithMany(p => p.tbl_AssessmentDetail)
                .HasForeignKey(d => d.PSubCategoryID)
                .HasConstraintName("FK_tbl_AssessmentDetail_tbl_PerformanceSubCategory");
        });

        modelBuilder.Entity<tbl_AssessmentMaster>(entity =>
        {
            entity.HasKey(e => e.AssessID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_AttendanceDetail>(entity =>
        {
            entity.Property(e => e.Remarks).HasMaxLength(500);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TimeIn).HasColumnType("datetime");
            entity.Property(e => e.TimeOut).HasColumnType("datetime");

            entity.HasOne(d => d.Employee).WithMany(p => p.tbl_AttendanceDetail)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK_tbl_AttendanceDetail_tbl_Employee");

            entity.HasOne(d => d.Master).WithMany(p => p.tbl_AttendanceDetail)
                .HasForeignKey(d => d.MasterId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_AttendanceDetail_tbl_Attendence");
        });

        modelBuilder.Entity<tbl_Attendence>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_EmployeeAttendence");

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Remarks).HasMaxLength(250);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_Attendence)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_Attendence_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_AttendenceCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_Attendence_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_AttendenceModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_Attendence_tbl_User1");
        });

        modelBuilder.Entity<tbl_BankDetail>(entity =>
        {
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.RectNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Typ)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.BankMaster).WithMany(p => p.tbl_BankDetail)
                .HasForeignKey(d => d.BankMasterID)
                .HasConstraintName("FK_tbl_BankDetail_tbl_BankMaster");

            entity.HasOne(d => d.Camp).WithMany(p => p.tbl_BankDetail)
                .HasForeignKey(d => d.CampID)
                .HasConstraintName("FK_tbl_BankDetail_tbl_Campus");

            entity.HasOne(d => d.Employee).WithMany(p => p.tbl_BankDetail)
                .HasForeignKey(d => d.EmployeeID)
                .HasConstraintName("FK_tbl_BankDetail_tbl_Employee");

            entity.HasOne(d => d.Level4).WithMany(p => p.tbl_BankDetail)
                .HasForeignKey(d => d.Level4ID)
                .HasConstraintName("FK_tbl_BankDetail_tbl_Level4");

            entity.HasOne(d => d.SubAcc).WithMany(p => p.tbl_BankDetail)
                .HasForeignKey(d => d.SubAccID)
                .HasConstraintName("FK_tbl_BankDetail_tbl_SubAccount");
        });

        modelBuilder.Entity<tbl_BankMaster>(entity =>
        {
            entity.HasKey(e => e.BankMasterID);

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.BankType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ByName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ChqNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.DocType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.PartyBank)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_BankMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_BankMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_BankMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_BankMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_BankMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_BankMaster_tbl_User");

            entity.HasOne(d => d.Level4).WithMany(p => p.tbl_BankMaster)
                .HasForeignKey(d => d.Level4ID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbl_BankMaster_tbl_Level4");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.tbl_BankMasterModifiedByNavigation)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_tbl_BankMaster_tbl_User1");

            entity.HasOne(d => d.SessionYearNavigation).WithMany(p => p.tbl_BankMaster)
                .HasForeignKey(d => d.SessionYear)
                .HasConstraintName("FK_tbl_BankMaster_tbl_AcadmicYear");
        });

        modelBuilder.Entity<tbl_Branch>(entity =>
        {
            entity.HasKey(e => e.Branch_ID);

            entity.Property(e => e.Branch_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Campus>(entity =>
        {
            entity.HasKey(e => e.CampusID);

            entity.Property(e => e.CampusAddress).HasMaxLength(250);
            entity.Property(e => e.CampusCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.CampusContactPerson)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CampusEmail).HasMaxLength(50);
            entity.Property(e => e.CampusMobile)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.CampusPhone1)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.CampusPhone2)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.CreateDT).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_CashDetail>(entity =>
        {
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.RectNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Typ)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.Camp).WithMany(p => p.tbl_CashDetail)
                .HasForeignKey(d => d.CampID)
                .HasConstraintName("FK_tbl_CashDetail_tbl_Campus");

            entity.HasOne(d => d.CashMaster).WithMany(p => p.tbl_CashDetail)
                .HasForeignKey(d => d.CashMasterID)
                .HasConstraintName("FK_tbl_CashDetail_tbl_CashMaster");

            entity.HasOne(d => d.Employee).WithMany(p => p.tbl_CashDetail)
                .HasForeignKey(d => d.EmployeeID)
                .HasConstraintName("FK_tbl_CashDetail_tbl_Employee");

            entity.HasOne(d => d.Level4).WithMany(p => p.tbl_CashDetail)
                .HasForeignKey(d => d.Level4ID)
                .HasConstraintName("FK_tbl_CashDetail_tbl_Level4");

            entity.HasOne(d => d.SubAcc).WithMany(p => p.tbl_CashDetail)
                .HasForeignKey(d => d.SubAccID)
                .HasConstraintName("FK_tbl_CashDetail_tbl_SubAccount");
        });

        modelBuilder.Entity<tbl_CashMaster>(entity =>
        {
            entity.HasKey(e => e.CashMasterID);

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.RefNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_CashMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_CashMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_CashMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_CashMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_CashMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_CashMaster_tbl_User");

            entity.HasOne(d => d.Level4).WithMany(p => p.tbl_CashMaster)
                .HasForeignKey(d => d.Level4ID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbl_CashMaster_tbl_Level4");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.tbl_CashMasterModifiedByNavigation)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_tbl_CashMaster_tbl_User1");

            entity.HasOne(d => d.SessionYearNavigation).WithMany(p => p.tbl_CashMaster)
                .HasForeignKey(d => d.SessionYear)
                .HasConstraintName("FK_tbl_CashMaster_tbl_AcadmicYear");
        });

        modelBuilder.Entity<tbl_ChapterTopic>(entity =>
        {
            entity.HasKey(e => e.TopicID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });
modelBuilder.Entity<tbl_ClassDiary>(entity =>
{
    // Primary Key
    entity.HasKey(e => e.dairyID);

    // Property configurations
    entity.Property(e => e.dairyID)
        .HasColumnName("dairyID")
        .ValueGeneratedOnAdd();

    entity.Property(e => e.Date)
        .HasColumnName("Date")
        .HasColumnType("date");

    entity.Property(e => e.ClassID)
        .HasColumnName("ClassID")
        .IsRequired(false);

    entity.Property(e => e.SectionID)
        .HasColumnName("SectionID")
        .IsRequired(false);

    entity.Property(e => e.SubjectID)
        .HasColumnName("SubjectID")
        .IsRequired(false);

    entity.Property(e => e.ClassWork)
        .HasColumnName("ClassWork")
        .HasColumnType("nvarchar(max)")
        .IsRequired(false);

    entity.Property(e => e.HomeWork)
        .HasColumnName("HomeWork")
        .HasColumnType("nvarchar(max)")
        .IsRequired(false);

    entity.Property(e => e.CreatedBy)
        .HasColumnName("CreatedBy")
        .IsRequired(false);

    entity.Property(e => e.CreatedDT)
        .HasColumnName("CreatedDT")
        .HasColumnType("datetime")
        .IsRequired(false);

    entity.Property(e => e.ModifyBy)
        .HasColumnName("ModifyBy")
        .IsRequired(false);

    entity.Property(e => e.ModifyDT)
        .HasColumnName("ModifyDT")
        .HasColumnType("datetime")
        .IsRequired(false);

    entity.Property(e => e.isPublished)
        .HasColumnName("isPublished")
        .IsRequired(false)
        .HasDefaultValue(false);

    entity.Property(e => e.ApprovedBy)
        .HasColumnName("ApprovedBy")
        .IsRequired(false);

    entity.Property(e => e.ApprovedDT)
        .HasColumnName("ApprovedDT")
        .HasColumnType("datetime")
        .IsRequired(false);

    // Relationships - Foreign Keys

    // Class relationship
    entity.HasOne(d => d.Class)
        .WithMany(p => p.tbl_ClassDiaries) // You'll need to add this collection to tbl_AddClass
        .HasForeignKey(d => d.ClassID)
        .HasConstraintName("FK_tbl_ClassDiary_tbl_AddClass")
        .OnDelete(DeleteBehavior.Restrict);

    // Section relationship
    entity.HasOne(d => d.Section)
        .WithMany(p => p.tbl_ClassDiaries) // You'll need to add this collection to tbl_AddSection
        .HasForeignKey(d => d.SectionID)
        .HasConstraintName("FK_tbl_ClassDiary_tbl_AddSection")
        .OnDelete(DeleteBehavior.Restrict);

    // Subject relationship
    entity.HasOne(d => d.Subject)
        .WithMany(p => p.tbl_ClassDiaries) // You'll need to add this collection to tbl_Subject
        .HasForeignKey(d => d.SubjectID)
        .HasConstraintName("FK_tbl_ClassDiary_tbl_Subject")
        .OnDelete(DeleteBehavior.Restrict);

    // CreatedBy User relationship
    entity.HasOne(d => d.CreatedByUser)
        .WithMany(p => p.tbl_ClassDiaries) // You'll need to add this collection to tbl_User
        .HasForeignKey(d => d.CreatedBy)
        .HasConstraintName("FK_tbl_ClassDiary_tbl_User_CreatedBy")
        .OnDelete(DeleteBehavior.Restrict);

    // ModifiedBy User relationship
    entity.HasOne(d => d.ModifiedByUser)
        .WithMany(p => p.tbl_ClassDiariesModified) // You'll need to add this collection to tbl_User
        .HasForeignKey(d => d.ModifyBy)
        .HasConstraintName("FK_tbl_ClassDiary_tbl_User_ModifiedBy")
        .OnDelete(DeleteBehavior.Restrict);

    // ApprovedBy User relationship
    entity.HasOne(d => d.ApprovedByUser)
        .WithMany(p => p.tbl_ClassDiariesApproved) // You'll need to add this collection to tbl_User
        .HasForeignKey(d => d.ApprovedBy)
        .HasConstraintName("FK_tbl_ClassDiary_tbl_User_ApprovedBy")
        .OnDelete(DeleteBehavior.Restrict);

    // Optional: Add indexes for better performance
    entity.HasIndex(e => e.Date)
        .HasDatabaseName("IX_tbl_ClassDiary_Date");

    entity.HasIndex(e => new { e.ClassID, e.SectionID, e.SubjectID, e.Date })
        .HasDatabaseName("IX_tbl_ClassDiary_Class_Section_Subject_Date")
        .IsUnique(); // Prevents duplicate entries
});

        modelBuilder.Entity<tbl_ClassGroup>(entity =>
        {
            entity.HasKey(e => e.ClassGroupID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.GroupName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_ClassWiseSubject>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_ClassWiseSubject)
                .HasForeignKey(d => d.ClassID)
                .HasConstraintName("FK_tbl_ClassWiseSubject_tbl_AddClass");

            entity.HasOne(d => d.Subject).WithMany(p => p.tbl_ClassWiseSubject)
                .HasForeignKey(d => d.SubjectID)
                .HasConstraintName("FK_tbl_ClassWiseSubject_tbl_Subject");
        });

        modelBuilder.Entity<tbl_Company>(entity =>
        {
            entity.Property(e => e.Address).HasMaxLength(250);
            entity.Property(e => e.Company).HasMaxLength(250);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Fax)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LogoPath)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.LogoPath2)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.WebSite)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Complaint>(entity =>
        {
            entity.HasKey(e => e.ComplainID);

            entity.Property(e => e.ComplaintantName).HasMaxLength(500);
            entity.Property(e => e.ComplaintantNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Priority)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Category).WithMany(p => p.tbl_Complaint)
                .HasForeignKey(d => d.ComplainCategory)
                .HasConstraintName("FK_tbl_Complaint_tbl_ComplaintCategory");

            entity.HasOne(d => d.Student).WithMany(p => p.tbl_Complaint)
                .HasForeignKey(d => d.Reg_Id)
                .HasConstraintName("FK_tbl_Complaint_tbl_StudentRegistration");
        });

        modelBuilder.Entity<tbl_ComplaintCategory>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_ComplaintReply>(entity =>
        {
            entity.HasKey(e => e.ReplyID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Complain).WithMany(p => p.tbl_ComplaintReply)
                .HasForeignKey(d => d.ComplainID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ComplaintReply_tbl_Complaint");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_ComplaintReply)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_ComplaintReply_tbl_User");
        });

        modelBuilder.Entity<tbl_ComplaintUser>(entity =>
        {
            entity.HasOne(d => d.Complain).WithMany(p => p.tbl_ComplaintUser)
                .HasForeignKey(d => d.ComplainID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ComplaintUser_tbl_Complaint");
        });

        modelBuilder.Entity<tbl_Constants>(entity =>
        {
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Currency>(entity =>
        {
            entity.HasKey(e => e.Currency_ID);

            entity.Property(e => e.Currency)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_DefualtExam>(entity =>
        {
            entity.HasNoKey();
        });

        modelBuilder.Entity<tbl_Department>(entity =>
        {
            entity.HasKey(e => e.Department_ID).HasName("PK_tbl_EmployeeDepartment");

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Department_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.TimeEnd).HasColumnType("datetime");
            entity.Property(e => e.TimeStart).HasColumnType("datetime");

            entity.HasOne(d => d.salaryLID4Navigation).WithMany(p => p.tbl_Department)
                .HasForeignKey(d => d.salaryLID4)
                .HasConstraintName("FK_tbl_Department_tbl_Level4");
        });

        modelBuilder.Entity<tbl_Designation>(entity =>
        {
            entity.HasKey(e => e.Designation_ID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Designation_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_Employee>(entity =>
        {
            entity.HasKey(e => e.Employee_Code).HasName("PK_tbl_EmployeeRegistration");

            entity.Property(e => e.AllownceCategory)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ApprovedBy)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Blood_Group)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CNIC)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CNICPdf)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.CVPdf)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Confidance)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.EducationalDocumentsPdf)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Emergency_Contact)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeImg)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Employee_Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ExperienceLetterPdf)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.FatherOccupation)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Father_Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.InTime).HasColumnType("datetime");
            entity.Property(e => e.LeftRemarks)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.LeftStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Locality)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Marital_Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.OnlineTeamId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.OutTime).HasColumnType("datetime");
            entity.Property(e => e.Permanent_Address)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Personality)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Present_Address)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Religion)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Salary).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Sick_Leve)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Special_Leve)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Thumb_ID)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Trained_Untrained)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TravelDistance)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.VerifiedBy)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_Employee)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_Employee_tbl_Campus");

            entity.HasOne(d => d.Department).WithMany(p => p.tbl_Employee)
                .HasForeignKey(d => d.Department_ID)
                .HasConstraintName("FK_tbl_Employee_tbl_Department");

            entity.HasOne(d => d.Designation).WithMany(p => p.tbl_Employee)
                .HasForeignKey(d => d.Designation_ID)
                .HasConstraintName("FK_tbl_Employee_tbl_Designation");

            entity.HasOne(d => d.Liability_LID4Navigation).WithMany(p => p.tbl_EmployeeLiability_LID4Navigation)
                .HasForeignKey(d => d.Liability_LID4)
                .HasConstraintName("FK_tbl_Employee_tbl_Level41");

            entity.HasOne(d => d.advsalary_LID4Navigation).WithMany(p => p.tbl_Employeeadvsalary_LID4Navigation)
                .HasForeignKey(d => d.advsalary_LID4)
                .HasConstraintName("FK_tbl_Employee_tbl_Level4");
        });

        modelBuilder.Entity<tbl_EmployeeExperience>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_EmployeeSkill");

            entity.Property(e => e.Description)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Duration)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Institiute)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.Employee_CodeNavigation).WithMany(p => p.tbl_EmployeeExperience)
                .HasForeignKey(d => d.Employee_Code)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_EmployeeSkill_tbl_Employee");
        });

        modelBuilder.Entity<tbl_EmployeeFacility>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_EmployeeAssets");

            entity.Property(e => e.Facility)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Value)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Employee_CodeNavigation).WithMany(p => p.tbl_EmployeeFacility)
                .HasForeignKey(d => d.Employee_Code)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_EmployeeAssetsManagement_tbl_Employee");
        });

        modelBuilder.Entity<tbl_EmployeeIncrement>(entity =>
        {
            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_EmployeeIncrementApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_EmployeeIncrement_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_EmployeeIncrement)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_EmployeeIncrement_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_EmployeeIncrementCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_EmployeeIncrement_tbl_User");

            entity.HasOne(d => d.Employee_CodeNavigation).WithMany(p => p.tbl_EmployeeIncrement)
                .HasForeignKey(d => d.Employee_Code)
                .HasConstraintName("FK_tbl_EmployeeIncrement_tbl_Employee");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.tbl_EmployeeIncrementModifiedByNavigation)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_tbl_EmployeeIncrement_tbl_User1");
        });

        modelBuilder.Entity<tbl_EmployeeQualification>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_EmployeeQualification_1");

            entity.Property(e => e.Board_University)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Marks)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Remarks).HasColumnType("text");

            entity.HasOne(d => d.Employee_CodeNavigation).WithMany(p => p.tbl_EmployeeQualification)
                .HasForeignKey(d => d.Employee_Code)
                .HasConstraintName("FK_tbl_EmployeeQualification_tbl_Employee");
        });

        modelBuilder.Entity<tbl_EmployeeReference>(entity =>
        {
            entity.Property(e => e.RefAddress)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.RefContactNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RefName)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.EmpCodeNavigation).WithMany(p => p.tbl_EmployeeReference)
                .HasForeignKey(d => d.EmpCode)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_EmployeeReference_tbl_Employee");
        });

        modelBuilder.Entity<tbl_EmployeeSubject>(entity =>
        {
            entity.HasOne(d => d.Class).WithMany(p => p.tbl_EmployeeSubject)
                .HasForeignKey(d => d.Class_ID)
                .HasConstraintName("FK_tbl_EmployeeSubject_tbl_AddClass");

            entity.HasOne(d => d.Employee_CodeNavigation).WithMany(p => p.tbl_EmployeeSubject)
                .HasForeignKey(d => d.Employee_Code)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_EmployeeSubject_tbl_Employee");

            entity.HasOne(d => d.Section).WithMany(p => p.tbl_EmployeeSubject)
                .HasForeignKey(d => d.Section_ID)
                .HasConstraintName("FK_tbl_EmployeeSubject_tbl_AddSection");

            entity.HasOne(d => d.Subject).WithMany(p => p.tbl_EmployeeSubject)
                .HasForeignKey(d => d.Subject_Id)
                .HasConstraintName("FK_tbl_EmployeeSubject_tbl_Subject");
        });

        modelBuilder.Entity<tbl_ExamSubjects>(entity =>
        {
            entity.Property(e => e.Subject_Codes)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Exams>(entity =>
        {
            entity.HasKey(e => e.ExamID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ExamTitle)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Family_Code>(entity =>
        {
            entity.HasKey(e => e.Family_ID);

            entity.Property(e => e.CNIC)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Father_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mobile1_SMS)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mobile2_SMS)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UserImg)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_Family_Code)
                .HasForeignKey(d => d.CampusId)
                .HasConstraintName("FK_tbl_Family_Code_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_Family_CodeCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_Family_Code_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_Family_CodeModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_Family_Code_tbl_User1");
        });

        modelBuilder.Entity<tbl_FatherMotherQualification>(entity =>
        {
            entity.HasKey(e => e.FMQOID);

            entity.Property(e => e.FMQO)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_FeeBatch>(entity =>
        {
            entity.HasKey(e => e.Batch_ID);

            entity.Property(e => e.Batch_ID).ValueGeneratedNever();
            entity.Property(e => e.Batch_Period)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_FeePosting>(entity =>
        {
            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.ChallanNo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CommandType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.FeeMonth)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FeeYear)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Remarks)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_FeePostingApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_FeePosting_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_FeePosting)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_FeePosting_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_FeePostingCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_FeePosting_tbl_User");

            entity.HasOne(d => d.Fund).WithMany(p => p.tbl_FeePosting)
                .HasForeignKey(d => d.FundID)
                .HasConstraintName("FK_tbl_FeePosting_tbl_Funds");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_FeePostingModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_FeePosting_tbl_User1");

            entity.HasOne(d => d.Reg).WithMany(p => p.tbl_FeePosting)
                .HasForeignKey(d => d.Reg_ID)
                .HasConstraintName("FK_tbl_FeePosting_tbl_AddClass");

            entity.HasOne(d => d.Section).WithMany(p => p.tbl_FeePosting)
                .HasForeignKey(d => d.SectionID)
                .HasConstraintName("FK_tbl_FeePosting_tbl_AddSection");
        });

        modelBuilder.Entity<tbl_FeeReceiveDetail>(entity =>
        {
            entity.Property(e => e.Challan_No)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.FeeMonth)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FeeYear)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Remarks)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.Fund).WithMany(p => p.tbl_FeeReceiveDetail)
                .HasForeignKey(d => d.FundID)
                .HasConstraintName("FK_tbl_FeeReceiveDetail_tbl_Funds");

            entity.HasOne(d => d.Receipt).WithMany(p => p.tbl_FeeReceiveDetail)
                .HasForeignKey(d => d.Receipt_ID)
                .HasConstraintName("FK_tbl_FeeReceiveDetail_tbl_FeeReceiveMaster");
        });

        modelBuilder.Entity<tbl_FeeReceiveMaster>(entity =>
        {
            entity.HasKey(e => e.Receipt_ID);

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.ChallanNo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.PaymentMode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RefNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.fbrInvoiceNo)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_FeeReceiveMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_FeeReceiveMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_FeeReceiveMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_FeeReceiveMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_FeeReceiveMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_FeeReceiveMaster_tbl_User");

            entity.HasOne(d => d.LID4Navigation).WithMany(p => p.tbl_FeeReceiveMaster)
                .HasForeignKey(d => d.LID4)
                .HasConstraintName("FK_tbl_FeeReceiveMaster_tbl_Level4");

            entity.HasOne(d => d.ModifiyByNavigation).WithMany(p => p.tbl_FeeReceiveMasterModifiyByNavigation)
                .HasForeignKey(d => d.ModifiyBy)
                .HasConstraintName("FK_tbl_FeeReceiveMaster_tbl_User1");

            entity.HasOne(d => d.Reg).WithMany(p => p.tbl_FeeReceiveMaster)
                .HasForeignKey(d => d.RegID)
                .HasConstraintName("FK_tbl_FeeReceiveMaster_tbl_StudentRegistration");
        });

        modelBuilder.Entity<tbl_Funds>(entity =>
        {
            entity.HasKey(e => e.FundID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.FeeCycle)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.FundName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_Funds)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_Funds_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_FundsCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_Funds_tbl_User");

            entity.HasOne(d => d.LID4Navigation).WithMany(p => p.tbl_Funds)
                .HasForeignKey(d => d.LID4)
                .HasConstraintName("FK_tbl_Funds_tbl_Level4");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_FundsModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_Funds_tbl_User1");
        });

        modelBuilder.Entity<tbl_Grade>(entity =>
        {
            entity.HasKey(e => e.GradeID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Grade)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.GradesImg)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.PositionImg)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Remarks1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RemarksFemale)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RemarksMale)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_Grade)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_Grade_tbl_Campus");

            entity.HasOne(d => d.ClassGroup).WithMany(p => p.tbl_Grade)
                .HasForeignKey(d => d.ClassGroupID)
                .HasConstraintName("FK_tbl_Grade_tbl_ClassGroup");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_Grade)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_Grade_tbl_User");
        });

        modelBuilder.Entity<tbl_Holidays>(entity =>
        {
            entity.Property(e => e.Holiday_For)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_InquiryDetail>(entity =>
        {
            entity.HasOne(d => d.Inquiry).WithMany(p => p.tbl_InquiryDetail)
                .HasForeignKey(d => d.InquiryID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_InquiryDetail_tbl_InquiryMaster");
        });

        modelBuilder.Entity<tbl_InquiryMaster>(entity =>
        {
            entity.HasKey(e => e.InquiryID).HasName("PK_tbl_Inquiry");

            entity.Property(e => e.CancelReason)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.ReferBy)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VisitorEmail).HasMaxLength(50);
            entity.Property(e => e.VisitorMobile1)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.VisitorMobile2)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.VisitorName).HasMaxLength(500);
            entity.Property(e => e.VisitorPhone)
                .HasMaxLength(11)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Item>(entity =>
        {
            entity.HasKey(e => e.Item_ID).HasName("PK_tbl_Product");

            entity.Property(e => e.Creation_DateTime).HasColumnType("datetime");
            entity.Property(e => e.Item_Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Item_Name).HasMaxLength(500);
            entity.Property(e => e.Item_NameUrdu).HasMaxLength(500);
            entity.Property(e => e.Item_Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MinStock).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.OpeningDT).HasColumnType("datetime");
            entity.Property(e => e.Picture_Path)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Place).HasMaxLength(250);
            entity.Property(e => e.ProductSr)
                .HasMaxLength(25)
                .IsUnicode(false);

            entity.HasOne(d => d.Category).WithMany(p => p.tbl_Item)
                .HasForeignKey(d => d.Category_ID)
                .HasConstraintName("FK_tbl_Item_tbl_ItemCategory");

            entity.HasOne(d => d.Created_ByNavigation).WithMany(p => p.tbl_Item)
                .HasForeignKey(d => d.Created_By)
                .HasConstraintName("FK_tbl_Item_tbl_User");

            entity.HasOne(d => d.Main_Category).WithMany(p => p.tbl_Item)
                .HasForeignKey(d => d.Main_CategoryID)
                .HasConstraintName("FK_tbl_Item_tbl_ItemMainCategory");

            entity.HasOne(d => d.SessionYearNavigation).WithMany(p => p.tbl_Item)
                .HasForeignKey(d => d.SessionYear)
                .HasConstraintName("FK_tbl_Item_tbl_AcadmicYear");

            entity.HasOne(d => d.SubCategory).WithMany(p => p.tbl_Item)
                .HasForeignKey(d => d.SubCategory_ID)
                .HasConstraintName("FK_tbl_Item_tbl_ItemSubCategory");
        });

        modelBuilder.Entity<tbl_ItemCategory>(entity =>
        {
            entity.HasKey(e => e.Category_ID).HasName("PK_tbl_Group");

            entity.Property(e => e.Category_Name)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Category_NameInUrdu).HasMaxLength(500);
            entity.Property(e => e.Creation_DateTime).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Main_Category).WithMany(p => p.tbl_ItemCategory)
                .HasForeignKey(d => d.Main_Category_ID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_Category_tbl_MainCategory");
        });

        modelBuilder.Entity<tbl_ItemMainCategory>(entity =>
        {
            entity.HasKey(e => e.MainCategory_ID).HasName("PK_tbl_Category");

            entity.Property(e => e.Creation_DateTime).HasColumnType("datetime");
            entity.Property(e => e.MainCategory_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MainCategory_NameInUrdu).HasMaxLength(50);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_ItemMou>(entity =>
        {
            entity.HasKey(e => e.Mou_ID).HasName("PK_UOM");

            entity.Property(e => e.Creation_DateTime).HasColumnType("datetime");
            entity.Property(e => e.Mou_Name)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Mou_NameUrdu).HasMaxLength(100);
        });

        modelBuilder.Entity<tbl_ItemOpening>(entity =>
        {
            entity.HasKey(e => e.OpeningID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Remarks)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");
        });

        modelBuilder.Entity<tbl_ItemOpeningDetail>(entity =>
        {
            entity.Property(e => e.Qty).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Rate).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_ItemOpeningDetail)
                .HasForeignKey(d => d.Item_ID)
                .HasConstraintName("FK_tbl_ItemOpeningDetail_tbl_Item");

            entity.HasOne(d => d.Opening).WithMany(p => p.tbl_ItemOpeningDetail)
                .HasForeignKey(d => d.OpeningID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ItemOpeningDetail_tbl_ItemOpening");
        });

        modelBuilder.Entity<tbl_ItemSubCategory>(entity =>
        {
            entity.HasKey(e => e.SubCategory_ID).HasName("PK_tbl_SubCategory");

            entity.Property(e => e.ColorName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Creation_DateTime).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.SubCategory_Name)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.SubCategory_NameInUrdu).HasMaxLength(500);

            entity.HasOne(d => d.Category).WithMany(p => p.tbl_ItemSubCategory)
                .HasForeignKey(d => d.Category_ID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_SubCategory_tbl_Category");

            entity.HasOne(d => d.MainCategory).WithMany(p => p.tbl_ItemSubCategory)
                .HasForeignKey(d => d.MainCategoryID)
                .HasConstraintName("FK_tbl_ItemSubCategory_tbl_ItemMainCategory");
        });

        modelBuilder.Entity<tbl_JVDetail>(entity =>
        {
            entity.Property(e => e.Credit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Debit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.RectNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.Camp).WithMany(p => p.tbl_JVDetail)
                .HasForeignKey(d => d.CampID)
                .HasConstraintName("FK_tbl_JVDetail_tbl_Campus");

            entity.HasOne(d => d.Employee).WithMany(p => p.tbl_JVDetail)
                .HasForeignKey(d => d.EmployeeID)
                .HasConstraintName("FK_tbl_JVDetail_tbl_Employee");

            entity.HasOne(d => d.JVMaster).WithMany(p => p.tbl_JVDetail)
                .HasForeignKey(d => d.JVMasterID)
                .HasConstraintName("FK_tbl_JVDetail_tbl_JVMaster");

            entity.HasOne(d => d.Level4).WithMany(p => p.tbl_JVDetail)
                .HasForeignKey(d => d.Level4ID)
                .HasConstraintName("FK_tbl_JVDetail_tbl_Level4");

            entity.HasOne(d => d.SubAcc).WithMany(p => p.tbl_JVDetail)
                .HasForeignKey(d => d.SubAccID)
                .HasConstraintName("FK_tbl_JVDetail_tbl_SubAccount");
        });

        modelBuilder.Entity<tbl_JVMaster>(entity =>
        {
            entity.HasKey(e => e.JVMasterID);

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.TotalCredit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.TotalDebit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_JVMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_JVMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_JVMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_JVMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_JVMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_JVMaster_tbl_User");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.tbl_JVMasterModifiedByNavigation)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_tbl_JVMaster_tbl_User1");

            entity.HasOne(d => d.SessionYearNavigation).WithMany(p => p.tbl_JVMaster)
                .HasForeignKey(d => d.SessionYear)
                .HasConstraintName("FK_tbl_JVMaster_tbl_AcadmicYear");
        });

        modelBuilder.Entity<tbl_Level1>(entity =>
        {
            entity.HasKey(e => e.LID1);

            entity.Property(e => e.LID1).ValueGeneratedNever();
            entity.Property(e => e.Title1)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Level2>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_Level2_1");

            entity.Property(e => e.LID2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Title2)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.LID1Navigation).WithMany(p => p.tbl_Level2)
                .HasForeignKey(d => d.LID1)
                .HasConstraintName("FK_tbl_Level2_tbl_Level1");
        });

        modelBuilder.Entity<tbl_Level3>(entity =>
        {
            entity.Property(e => e.LID3)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Title3)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.LID2Navigation).WithMany(p => p.tbl_Level3)
                .HasForeignKey(d => d.LID2)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbl_Level3_tbl_Level3");
        });

        modelBuilder.Entity<tbl_Level4>(entity =>
        {
            entity.Property(e => e.LID4)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Titlle4)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.LID3Navigation).WithMany(p => p.tbl_Level4)
                .HasForeignKey(d => d.LID3)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbl_Level4_tbl_Level3");
        });

        modelBuilder.Entity<tbl_LibBookIssueDetail>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.LostNotes).HasMaxLength(250);
            entity.Property(e => e.ReceivedBy)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.LibBookIssue).WithMany(p => p.tbl_LibBookIssueDetail)
                .HasForeignKey(d => d.LibBookIssueID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_LibBookIssueDetail_tbl_LibBookIssueMaster");
        });

        modelBuilder.Entity<tbl_LibBookIssueMaster>(entity =>
        {
            entity.HasKey(e => e.LibBookIssueID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.IssueBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_LibBookIssueMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_LibBookIssueMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_LibBookIssueMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_LibBookIssueMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_LibBookIssueMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_LibBookIssueMaster_tbl_User1");

            entity.HasOne(d => d.Student).WithMany(p => p.tbl_LibBookIssueMaster)
                .HasForeignKey(d => d.StudentID)
                .HasConstraintName("FK_tbl_LibBookIssueMaster_tbl_StudentRegistration");
        });

        modelBuilder.Entity<tbl_MaterialIssueDetail>(entity =>
        {
            entity.HasOne(d => d.Issue).WithMany(p => p.tbl_MaterialIssueDetail)
                .HasForeignKey(d => d.IssueID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_MaterialIssueDetail_tbl_MaterialIssueMaster");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_MaterialIssueDetail)
                .HasForeignKey(d => d.ItemID)
                .HasConstraintName("FK_tbl_MaterialIssueDetail_tbl_Item");

            entity.HasOne(d => d.Mou).WithMany(p => p.tbl_MaterialIssueDetail)
                .HasForeignKey(d => d.MouID)
                .HasConstraintName("FK_tbl_MaterialIssueDetail_tbl_ItemMou");

            entity.HasOne(d => d.Store).WithMany(p => p.tbl_MaterialIssueDetail)
                .HasForeignKey(d => d.StoreID)
                .HasConstraintName("FK_tbl_MaterialIssueDetail_tbl_Store");
        });

        modelBuilder.Entity<tbl_MaterialIssueMaster>(entity =>
        {
            entity.HasKey(e => e.IssueID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_MaterialIssueMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_MaterialIssueMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_MaterialIssueMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_MaterialIssueMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_MaterialIssueMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_MaterialIssueMaster_tbl_User1");

            entity.HasOne(d => d.Student).WithMany(p => p.tbl_MaterialIssueMaster)
                .HasForeignKey(d => d.StudentID)
                .HasConstraintName("FK_tbl_MaterialIssueMaster_tbl_StudentRegistration");

            entity.HasOne(d => d.Teacher).WithMany(p => p.tbl_MaterialIssueMaster)
                .HasForeignKey(d => d.TeacherID)
                .HasConstraintName("FK_tbl_MaterialIssueMaster_tbl_Employee");
        });

        modelBuilder.Entity<tbl_MaterialReceiveDetail>(entity =>
        {
            entity.HasOne(d => d.Item).WithMany(p => p.tbl_MaterialReceiveDetail)
                .HasForeignKey(d => d.ItemID)
                .HasConstraintName("FK_tbl_MaterialReceiveDetail_tbl_Item");

            entity.HasOne(d => d.Mou).WithMany(p => p.tbl_MaterialReceiveDetail)
                .HasForeignKey(d => d.MouID)
                .HasConstraintName("FK_tbl_MaterialReceiveDetail_tbl_ItemMou");

            entity.HasOne(d => d.Receive).WithMany(p => p.tbl_MaterialReceiveDetail)
                .HasForeignKey(d => d.ReceiveID)
                .HasConstraintName("FK_tbl_MaterialReceiveDetail_tbl_MaterialReceiveMaster");

            entity.HasOne(d => d.Store).WithMany(p => p.tbl_MaterialReceiveDetail)
                .HasForeignKey(d => d.StoreID)
                .HasConstraintName("FK_tbl_MaterialReceiveDetail_tbl_Store");
        });

        modelBuilder.Entity<tbl_MaterialReceiveMaster>(entity =>
        {
            entity.HasKey(e => e.ReceiveID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_MaterialReceiveMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_MaterialReceiveMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_MaterialReceiveMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_MaterialReceiveMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_MaterialReceiveMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_MaterialReceiveMaster_tbl_User1");

            entity.HasOne(d => d.Vendor).WithMany(p => p.tbl_MaterialReceiveMaster)
                .HasForeignKey(d => d.VendorID)
                .HasConstraintName("FK_tbl_MaterialReceiveMaster_tbl_SubAccount");
        });

        modelBuilder.Entity<tbl_MaterialRequestDetail>(entity =>
        {
            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_MaterialRequestDetail)
                .HasForeignKey(d => d.ItemID)
                .HasConstraintName("FK_tbl_MaterialRequestDetail_tbl_Item");

            entity.HasOne(d => d.Request).WithMany(p => p.tbl_MaterialRequestDetail)
                .HasForeignKey(d => d.RequestID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_MaterialRequestDetail_tbl_MaterialRequestMaster");
        });

        modelBuilder.Entity<tbl_MaterialRequestMaster>(entity =>
        {
            entity.HasKey(e => e.RequestID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.RequestFrom)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_MaterialRequestMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_MaterialRequestMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_MaterialRequestMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_MaterialRequestMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_MaterialRequestMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_MaterialRequestMaster_tbl_User1");

            entity.HasOne(d => d.Student).WithMany(p => p.tbl_MaterialRequestMaster)
                .HasForeignKey(d => d.StudentID)
                .HasConstraintName("FK_tbl_MaterialRequestMaster_tbl_StudentRegistration");

            entity.HasOne(d => d.Teacher).WithMany(p => p.tbl_MaterialRequestMaster)
                .HasForeignKey(d => d.TeacherID)
                .HasConstraintName("FK_tbl_MaterialRequestMaster_tbl_Employee");
        });

        modelBuilder.Entity<tbl_MaterialTransferDetail>(entity =>
        {
            entity.HasOne(d => d.Item).WithMany(p => p.tbl_MaterialTransferDetail)
                .HasForeignKey(d => d.ItemID)
                .HasConstraintName("FK_tbl_MaterialTransferDetail_tbl_Item");

            entity.HasOne(d => d.StoreIDFromNavigation).WithMany(p => p.tbl_MaterialTransferDetailStoreIDFromNavigation)
                .HasForeignKey(d => d.StoreIDFrom)
                .HasConstraintName("FK_tbl_MaterialTransferDetail_tbl_Store");

            entity.HasOne(d => d.StoreIDToNavigation).WithMany(p => p.tbl_MaterialTransferDetailStoreIDToNavigation)
                .HasForeignKey(d => d.StoreIDTo)
                .HasConstraintName("FK_tbl_MaterialTransferDetail_tbl_Store1");

            entity.HasOne(d => d.Transfer).WithMany(p => p.tbl_MaterialTransferDetail)
                .HasForeignKey(d => d.TransferID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_MaterialTransferDetail_tbl_MaterialTransferMaster");
        });

        modelBuilder.Entity<tbl_MaterialTransferMaster>(entity =>
        {
            entity.HasKey(e => e.TransferID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Notes).HasMaxLength(500);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_MaterialTransferMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_MaterialTransferMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_MaterialTransferMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_MaterialTransferMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_MaterialTransferMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_MaterialTransferMaster_tbl_User1");
        });

        modelBuilder.Entity<tbl_ObservationDetail>(entity =>
        {
            entity.HasOne(d => d.Obv).WithMany(p => p.tbl_ObservationDetail)
                .HasForeignKey(d => d.ObvID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ObservationDetail_tbl_ObservationMaster");

            entity.HasOne(d => d.PCategory).WithMany(p => p.tbl_ObservationDetail)
                .HasForeignKey(d => d.PCategoryID)
                .HasConstraintName("FK_tbl_ObservationDetail_tbl_PerformanceCategory");

            entity.HasOne(d => d.PSubCategory).WithMany(p => p.tbl_ObservationDetail)
                .HasForeignKey(d => d.PSubCategoryID)
                .HasConstraintName("FK_tbl_ObservationDetail_tbl_PerformanceSubCategory");
        });

        modelBuilder.Entity<tbl_ObservationMaster>(entity =>
        {
            entity.HasKey(e => e.ObvID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_POSDetail>(entity =>
        {
            entity.Property(e => e.CostRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Qty)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 3)");
            entity.Property(e => e.Rate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Invoice_NoNavigation).WithMany(p => p.tbl_POSDetail)
                .HasForeignKey(d => d.Invoice_No)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_POSDetail_tbl_POSMaster");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_POSDetail)
                .HasForeignKey(d => d.Item_ID)
                .HasConstraintName("FK_tbl_POSDetail_tbl_Item");

            entity.HasOne(d => d.Mou).WithMany(p => p.tbl_POSDetail)
                .HasForeignKey(d => d.MouID)
                .HasConstraintName("FK_tbl_POSDetail_tbl_ItemMou");

            entity.HasOne(d => d.Store).WithMany(p => p.tbl_POSDetail)
                .HasForeignKey(d => d.StoreID)
                .HasConstraintName("FK_tbl_POSDetail_tbl_Store");
        });

        modelBuilder.Entity<tbl_POSMaster>(entity =>
        {
            entity.HasKey(e => e.Invoice_No);

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.DiscAmt).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.DiscPerc).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.PaymentMode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Ref_No)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalBill).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalNetBill).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Typ)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(40)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_POSMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_POSMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_POSMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_POSMaster_tbl_Campus");

            entity.HasOne(d => d.CashAc).WithMany(p => p.tbl_POSMasterCashAc)
                .HasForeignKey(d => d.CashAcID)
                .HasConstraintName("FK_tbl_POSMaster_tbl_Level41");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_POSMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_POSMaster_tbl_User");

            entity.HasOne(d => d.Employee).WithMany(p => p.tbl_POSMaster)
                .HasForeignKey(d => d.EmployeeID)
                .HasConstraintName("FK_tbl_POSMaster_tbl_Employee");

            entity.HasOne(d => d.Level4).WithMany(p => p.tbl_POSMasterLevel4)
                .HasForeignKey(d => d.Level4ID)
                .HasConstraintName("FK_tbl_POSMaster_tbl_Level4");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_POSMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_POSMaster_tbl_User1");

            entity.HasOne(d => d.Student).WithMany(p => p.tbl_POSMaster)
                .HasForeignKey(d => d.StudentID)
                .HasConstraintName("FK_tbl_POSMaster_tbl_StudentRegistration");

            entity.HasOne(d => d.Vendor).WithMany(p => p.tbl_POSMaster)
                .HasForeignKey(d => d.VendorID)
                .HasConstraintName("FK_tbl_POSMaster_tbl_POSMaster1");
        });

        modelBuilder.Entity<tbl_Performance>(entity =>
        {
            entity.HasKey(e => e.PID).HasName("PK_tbl_Performance_1");

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_PerformanceCategory>(entity =>
        {
            entity.HasKey(e => e.PCategoryID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_PerformanceDetailEmp>(entity =>
        {
            entity.HasOne(d => d.PIDENavigation).WithMany(p => p.tbl_PerformanceDetailEmp)
                .HasForeignKey(d => d.PIDE)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_PerformanceDetailEmp_tbl_PerformanceMasterEmp");
        });

        modelBuilder.Entity<tbl_PerformanceDetailStudent>(entity =>
        {
            entity.HasOne(d => d.PIDNavigation).WithMany(p => p.tbl_PerformanceDetailStudent)
                .HasForeignKey(d => d.PID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_PerformanceDetailStudent_tbl_PerformanceMasterStudent");
        });

        modelBuilder.Entity<tbl_PerformanceMasterEmp>(entity =>
        {
            entity.HasKey(e => e.PIDE);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_PerformanceMasterStudent>(entity =>
        {
            entity.HasKey(e => e.PID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_PerformanceSubCategory>(entity =>
        {
            entity.HasKey(e => e.PSubCategoryID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_PeriodAllocation>(entity =>
        {
            entity.HasKey(e => e.AllocID);

            entity.HasOne(d => d.AllocMaster).WithMany(p => p.tbl_PeriodAllocation)
                .HasForeignKey(d => d.AllocMasterID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_PeriodAllocation_tbl_PeriodAllocationMaster");

            entity.HasOne(d => d.Subjec).WithMany(p => p.tbl_PeriodAllocation)
                .HasForeignKey(d => d.SubjecID)
                .HasConstraintName("FK_tbl_PeriodAllocation_tbl_Subject");

            entity.HasOne(d => d.Teacher).WithMany(p => p.tbl_PeriodAllocation)
                .HasForeignKey(d => d.TeacherID)
                .HasConstraintName("FK_tbl_PeriodAllocation_tbl_Employee");
        });

        modelBuilder.Entity<tbl_PeriodAllocationMaster>(entity =>
        {
            entity.HasKey(e => e.AllocMasterID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Title)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Periods>(entity =>
        {
            entity.HasKey(e => e.PeriodID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.PeriodsTitle)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_PolicySOPDetail>(entity =>
        {
            entity.HasOne(d => d.PS).WithMany(p => p.tbl_PolicySOPDetail)
                .HasForeignKey(d => d.PSID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_PolicySOPDetail_tbl_PolicySOPMaster");
        });

        modelBuilder.Entity<tbl_PolicySOPMaster>(entity =>
        {
            entity.HasKey(e => e.PSID);

            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.FileAttach).HasMaxLength(250);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Number)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Title).HasMaxLength(250);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_PolicySOPMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_PolicySOPMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_PolicySOPMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_PolicySOPMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_PolicySOPMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_PolicySOPMaster_tbl_User1");
        });

        modelBuilder.Entity<tbl_QuestionBank>(entity =>
        {
            entity.HasKey(e => e.QuestionID).HasName("PK_QuestionBank");

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_ReamsDefine>(entity =>
        {
            entity.HasKey(e => e.Rid);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Remarks).HasMaxLength(250);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_ReamsDefine)
                .HasForeignKey(d => d.CampusId)
                .HasConstraintName("FK_tbl_ReamsDefine_tbl_Campus");

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_ReamsDefine)
                .HasForeignKey(d => d.ClassId)
                .HasConstraintName("FK_tbl_ReamsDefine_tbl_AddClass");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_ReamsDefineCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_ReamsDefine_tbl_ReamsDefine");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_ReamsDefineModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_ReamsDefine_tbl_User");

            entity.HasOne(d => d.Session).WithMany(p => p.tbl_ReamsDefine)
                .HasForeignKey(d => d.SessionId)
                .HasConstraintName("FK_tbl_ReamsDefine_tbl_AcadmicYear");
        });

        modelBuilder.Entity<tbl_ReamsReceive>(entity =>
        {
            entity.HasKey(e => e.RecId);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Remarks).HasMaxLength(250);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_ReamsReceive)
                .HasForeignKey(d => d.CampusId)
                .HasConstraintName("FK_tbl_ReamsReceive_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_ReamsReceiveCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_ReamsReceive_tbl_User");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_ReamsReceive)
                .HasForeignKey(d => d.Item_ID)
                .HasConstraintName("FK_tbl_ReamsReceive_tbl_Item");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_ReamsReceiveModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_ReamsReceive_tbl_User1");

            entity.HasOne(d => d.Reg).WithMany(p => p.tbl_ReamsReceive)
                .HasForeignKey(d => d.RegID)
                .HasConstraintName("FK_tbl_ReamsReceive_tbl_StudentRegistration");

            entity.HasOne(d => d.Session).WithMany(p => p.tbl_ReamsReceive)
                .HasForeignKey(d => d.SessionId)
                .HasConstraintName("FK_tbl_ReamsReceive_tbl_AcadmicYear");

            entity.HasOne(d => d.Store).WithMany(p => p.tbl_ReamsReceive)
                .HasForeignKey(d => d.StoreID)
                .HasConstraintName("FK_tbl_ReamsReceive_tbl_Store");
        });

        modelBuilder.Entity<tbl_Reason>(entity =>
        {
            entity.Property(e => e.Form)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_ResultBatch>(entity =>
        {
            entity.HasKey(e => e.BatchID);

            entity.Property(e => e.BatchName).HasMaxLength(250);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_ResultBatch)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_ResultBatch_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_ResultBatchCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_ResultBatch_tbl_User");

            entity.HasOne(d => d.Exam).WithMany(p => p.tbl_ResultBatch)
                .HasForeignKey(d => d.ExamID)
                .HasConstraintName("FK_tbl_ResultBatch_tbl_Exams");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_ResultBatchModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_ResultBatch_tbl_User1");
        });

        modelBuilder.Entity<tbl_ResultEntry>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_ResultEntry2");

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Reg_No)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Result).WithMany(p => p.tbl_ResultEntry)
                .HasForeignKey(d => d.ResultID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ResultEntry_tbl_ResultMaster");
        });

        modelBuilder.Entity<tbl_ResultMaster>(entity =>
        {
            entity.HasKey(e => e.ResultID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Batch).WithMany(p => p.tbl_ResultMaster)
                .HasForeignKey(d => d.BatchID)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_ResultBatch");

            entity.HasOne(d => d.ClassGroup).WithMany(p => p.tbl_ResultMaster)
                .HasForeignKey(d => d.ClassGroupID)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_ClassGroup");

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_ResultMaster)
                .HasForeignKey(d => d.ClassID)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_AddClass");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_ResultMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_ResultMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_User1");

            entity.HasOne(d => d.Section).WithMany(p => p.tbl_ResultMaster)
                .HasForeignKey(d => d.SectionID)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_AddSection");

            entity.HasOne(d => d.Subject).WithMany(p => p.tbl_ResultMaster)
                .HasForeignKey(d => d.SubjectID)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_Subject");

            entity.HasOne(d => d.Teacher).WithMany(p => p.tbl_ResultMaster)
                .HasForeignKey(d => d.TeacherID)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_Employee");

            entity.HasOne(d => d.Year).WithMany(p => p.tbl_ResultMaster)
                .HasForeignKey(d => d.YearID)
                .HasConstraintName("FK_tbl_ResultMaster_tbl_AcadmicYear");
        });

        modelBuilder.Entity<tbl_SalaryVoucherDetails>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_SalaryVoucherDetails_1");

            entity.HasOne(d => d.Entry_NoNavigation).WithMany(p => p.tbl_SalaryVoucherDetails)
                .HasForeignKey(d => d.Entry_No)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_SalaryVoucherDetails_tbl_SalaryVoucherMaster");
        });

        modelBuilder.Entity<tbl_SalaryVoucherMaster>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Days_In_Month)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Month)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PostDT).HasColumnType("datetime");
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_SalaryVoucherMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_SalaryVoucherMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_SalaryVoucherMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_SalaryVoucherMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_SalaryVoucherMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_SalaryVoucherMaster_tbl_User1");

            entity.HasOne(d => d.PostByNavigation).WithMany(p => p.tbl_SalaryVoucherMasterPostByNavigation)
                .HasForeignKey(d => d.PostBy)
                .HasConstraintName("FK_tbl_SalaryVoucherMaster_tbl_User2");
        });

        modelBuilder.Entity<tbl_ScheduleCalender>(entity =>
        {
            entity.HasKey(e => e.SchID).HasName("PK_tbl_Schedule");

            entity.Property(e => e.ColorCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");

            entity.HasOne(d => d.ClassGroup).WithMany(p => p.tbl_ScheduleCalender)
                .HasForeignKey(d => d.ClassGroupID)
                .HasConstraintName("FK_tbl_ScheduleCalender_tbl_ClassGroup");
        });

        modelBuilder.Entity<tbl_StaffDegree>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.DegreeID).ValueGeneratedOnAdd();
            entity.Property(e => e.DegreeName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_Store>(entity =>
        {
            entity.HasKey(e => e.StoreID);

            entity.Property(e => e.Creation_DateTime).HasColumnType("datetime");
            entity.Property(e => e.StoreCode)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.StoreName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StoreNameUrdu).HasMaxLength(100);
        });

        modelBuilder.Entity<tbl_StudentAndClassroomPsychoDetail>(entity =>
        {
            entity.HasOne(d => d.Assess).WithMany(p => p.tbl_StudentAndClassroomPsychoDetail)
                .HasForeignKey(d => d.AssessID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_StudentAndClassroomPsychoDetail_tbl_StudentAndClassroomPsychoMaster");

            entity.HasOne(d => d.PCategory).WithMany(p => p.tbl_StudentAndClassroomPsychoDetail)
                .HasForeignKey(d => d.PCategoryID)
                .HasConstraintName("FK_tbl_StudentAndClassroomPsychoDetail_tbl_PerformanceCategory");

            entity.HasOne(d => d.PSubCategory).WithMany(p => p.tbl_StudentAndClassroomPsychoDetail)
                .HasForeignKey(d => d.PSubCategoryID)
                .HasConstraintName("FK_tbl_StudentAndClassroomPsychoDetail_tbl_PerformanceSubCategory");
        });

        modelBuilder.Entity<tbl_StudentAndClassroomPsychoDetail2>(entity =>
        {
            entity.HasOne(d => d.Assess).WithMany(p => p.tbl_StudentAndClassroomPsychoDetail2)
                .HasForeignKey(d => d.AssessID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_StudentAndClassroomPsychoDetail2_tbl_StudentAndClassroomPsychoMaster");

            entity.HasOne(d => d.Reg).WithMany(p => p.tbl_StudentAndClassroomPsychoDetail2)
                .HasForeignKey(d => d.RegID)
                .HasConstraintName("FK_tbl_StudentAndClassroomPsychoDetail2_tbl_StudentRegistration");
        });

        modelBuilder.Entity<tbl_StudentAndClassroomPsychoMaster>(entity =>
        {
            entity.HasKey(e => e.AssessID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_StudentAttDetail>(entity =>
        {
            entity.Property(e => e.LateStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Remarks).HasMaxLength(500);
            entity.Property(e => e.SmsDT).HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.Master).WithMany(p => p.tbl_StudentAttDetail)
                .HasForeignKey(d => d.MasterId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_StudentAttDetail_tbl_StudentAttMaster");

            entity.HasOne(d => d.Reg).WithMany(p => p.tbl_StudentAttDetail)
                .HasForeignKey(d => d.RegID)
                .HasConstraintName("FK_tbl_StudentAttDetail_tbl_StudentRegistration");
        });

        modelBuilder.Entity<tbl_StudentAttMaster>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_StudentAttendence");

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Remarks).HasMaxLength(250);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_StudentAttMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_StudentAttMaster_tbl_Campus");

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_StudentAttMaster)
                .HasForeignKey(d => d.ClassID)
                .HasConstraintName("FK_tbl_StudentAttMaster_tbl_AddClass");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_StudentAttMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_StudentAttMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_StudentAttMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_StudentAttMaster_tbl_User1");

            entity.HasOne(d => d.Section).WithMany(p => p.tbl_StudentAttMaster)
                .HasForeignKey(d => d.SectionID)
                .HasConstraintName("FK_tbl_StudentAttMaster_tbl_AddSection");
        });

        modelBuilder.Entity<tbl_StudentFollowup>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.fType)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_StudentFollowup)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_StudentFollowup_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_StudentFollowupCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_StudentFollowup_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_StudentFollowupModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_StudentFollowup_tbl_User1");

            entity.HasOne(d => d.Reg).WithMany(p => p.tbl_StudentFollowup)
                .HasForeignKey(d => d.Reg_ID)
                .HasConstraintName("FK_tbl_StudentFollowup_tbl_StudentRegistration");
        });

        modelBuilder.Entity<tbl_StudentRegistration>(entity =>
        {
            entity.HasKey(e => e.Reg_Id);

            entity.Property(e => e.Activity)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Admission_Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Admitted_by)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Bay_form_No)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Blood)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Caste)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Contact_Person)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.FatherContact_Number)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("((0))");
            entity.Property(e => e.FatherNameUrdu).HasMaxLength(50);
            entity.Property(e => e.Father_CNIC)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Father_Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Father_Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Father_Occupation)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Father_Occupation_Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Father_Qualification)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Frist_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Home_Address)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Home_Address_Urdu).HasMaxLength(50);
            entity.Property(e => e.Home_Phone)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("((0))");
            entity.Property(e => e.House)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Image).IsUnicode(false);
            entity.Property(e => e.Language)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mark_Of_Identification)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Medium)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mobile1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mobile2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mobile3)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.MotherContact_Number)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("((0))");
            entity.Property(e => e.Mother_Cnic)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mother_Email).HasMaxLength(50);
            entity.Property(e => e.Mother_Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Mother_Occupation)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Mother_Occupation_Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mother_Qualification)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.NameUrdu).HasMaxLength(250);
            entity.Property(e => e.Nationality)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Other)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Prev_Class)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Prev_School)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Promote).HasDefaultValue(false);
            entity.Property(e => e.Reference)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Religion)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.School_ID)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SpecialNotes)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Street_Address)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("N/A");
            entity.Property(e => e.SubHouse)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Work_Address)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Work_Phone)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.cur_Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.dosdescription)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.Acad_YearNavigation).WithMany(p => p.tbl_StudentRegistration)
                .HasForeignKey(d => d.Acad_Year)
                .HasConstraintName("FK_tbl_StudentRegistration_tbl_AcadmicYear");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_StudentRegistration)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_StudentRegistration_tbl_Campus");

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_StudentRegistration)
                .HasForeignKey(d => d.Class_ID)
                .HasConstraintName("FK_tbl_StudentRegistration_tbl_AddClass");

            entity.HasOne(d => d.LID4Navigation).WithMany(p => p.tbl_StudentRegistration)
                .HasForeignKey(d => d.LID4)
                .HasConstraintName("FK_tbl_StudentRegistration_tbl_Level4");

            entity.HasOne(d => d.Locality).WithMany(p => p.tbl_StudentRegistration)
                .HasForeignKey(d => d.LocalityID)
                .HasConstraintName("FK_tbl_StudentRegistration_tbl_AddTown");

            entity.HasOne(d => d.Section).WithMany(p => p.tbl_StudentRegistration)
                .HasForeignKey(d => d.Section_ID)
                .HasConstraintName("FK_tbl_StudentRegistration_tbl_AddSection");

            entity.HasOne(d => d.subject_group).WithMany(p => p.tbl_StudentRegistration)
                .HasForeignKey(d => d.subject_group_id)
                .HasConstraintName("FK_tbl_StudentRegistration_tbl_subjectGroup");
        });

        modelBuilder.Entity<tbl_StudentRelation>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Relation).HasMaxLength(100);
            entity.Property(e => e.RelationID).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<tbl_SubAccount>(entity =>
        {
            entity.HasKey(e => e.SubAccount_ID);

            entity.Property(e => e.Address_Urdu).HasMaxLength(200);
            entity.Property(e => e.CNIC)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ContactPerson)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ContatPersonMobile1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ContatPersonMobile2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Fax)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.GST)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.NTN)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name_Urdu).HasMaxLength(200);
            entity.Property(e => e.PhoneNo1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RegDate).HasColumnType("datetime");
            entity.Property(e => e.SubAccount_Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.WebSite)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.LID4Navigation).WithMany(p => p.tbl_SubAccount)
                .HasForeignKey(d => d.LID4)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbl_SubAccount_tbl_Level4");
        });

        modelBuilder.Entity<tbl_Subject>(entity =>
        {
            entity.HasKey(e => e.Subject_Id);

            entity.Property(e => e.ColorCode).HasMaxLength(20);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Level)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.SubjectCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SubjectCode2)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_SubjectBook>(entity =>
        {
            entity.HasKey(e => e.BookID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_SubjectChapter>(entity =>
        {
            entity.HasKey(e => e.ChapterID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Book).WithMany(p => p.tbl_SubjectChapter)
                .HasForeignKey(d => d.BookID)
                .HasConstraintName("FK_tbl_SubjectChapter_tbl_SubjectBook");

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_SubjectChapter)
                .HasForeignKey(d => d.ClassID)
                .HasConstraintName("FK_tbl_SubjectChapter_tbl_AddClass");

            entity.HasOne(d => d.Subject).WithMany(p => p.tbl_SubjectChapter)
                .HasForeignKey(d => d.SubjectID)
                .HasConstraintName("FK_tbl_SubjectChapter_tbl_Subject");
        });

        modelBuilder.Entity<tbl_SyllabusPlanning>(entity =>
        {
            entity.HasKey(e => e.SyllabusID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Unit)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.VerifyDT).HasColumnType("datetime");
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.cw_Document)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.cw_PageNoActivityBook)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.cw_PageNoTextBook)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.cw_WorkSheetUpload)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.hw_Document)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.hw_PageNoActivityBook)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.hw_PageNoTextBook)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.hw_WorkSheetUpload)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.lp_CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.lp_Document)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.lp_ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_SyllabusPlanningYearly>(entity =>
        {
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Months)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VerifyDT).HasColumnType("datetime");
            entity.Property(e => e.VoucherID)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.WorkSheetUpload)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_SyllabusPlanningYearlyDetail>(entity =>
        {
            entity.HasOne(d => d.sow).WithMany(p => p.tbl_SyllabusPlanningYearlyDetail)
                .HasForeignKey(d => d.sowID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_SyllabusPlanningYearlyDetail_tbl_SyllabusPlanningYearly");
        });

        modelBuilder.Entity<tbl_TargetFeeCollection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tbl_IncentiveTarget");

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Month)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_TargetFeeCollection)
                .HasForeignKey(d => d.ClassID)
                .HasConstraintName("FK_tbl_TargetFeeCollection_tbl_AddClass");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_TargetFeeCollectionCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_TargetFeeCollection_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_TargetFeeCollectionModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_TargetFeeCollection_tbl_User1");
        });

        modelBuilder.Entity<tbl_TeacherAndClassroomPsychoDetail>(entity =>
        {
            entity.HasOne(d => d.Assess).WithMany(p => p.tbl_TeacherAndClassroomPsychoDetail)
                .HasForeignKey(d => d.AssessID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_TeacherAndClassroomPsychoDetail_tbl_TeacherAndClassroomPsychoMaster");

            entity.HasOne(d => d.PCategory).WithMany(p => p.tbl_TeacherAndClassroomPsychoDetail)
                .HasForeignKey(d => d.PCategoryID)
                .HasConstraintName("FK_tbl_TeacherAndClassroomPsychoDetail_tbl_PerformanceCategory");

            entity.HasOne(d => d.PSubCategory).WithMany(p => p.tbl_TeacherAndClassroomPsychoDetail)
                .HasForeignKey(d => d.PSubCategoryID)
                .HasConstraintName("FK_tbl_TeacherAndClassroomPsychoDetail_tbl_PerformanceSubCategory");
        });

        modelBuilder.Entity<tbl_TeacherAndClassroomPsychoMaster>(entity =>
        {
            entity.HasKey(e => e.AssessID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_TimeTableGroup>(entity =>
        {
            entity.HasKey(e => e.GroupID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.GroupName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_ToDoGeneralScheduleDetail>(entity =>
        {
            entity.Property(e => e.TimeDuration)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ToDoGenSch).WithMany(p => p.tbl_ToDoGeneralScheduleDetail)
                .HasForeignKey(d => d.ToDoGenSchID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ToDoGeneralScheduleDetail_tbl_ToDoGeneralScheduleMaster");
        });

        modelBuilder.Entity<tbl_ToDoGeneralScheduleMaster>(entity =>
        {
            entity.HasKey(e => e.ToDoGenSchID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_ToDoGeneralScheduleStatus>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_ToDoGeneralStatus");

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TimeDuration)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ToDoMaster).WithMany(p => p.tbl_ToDoGeneralScheduleStatus)
                .HasForeignKey(d => d.ToDoMasterID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ToDoGeneralScheduleStatus_tbl_ToDoMaster");
        });

        modelBuilder.Entity<tbl_ToDoMaster>(entity =>
        {
            entity.HasKey(e => e.ToDoMasterID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
        });

        modelBuilder.Entity<tbl_ToDoScheduleDetail>(entity =>
        {
            entity.Property(e => e.Duration)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PeriodNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.WorkType)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_ToDoScheduleDetail)
                .HasForeignKey(d => d.ClassID)
                .HasConstraintName("FK_tbl_ToDoScheduleDetail_tbl_AddClass");

            entity.HasOne(d => d.Section).WithMany(p => p.tbl_ToDoScheduleDetail)
                .HasForeignKey(d => d.SectionID)
                .HasConstraintName("FK_tbl_ToDoScheduleDetail_tbl_AddSection");

            entity.HasOne(d => d.Teacher).WithMany(p => p.tbl_ToDoScheduleDetail)
                .HasForeignKey(d => d.TeacherID)
                .HasConstraintName("FK_tbl_ToDoScheduleDetail_tbl_Employee");

            entity.HasOne(d => d.ToDo).WithMany(p => p.tbl_ToDoScheduleDetail)
                .HasForeignKey(d => d.ToDoID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ToDoScheduleDetail_tbl_ToDoScheduleMaster");
        });

        modelBuilder.Entity<tbl_ToDoScheduleMaster>(entity =>
        {
            entity.HasKey(e => e.ToDoID);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.EmployeeCodeNavigation).WithMany(p => p.tbl_ToDoScheduleMaster)
                .HasForeignKey(d => d.EmployeeCode)
                .HasConstraintName("FK_tbl_ToDoScheduleMaster_tbl_Employee");
        });

        modelBuilder.Entity<tbl_ToDoScheduleStatus>(entity =>
        {
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TimeDuration)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ToDo)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Class).WithMany(p => p.tbl_ToDoScheduleStatus)
                .HasForeignKey(d => d.ClassID)
                .HasConstraintName("FK_tbl_ToDoScheduleStatus_tbl_AddClass");

            entity.HasOne(d => d.Section).WithMany(p => p.tbl_ToDoScheduleStatus)
                .HasForeignKey(d => d.SectionID)
                .HasConstraintName("FK_tbl_ToDoScheduleStatus_tbl_AddSection");

            entity.HasOne(d => d.Teacher).WithMany(p => p.tbl_ToDoScheduleStatus)
                .HasForeignKey(d => d.TeacherID)
                .HasConstraintName("FK_tbl_ToDoScheduleStatus_tbl_Employee");

            entity.HasOne(d => d.ToDoMaster).WithMany(p => p.tbl_ToDoScheduleStatus)
                .HasForeignKey(d => d.ToDoMasterID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_ToDoScheduleStatus_tbl_ToDoMaster");
        });

        modelBuilder.Entity<tbl_User>(entity =>
        {
            entity.Property(e => e.CreateDT).HasColumnType("datetime");
            entity.Property(e => e.Designation)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.OTP)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserImage).IsUnicode(false);
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_User)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_User_tbl_Campus");

            entity.HasOne(d => d.EmployeeCodeNavigation).WithMany(p => p.tbl_User)
                .HasForeignKey(d => d.EmployeeCode)
                .HasConstraintName("FK_tbl_User_tbl_Employee");

            entity.HasOne(d => d.Role).WithMany(p => p.tbl_User)
                .HasForeignKey(d => d.RoleID)
                .HasConstraintName("FK_tbl_User_tbl_UserRole");
        });

        modelBuilder.Entity<tbl_UserForm>(entity =>
        {
            entity.Property(e => e.Display_Name)
                .IsUnicode(false)
                .HasColumnName("Display Name");
            entity.Property(e => e.FormType)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_UserParent>(entity =>
        {
            entity.HasKey(e => e.UserID);

            entity.Property(e => e.CreateDT).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.OTP)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UserImg)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.UserName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_UserRightsCampus>(entity =>
        {
            entity.Property(e => e.CampusID)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.tbl_UserRightsCampus)
                .HasForeignKey(d => d.UserID)
                .HasConstraintName("FK_tbl_UserRightsCampus_tbl_User");
        });

        modelBuilder.Entity<tbl_UserRole>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_Role");

            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_User_Logs>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_User_Log");

            entity.Property(e => e.Action)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DateTime).HasColumnType("datetime");
            entity.Property(e => e.FormName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbl_User_Rights>(entity =>
        {
            entity.HasOne(d => d.Form).WithMany(p => p.tbl_User_Rights)
                .HasForeignKey(d => d.FormID)
                .HasConstraintName("FK_tbl_User_Rights_tbl_User");
        });

        modelBuilder.Entity<tbl_feeStudentDetail>(entity =>
        {
            entity.HasOne(d => d.Fund).WithMany(p => p.tbl_feeStudentDetail)
                .HasForeignKey(d => d.FundID)
                .HasConstraintName("FK_tbl_feeStudentDetail_tbl_Funds");

            entity.HasOne(d => d.mIdNavigation).WithMany(p => p.tbl_feeStudentDetail)
                .HasForeignKey(d => d.mId)
                .HasConstraintName("FK_tbl_feeStudentMaster_tbl_feeStudentDetail");
        });

        modelBuilder.Entity<tbl_feeStudentMaster>(entity =>
        {
            entity.HasKey(e => e.mId);

            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_feeStudentMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_feeStudentMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_feeStudentMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_feeStudentMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_feeStudentMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_feeStudentMaster_tbl_User1");

            entity.HasOne(d => d.Reg).WithMany(p => p.tbl_feeStudentMaster)
                .HasForeignKey(d => d.Reg_ID)
                .HasConstraintName("FK_tbl_feeStudentMaster_tbl_StudentRegistration");

            entity.HasOne(d => d.SessionYearNavigation).WithMany(p => p.tbl_feeStudentMaster)
                .HasForeignKey(d => d.SessionYear)
                .HasConstraintName("FK_tbl_feeStudentMaster_tbl_AcadmicYear");
        });

        modelBuilder.Entity<tbl_gLedger>(entity =>
        {
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VNo).HasColumnType("numeric(18, 0)");
        });

        modelBuilder.Entity<tbl_pPurchaseDetail>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_PurchaseInvoiceDetail");

            entity.Property(e => e.Qty)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 3)");
            entity.Property(e => e.Rate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Invoice_NoNavigation).WithMany(p => p.tbl_pPurchaseDetail)
                .HasForeignKey(d => d.Invoice_No)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_pPurchaseDetail_tbl_pPurchaseMaster");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_pPurchaseDetail)
                .HasForeignKey(d => d.Item_ID)
                .HasConstraintName("FK_tbl_pPurchaseDetail_tbl_Item");
        });

        modelBuilder.Entity<tbl_pPurchaseMaster>(entity =>
        {
            entity.HasKey(e => e.Invoice_No).HasName("PK_tbl_PurchaseInvoiceMaster");

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.DiscAmt).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.DiscPerc).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Ref_No)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalBill).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalNetBill).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(40)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_pPurchaseMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_pPurchaseMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_pPurchaseMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_pPurchaseMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_pPurchaseMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_pPurchaseMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_pPurchaseMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_pPurchaseMaster_tbl_User1");

            entity.HasOne(d => d.Receive).WithMany(p => p.tbl_pPurchaseMaster)
                .HasForeignKey(d => d.ReceiveID)
                .HasConstraintName("FK_tbl_pPurchaseMaster_tbl_pPurchaseMaster");

            entity.HasOne(d => d.Vendor).WithMany(p => p.tbl_pPurchaseMaster)
                .HasForeignKey(d => d.VendorID)
                .HasConstraintName("FK_tbl_pPurchaseMaster_tbl_pPurchaseMaster1");
        });

        modelBuilder.Entity<tbl_pPurchaseOrderDetail>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_tbl_pPurchOrderDetail");

            entity.Property(e => e.Disc).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Qty).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Rate).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_pPurchaseOrderDetail)
                .HasForeignKey(d => d.Item_ID)
                .HasConstraintName("FK_tbl_pPurchaseOrderDetail_tbl_Item");

            entity.HasOne(d => d.Order).WithMany(p => p.tbl_pPurchaseOrderDetail)
                .HasForeignKey(d => d.Order_ID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_pPurchaseOrderDetail_tbl_pPurchaseOrderMaster");
        });

        modelBuilder.Entity<tbl_pPurchaseOrderMaster>(entity =>
        {
            entity.HasKey(e => e.Order_ID);

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MOP)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.PType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Tax).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_pPurchaseOrderMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_pPurchaseOrderMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_pPurchaseOrderMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_pPurchaseOrderMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_pPurchaseOrderMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_pPurchaseOrderMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_pPurchaseOrderMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_pPurchaseOrderMaster_tbl_User1");

            entity.HasOne(d => d.Supplier).WithMany(p => p.tbl_pPurchaseOrderMaster)
                .HasForeignKey(d => d.Supplier_ID)
                .HasConstraintName("FK_tbl_pPurchaseOrderMaster_tbl_SubAccount");
        });

        modelBuilder.Entity<tbl_pPurchaseReturnDetail>(entity =>
        {
            entity.Property(e => e.Discount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 3)");
            entity.Property(e => e.Qty)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 3)");
            entity.Property(e => e.Rate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Invoice_NoNavigation).WithMany(p => p.tbl_pPurchaseReturnDetail)
                .HasForeignKey(d => d.Invoice_No)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_pPurchaseReturnDetail_tbl_pPurchaseReturnMaster");

            entity.HasOne(d => d.Item).WithMany(p => p.tbl_pPurchaseReturnDetail)
                .HasForeignKey(d => d.Item_ID)
                .HasConstraintName("FK_tbl_pPurchaseReturnDetail_tbl_Item");
        });

        modelBuilder.Entity<tbl_pPurchaseReturnMaster>(entity =>
        {
            entity.HasKey(e => e.Invoice_No);

            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Disc).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ModifyDT).HasColumnType("datetime");
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.Ref_No)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalBill).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalDiscount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalNetBill).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.VoucherNo)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.tbl_pPurchaseReturnMasterApprovedByNavigation)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_tbl_pPurchaseReturnMaster_tbl_User2");

            entity.HasOne(d => d.Campus).WithMany(p => p.tbl_pPurchaseReturnMaster)
                .HasForeignKey(d => d.CampusID)
                .HasConstraintName("FK_tbl_pPurchaseReturnMaster_tbl_Campus");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.tbl_pPurchaseReturnMasterCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_tbl_pPurchaseReturnMaster_tbl_User");

            entity.HasOne(d => d.ModifyByNavigation).WithMany(p => p.tbl_pPurchaseReturnMasterModifyByNavigation)
                .HasForeignKey(d => d.ModifyBy)
                .HasConstraintName("FK_tbl_pPurchaseReturnMaster_tbl_User1");

            entity.HasOne(d => d.Supplier).WithMany(p => p.tbl_pPurchaseReturnMaster)
                .HasForeignKey(d => d.Supplier_ID)
                .HasConstraintName("FK_tbl_pPurchaseReturnMaster_tbl_SubAccount");
        });

        modelBuilder.Entity<tbl_subjectGroup>(entity =>
        {
            entity.Property(e => e.SubjectIDs).IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<vw_CashBook>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_CashBook");

            entity.Property(e => e.AcType)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.AmountIn).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.AmountOut).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.IsPost)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.RectNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<vw_FeeLed>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_FeeLed");

            entity.Property(e => e.ChallanNo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.FeeMonth)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FeeYear)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.InvoiceNo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Remarks)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<vw_Stock>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Stock");

            entity.Property(e => e.AmountIn).HasColumnType("decimal(37, 4)");
            entity.Property(e => e.QtyIn).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Rate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.RefNo)
                .HasMaxLength(1)
                .IsUnicode(false);
        });

        modelBuilder.Entity<vw_gledger>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_gledger");

            entity.Property(e => e.Credit).HasColumnType("decimal(20, 2)");
            entity.Property(e => e.Debit).HasColumnType("decimal(37, 5)");
            entity.Property(e => e.LID2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LID3)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Title1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Title2)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Title3)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Titlle4)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Titlle5)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<vw_gledgerUnion>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_gledgerUnion");

            entity.Property(e => e.AcType)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Credit).HasColumnType("decimal(20, 2)");
            entity.Property(e => e.Debit).HasColumnType("decimal(37, 5)");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.RefNo)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<vw_gledgerUnionGLBatch>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_gledgerUnionGLBatch");

            entity.Property(e => e.AcType)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Credit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Debit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.RefNo)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<vw_gledgerUnionUnpost>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_gledgerUnionUnpost");

            entity.Property(e => e.AcType)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ApprovedDT).HasColumnType("datetime");
            entity.Property(e => e.CreatedDT).HasColumnType("datetime");
            entity.Property(e => e.Credit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Debit).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ModifiedDT).HasColumnType("datetime");
            entity.Property(e => e.RefNo)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherID)
                .HasMaxLength(30)
                .IsUnicode(false);
        });



modelBuilder.Entity<DiaryAccessControl>()
    .Property(x => x.IsActive)
    .HasDefaultValue(true);

modelBuilder.Entity<DiaryAccessControl>()
    .Property(x => x.CreatedDT)
    .HasDefaultValueSql("GETDATE()");


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
