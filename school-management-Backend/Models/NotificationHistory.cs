

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("NotificationHistory")]
    public class NotificationHistory
    {
        [Key]
        public long HistoryID { get; set; }
        
        public int? RuleID { get; set; }
        
        public int UserID { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;
        
        [Required]
        [StringLength(30)]
        public string Category { get; set; } = string.Empty;
        
        public DateTime SentTime { get; set; }
        
        public DateTime? ReadTime { get; set; }
        
        public DateTime ArchivedDate { get; set; } = DateTime.Now;
    }
}