using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_PerformanceSubCategory
{
    public int PSubCategoryID { get; set; }

    public string? PSubCategoryName { get; set; }

    public int? TotalMarks { get; set; }

    public int? PCategoryID { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public virtual ICollection<tbl_AssessmentDetail> tbl_AssessmentDetail { get; set; } = new List<tbl_AssessmentDetail>();

    public virtual ICollection<tbl_ObservationDetail> tbl_ObservationDetail { get; set; } = new List<tbl_ObservationDetail>();

    public virtual ICollection<tbl_StudentAndClassroomPsychoDetail> tbl_StudentAndClassroomPsychoDetail { get; set; } = new List<tbl_StudentAndClassroomPsychoDetail>();

    public virtual ICollection<tbl_TeacherAndClassroomPsychoDetail> tbl_TeacherAndClassroomPsychoDetail { get; set; } = new List<tbl_TeacherAndClassroomPsychoDetail>();
}
