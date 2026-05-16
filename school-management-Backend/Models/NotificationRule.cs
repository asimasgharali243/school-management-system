

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("NotificationRules")]
    public class NotificationRule
    {
        [Key]
        public int RuleID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string RuleName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string RuleType { get; set; } = "EVENT"; // 'EVENT', 'SCHEDULED', 'MANUAL', 'CRON'
        
        [Required]
        [StringLength(30)]
        public string Category { get; set; } = "GENERAL"; // 'ATTENDANCE', 'FEE', 'GENERAL', 'EXAM'
        
        // NEW: Flag to mark manual trigger rules
        public bool IsManualTrigger { get; set; } = false;
        
        // Event Configuration
        [StringLength(50)]
        public string? SourceTable { get; set; }
        
        [StringLength(50)]
        public string? TriggerField { get; set; }
        
        [StringLength(100)]
        public string? TriggerValue { get; set; }
        
        // Timing Configuration
        [StringLength(20)]
        public string TimingType { get; set; } = "IMMEDIATE"; // 'IMMEDIATE', 'FIXED_TIME', 'DAYS_OFFSET', 'CRON'
        
        public int? DaysOffset { get; set; }
        
        public TimeSpan? FixedTime { get; set; }
        
        [StringLength(50)]
        public string? CronExpression { get; set; }
        
        // Content Templates
        [Required]
        [StringLength(200)]
        public string TitleTemplate { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string MessageTemplate { get; set; } = string.Empty;
        
        public string? DataTemplate { get; set; }
        
        // Target Configuration
        [Required]
        [StringLength(20)]
        public string TargetType { get; set; } = "ALL"; // 'ALL', 'CLASS', 'SECTION', 'PARENT', 'STUDENT', 'TEACHER'
        
        public string? TargetFilter { get; set; }
        
        // Delivery Options
        public bool IsBatch { get; set; } = false;
        
        [Range(1, 3)]
        public byte Priority { get; set; } = 2; // 1=High, 2=Medium, 3=Low
        
        // Status & Tracking
        public bool IsActive { get; set; } = true;
        
        public DateTime? LastRunTime { get; set; }
        
        public DateTime? NextRunTime { get; set; }
        
        public int TotalRuns { get; set; } = 0;
        
        // Audit
        public int CreatedBy { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public int? ModifiedBy { get; set; }
        
        public DateTime? ModifiedDate { get; set; }
    }
}