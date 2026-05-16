

using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace school_management_Backend.DTOs
{
    public class NotificationRuleDTO
    {
        public int RuleID { get; set; }
        public string RuleName { get; set; } = string.Empty;
        public string RuleType { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsManualTrigger { get; set; }
        public string? SourceTable { get; set; }
        public string? TriggerField { get; set; }
        public string? TriggerValue { get; set; }
        public string? TimingType { get; set; }
        public int? DaysOffset { get; set; }
        public TimeSpan? FixedTime { get; set; }
        public string? CronExpression { get; set; }
        public string TitleTemplate { get; set; } = string.Empty;
        public string MessageTemplate { get; set; } = string.Empty;
        public string? DataTemplate { get; set; }
        public string TargetType { get; set; } = string.Empty;
        
        // ✅ FIXED: Use object instead of JObject to avoid serialization issues
        public object? TargetFilter { get; set; }
        
        public bool IsActive { get; set; }
        public bool IsBatch { get; set; }
        public int Priority { get; set; }
        public DateTime? LastRunTime { get; set; }
        public DateTime? NextRunTime { get; set; }
        public int TotalRuns { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
    }
}