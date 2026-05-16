// DTOs/DiaryDTOs.cs
using System;
using System.Collections.Generic;

namespace school_management_Backend.DTOs
{
    // Class Work Response (sp_PrintClassWork_Result)
    public class ClassWorkResponse
    {
        public int SubjectID { get; set; }
        public string Subject_Name { get; set; }
        public string Book { get; set; }
        public string ChapterName { get; set; }
        public string TopicName { get; set; }
        public string cw_PageNoTextBook { get; set; }
        public string cw_PageNoActivityBook { get; set; }
        public string cw_ActivityBook { get; set; }
        public string cw_TextBook { get; set; }
        public string cw_Resources { get; set; }
        public string hw_PageNoTextBook { get; set; }
        public string hw_TextBook { get; set; }
        public string hw_PageNoActivityBook { get; set; }
        public string hw_ActivityBook { get; set; }
        public string hw_CopyWork { get; set; }
        public string hw_Observation { get; set; }
        public string hw_Extra { get; set; }
        public string Class_Name { get; set; }
    }

    // Scheme of Work Response (sp_rptSchemeOfWorkForMonth_Result)
    public class SchemeOfWorkResponse
    {
        public int SubjectID { get; set; }
        public string Subject_Name { get; set; }
        public string UnitNo { get; set; }
        public string NoOfDays { get; set; }
        public int? BookID { get; set; }
        public string Book { get; set; }
        public int? ChapterID { get; set; }
        public string ChapterName { get; set; }
        public string PageNo { get; set; }
        public string GrammerComposition { get; set; }
        public string Topics { get; set; }
        public string ThemeOfMonth { get; set; }
        public string Class_Name { get; set; }
        public string CampusName { get; set; }
    }

    // Teacher Classes Response
    public class TeacherClassResponse
    {
        public int ClassID { get; set; }
        public string ClassName { get; set; }
        public List<TeacherSectionResponse> Sections { get; set; }
    }

    public class TeacherSectionResponse
    {
        public int SectionID { get; set; }
        public string SectionName { get; set; }
        public List<int> SubjectIDs { get; set; }
        public List<string> SubjectNames { get; set; }
    }

    // Class Wise Subject Response
    public class ClassWiseSubjectResponse
    {
        public int SubjectID { get; set; }
        public string SubjectName { get; set; }
        public int SubjectOrder { get; set; }
    }

    // Diary Entry Request/Response
    public class DiaryEntryRequest
    {
        public int ClassID { get; set; }
        public List<int> SectionIDs { get; set; }
        public int SubjectID { get; set; }
        public DateTime LessonDate { get; set; }
        public string cw_PageNoTextBook { get; set; }
        public string cw_PageNoActivityBook { get; set; }
        public string cw_ActivityBook { get; set; }
        public string cw_TextBook { get; set; }
        public string cw_Resources { get; set; }
        public string hw_PageNoTextBook { get; set; }
        public string hw_TextBook { get; set; }
        public string hw_PageNoActivityBook { get; set; }
        public string hw_ActivityBook { get; set; }
        public string hw_CopyWork { get; set; }
        public string hw_Observation { get; set; }
        public string hw_Extra { get; set; }
    }

    public class BatchDiaryRequest
    {
        public List<DiaryEntryRequest> Entries { get; set; }
    }
}