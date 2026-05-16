using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Complaint
{
    public long ComplainID { get; set; }

    public int? ComplainNo { get; set; }

    public int? Reg_Id { get; set; }

    public int? Employee_Code { get; set; }

    public int? ComplainCategory { get; set; }

    public string? ComplainDetails { get; set; }

    public string? ComplaintantName { get; set; }

    public string? ComplaintantNumber { get; set; }

    public DateOnly? ComplainDate { get; set; }

    public string? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDT { get; set; }

    public int? ModifyBy { get; set; }

    public DateTime? ModifyDT { get; set; }

    public int? CampusID { get; set; }

    public int? SessionYear { get; set; }

    public string? Priority { get; set; }

    public string? ComplaintSubject { get; set; }

    

    public virtual tbl_ComplaintCategory? Category  { get; set; }

    public virtual tbl_StudentRegistration? Student  { get; set; }

    public virtual ICollection<tbl_ComplaintReply> tbl_ComplaintReply { get; set; } = new List<tbl_ComplaintReply>();

    public virtual ICollection<tbl_ComplaintUser> tbl_ComplaintUser { get; set; } = new List<tbl_ComplaintUser>();
}
