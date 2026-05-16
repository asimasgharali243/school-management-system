using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SyllabusPlanningYearly
{
    public long ID { get; set; }

    public long? VoucherNo { get; set; }

    public string? VoucherID { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? SubjectID { get; set; }

    public int? BookID { get; set; }

    public long? ChapterID { get; set; }

    public int? TopicID { get; set; }

    public string? Months { get; set; }

    public int? Year { get; set; }

    public int? NoOfDays { get; set; }

    public string? UnitNo { get; set; }

    public string? PageNo { get; set; }

    public string? SyllabusReferences { get; set; }

    public string? Topics { get; set; }

    public string? Activities { get; set; }

    public string? Resources { get; set; }

    public string? GrammerComposition { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusId { get; set; }

    public int? SessionYear { get; set; }

    public int? VerifyBy { get; set; }

    public DateTime? VerifyDT { get; set; }

    public string? VerifiedComments { get; set; }

    public string? ThemeOfMonth { get; set; }

    public string? WorkSheet { get; set; }

    public string? WorkSheetUpload { get; set; }

    public virtual ICollection<tbl_SyllabusPlanningYearlyDetail> tbl_SyllabusPlanningYearlyDetail { get; set; } = new List<tbl_SyllabusPlanningYearlyDetail>();
}
