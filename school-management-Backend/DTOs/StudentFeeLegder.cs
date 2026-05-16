namespace school_management_Backend.DTOs
{
 public class StudentFeeLedgerResponse
    {


        public string? Date { get; set; }
        public string? VoucherID { get; set; }
        public string? ChallanNo { get; set; }
        public string? FundName { get; set; }
        public string? FeeMonth { get; set; }
        public string? FeeYear { get; set; }



        public string? Debit { get; set; }
        public string? Credit { get; set; }

        public string? Discount { get; set; }

    }
}
   
   