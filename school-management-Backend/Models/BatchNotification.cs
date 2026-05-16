using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("BatchNotifications")]
    public class BatchNotification
    {
        [Key]
        public Guid BatchID { get; set; } = Guid.NewGuid();
        
        public int RuleID { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;
        
        public string? DataPayload { get; set; } // ✅ Made nullable
        
        // Target Info
        [Required]
        [StringLength(20)]
        public string TargetType { get; set; } = string.Empty;
        
        public string? TargetFilter { get; set; } // ✅ Made nullable
        
        // Statistics
        public int TotalRecipients { get; set; } = 0;
        
        public int SentCount { get; set; } = 0;
        
        public int FailedCount { get; set; } = 0;
        
        [StringLength(20)]
        public string Status { get; set; } = "PENDING";
        
        public DateTime CreatedTime { get; set; } = DateTime.Now;
        
        public DateTime? CompletedTime { get; set; }
    }
}