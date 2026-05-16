using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SyllabusPlanning
{
    public long SyllabusID { get; set; }

    public long? VoucherNo { get; set; }

    public string? VoucherID { get; set; }

    public DateOnly? Date { get; set; }

    public int? ClassId { get; set; }

    public int? SectionID { get; set; }

    public int? SubjectID { get; set; }

    public int? BookID { get; set; }

    public long? ChapterID { get; set; }

    public int? TopicID { get; set; }

    public string? Unit { get; set; }

    public string? Topic { get; set; }

    public string? SLOW { get; set; }

    public string? TextBook { get; set; }

    public string? cw_PageNoActivityBook { get; set; }

    public string? cw_PageNoTextBook { get; set; }

    public string? cw_TextBook { get; set; }

    public string? cw_ActivityBook { get; set; }

    public string? cw_WorkSheet { get; set; }

    public string? cw_WorkSheetUpload { get; set; }

    public string? cw_CopyWork { get; set; }

    public string? cw_Resources { get; set; }

    public string? cw_Visit { get; set; }

    public string? cw_Extra { get; set; }

    public string? cw_Document { get; set; }

    public string? hw_PageNoActivityBook { get; set; }

    public string? hw_PageNoTextBook { get; set; }

    public string? hw_WorkSheetUpload { get; set; }

    public string? hw_TextBook { get; set; }

    public string? hw_ActivityBook { get; set; }

    public string? hw_WorkSheet { get; set; }

    public string? hw_Observation { get; set; }

    public string? hw_CopyWork { get; set; }

    public string? hw_Extra { get; set; }

    public string? hw_Document { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusId { get; set; }

    public int? SessionYear { get; set; }

    public string? lp_Preparation { get; set; }

    public int? lp_PreparationTime { get; set; }

    public string? lp_Presentation { get; set; }

    public int? lp_PresentationTime { get; set; }

    public string? lp_Production { get; set; }

    public int? lp_ProductionTime { get; set; }

    public string? lp_WrapUp { get; set; }

    public int? lp_WrapUpTime { get; set; }

    public string? lp_Document { get; set; }

    public int? lp_CreatedBy { get; set; }

    public DateTime? lp_CreatedDT { get; set; }

    public int? lp_ModifyBy { get; set; }

    public DateTime? lp_ModifyDT { get; set; }

    public int? VerifyBy { get; set; }

    public DateTime? VerifyDT { get; set; }

    public string? VerifiedComments { get; set; }

    public string? lp_Activity { get; set; }

    public int? lp_ActivityTime { get; set; }
}
