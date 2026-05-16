using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_Acadmic_TimeTable
{
    public int ID { get; set; }

    public int? Employee_Code { get; set; }

    public int? Class_ID { get; set; }

    public int? Section_ID { get; set; }

    public int? Subject_Id_P1 { get; set; }

    public int? Subject_Id_P2 { get; set; }

    public int? Subject_Id_P3 { get; set; }

    public int? Subject_Id_P4 { get; set; }

    public int? Subject_Id_P5 { get; set; }

    public int? Subject_Id_P6 { get; set; }

    public int? Subject_Id_P7 { get; set; }

    public int? Subject_Id_P8 { get; set; }

    public int? Subject_Id_P9 { get; set; }

    public int? Subject_Id_P10 { get; set; }

    public int? Subject_Id_P11 { get; set; }

    public int? Acad_Year { get; set; }

    public int? UID { get; set; }

    public int? Period1_Time_ID { get; set; }

    public int? Period2_Time_ID { get; set; }

    public int? Period3_Time_ID { get; set; }

    public int? Period4_Time_ID { get; set; }

    public int? Period6_Time_ID { get; set; }

    public int? Period7_Time_ID { get; set; }

    public int? Period8_Time_ID { get; set; }

    public int? Period9_Time_ID { get; set; }

    public int? Period10_Time_ID { get; set; }

    public int? Period11_Time_ID { get; set; }

    public int? DocNo { get; set; }

    public DateOnly? Issue_Date { get; set; }

    public int? branch_ID { get; set; }
}
