using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json.Linq;

namespace school_management_Backend.Models.ViewModels
{
    public class CreateNotificationRuleVM
    {
        [Required(ErrorMessage = "Rule name is required")]
        [StringLength(100, ErrorMessage = "Rule name cannot exceed 100 characters")]
        public string RuleName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rule type is required")]
        public string RuleType { get; set; } = "EVENT";

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; } = "GENERAL";

        public bool IsManualTrigger { get; set; } = false;

        public string? SourceTable { get; set; }
        public string? TriggerField { get; set; }
        public string? TriggerValue { get; set; }

        public string? TimingType { get; set; }
        public int? DaysOffset { get; set; }
        public TimeSpan? FixedTime { get; set; }
        public string? CronExpression { get; set; }

        [Required(ErrorMessage = "Title template is required")]
        public string TitleTemplate { get; set; } = string.Empty;

        [Required(ErrorMessage = "Message template is required")]
        public string MessageTemplate { get; set; } = string.Empty;

        public string? DataTemplate { get; set; }

        [Required(ErrorMessage = "Target type is required")]
        public string TargetType { get; set; } = "ALL";

        // Changed to string to accept JSON string from frontend
        public string? TargetFilter { get; set; }

        public bool IsBatch { get; set; } = false;
        public int Priority { get; set; } = 2;
        public bool IsActive { get; set; } = true;

        public int CreatedBy { get; set; }
    }

    public class TestRuleVM
    {
        public int TestUserID { get; set; }
        public Dictionary<string, object>? TestData { get; set; }
    }

    public class UpdateRuleStatusVM
    {
        public bool IsActive { get; set; }
    }
}