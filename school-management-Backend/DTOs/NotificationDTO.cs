// DTOs/NotificationDTO.cs
using Newtonsoft.Json.Linq;

namespace school_management_Backend.DTOs
{
    public class NotificationDTO
    {
        public long QueueID { get; set; }
        public int? RuleID { get; set; }
        public int? UserID { get; set; }
        public string UserType { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public object DataPayload { get; set; }
        public string Status { get; set; }
        public byte Priority { get; set; }
        public DateTime? ScheduledTime { get; set; }
        public DateTime? ProcessedTime { get; set; }
        public DateTime CreatedTime { get; set; }
        public int AttemptCount { get; set; }
        public string ErrorMessage { get; set; }
        
        // Add these properties for debugging
        public bool HasDataPayload => DataPayload != null;
        public string DataPayloadType => DataPayload?.GetType().Name;
    }
}