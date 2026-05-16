// DTOs/ComplaintDTOs.cs
using System;
using System.Collections.Generic;

namespace school_management_Backend.DTOs
{
    public class ComplaintCategoryDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool? Active { get; set; }
    }

    public class CreateComplaintDto
    {
        public int Reg_Id { get; set; }
        public int ComplainCategory { get; set; }
        public string ComplaintSubject { get; set; }
        public string ComplainDetails { get; set; }
        public string ComplaintantName { get; set; }
        public string ComplaintantNumber { get; set; }
        public string Priority { get; set; }
        public int? CampusID { get; set; }
        public int? SessionYear { get; set; }
        public int CreatedBy { get; set; }
    }

    public class UpdateComplaintStatusDto
    {
        public long ComplainID { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public int ModifyBy { get; set; }
    }

    public class ComplaintResponseDto
    {
        public long ComplainID { get; set; }
        public int? ComplainNo { get; set; }
        public int? Reg_Id { get; set; }
        public string StudentName { get; set; }
        public string StudentClass { get; set; }
        public string StudentSection { get; set; }
        public int? ComplainCategory { get; set; }
        public string CategoryName { get; set; }
        public string ComplaintSubject { get; set; }
        public string ComplainDetails { get; set; }
        public string ComplaintantName { get; set; }
        public string ComplaintantNumber { get; set; }
        public DateTime? ComplainDate { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime? CreatedDT { get; set; }
        public string CreatedByName { get; set; }
    }

    public class ComplaintListResponseDto
    {
        public List<ComplaintResponseDto> Complaints { get; set; }
        public int TotalCount { get; set; }
    }
}