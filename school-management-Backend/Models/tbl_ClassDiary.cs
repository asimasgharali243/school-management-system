// using System;
// using System.Collections.Generic;

// namespace school_management_Backend.Models;

// public partial class tbl_ClassDiary
// {
//     public int ID { get; set; }

//     public int? DocNo { get; set; }

//     public DateOnly? Date { get; set; }

//     public int? Class_ID { get; set; }

//     public int? Section_ID { get; set; }

//     public int? Employee_Code { get; set; }

//     public int? Subject_ID { get; set; }

//     public string? Home_Work { get; set; }

//     public int? Acad_Year { get; set; }

//     public int? UID { get; set; }
// }

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models;

[Table("tbl_ClassDiary")]
public partial class tbl_ClassDiary
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long dairyID { get; set; }

    public DateOnly? Date { get; set; }

    public int? ClassID { get; set; }

    public int? SectionID { get; set; }

    public int? SubjectID { get; set; }

    public string? ClassWork { get; set; }

    public string? HomeWork { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public bool? isPublished { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovedDT { get; set; }

     public virtual tbl_AddClass? Class { get; set; }
    
    public virtual tbl_AddSection? Section { get; set; }
    
    public virtual tbl_Subject? Subject { get; set; }
    
    public virtual tbl_User? CreatedByUser { get; set; }
    
    public virtual tbl_User? ModifiedByUser { get; set; }
    
    public virtual tbl_User? ApprovedByUser { get; set; }
}