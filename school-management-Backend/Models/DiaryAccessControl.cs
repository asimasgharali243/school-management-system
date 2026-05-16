using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("tbl_DiaryAccessControl")]
    public class DiaryAccessControl
    {
        [Key]
        public int ID { get; set; }

        public int RegID { get; set; }

        public DateTime AllowFrom { get; set; }

        public DateTime AllowTo { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(250)]
        public string Reason { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDT { get; set; } = DateTime.Now;
    }
}