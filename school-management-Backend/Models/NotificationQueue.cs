

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("NotificationQueue")]
    public class NotificationQueue
    {
        [Key]
        public long QueueID { get; set; }
        
        public int RuleID { get; set; }
        
        [ForeignKey("RuleID")]
        public virtual NotificationRule? NotificationRule { get; set; } // ✅ Made nullable
        
        // Recipient Info
        public int UserID { get; set; }
        
        [StringLength(20)]
        public string? UserType { get; set; } // ✅ Made nullable
        
        [StringLength(500)]
        public string? DeviceToken { get; set; } // ✅ Made nullable
        
        // Content (Resolved)
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;
        
        public string? DataPayload { get; set; } // ✅ Made nullable
        
        // Status
        [StringLength(20)]
        public string Status { get; set; } = "PENDING"; // PENDING, PROCESSING, SENT, FAILED
        
        public byte Priority { get; set; } = 2;
        
        // Timing
        public DateTime ScheduledTime { get; set; }
        
        public DateTime? ProcessedTime { get; set; }
        
        public DateTime? ExpiryTime { get; set; }
        
        // Tracking
        public int AttemptCount { get; set; } = 0;
        
        public DateTime? LastAttemptTime { get; set; }
        
        [StringLength(500)]
        public string? ErrorMessage { get; set; } // ✅ Made nullable
        
        public DateTime CreatedTime { get; set; } = DateTime.Now;
    }
}