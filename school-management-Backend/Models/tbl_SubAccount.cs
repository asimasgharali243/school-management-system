using System;
using System.Collections.Generic;

namespace school_management_Backend.Models;

public partial class tbl_SubAccount
{
    public int SubAccount_ID { get; set; }

    public string SubAccount_Name { get; set; } = null!;

    public int BusinessType { get; set; }

    public DateTime RegDate { get; set; }

    public string? Address { get; set; }

    public string? PhoneNo1 { get; set; }

    public string? PhoneNo2 { get; set; }

    public string? Fax { get; set; }

    public string? MobileNo { get; set; }

    public string? CNIC { get; set; }

    public string? NTN { get; set; }

    public string? WebSite { get; set; }

    public string? ContactPerson { get; set; }

    public string? ContatPersonMobile1 { get; set; }

    public string? ContatPersonMobile2 { get; set; }

    public string? Email { get; set; }

    public string? GST { get; set; }

    public int LID4 { get; set; }

    public int? UID { get; set; }

    public int? Creadit_Limit { get; set; }

    public string? Name_Urdu { get; set; }

    public string? Address_Urdu { get; set; }

    public int? City_ID { get; set; }

    public int? Zone_ID { get; set; }

    public int? Marketer_ID { get; set; }

    public int? Currency_ID { get; set; }

    public virtual tbl_Level4 LID4Navigation { get; set; } = null!;

    public virtual ICollection<tbl_BankDetail> tbl_BankDetail { get; set; } = new List<tbl_BankDetail>();

    public virtual ICollection<tbl_CashDetail> tbl_CashDetail { get; set; } = new List<tbl_CashDetail>();

    public virtual ICollection<tbl_JVDetail> tbl_JVDetail { get; set; } = new List<tbl_JVDetail>();

    public virtual ICollection<tbl_MaterialReceiveMaster> tbl_MaterialReceiveMaster { get; set; } = new List<tbl_MaterialReceiveMaster>();

    public virtual ICollection<tbl_POSMaster> tbl_POSMaster { get; set; } = new List<tbl_POSMaster>();

    public virtual ICollection<tbl_pPurchaseMaster> tbl_pPurchaseMaster { get; set; } = new List<tbl_pPurchaseMaster>();

    public virtual ICollection<tbl_pPurchaseOrderMaster> tbl_pPurchaseOrderMaster { get; set; } = new List<tbl_pPurchaseOrderMaster>();

    public virtual ICollection<tbl_pPurchaseReturnMaster> tbl_pPurchaseReturnMaster { get; set; } = new List<tbl_pPurchaseReturnMaster>();
}
