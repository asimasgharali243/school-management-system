
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("NotificationLogs")]
    public class NotificationLog
    {
        [Key]
        public long LogID { get; set; }
        
        public long? QueueID { get; set; }
        
        public int UserID { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Action { get; set; } = string.Empty; // 'SENT', 'RECEIVED', 'READ', 'CLICKED'
        
        public DateTime Timestamp { get; set; } = DateTime.Now;
        
        [StringLength(500)]
        public string? Details { get; set; } // ✅ Made nullable
    }
}