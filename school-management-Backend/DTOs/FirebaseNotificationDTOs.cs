// DTOs/FirebaseNotificationDTOs.cs
using System.Collections.Generic;

namespace school_management_Backend.DTOs
{
    public class SendFirebaseNotificationDTO
    {
        public string FCMToken { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public string Priority { get; set; } = "high";
        public string Tag { get; set; }
        
        // For batch operations
        public List<string> RegistrationTokens { get; set; } = new List<string>();
    }
    
    public class BatchNotificationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int SuccessCount { get; set; }
        public int FailureCount { get; set; }
        public List<BatchNotificationItem> Results { get; set; } = new List<BatchNotificationItem>();
    }
    
    public class BatchNotificationItem
    {
        public string Token { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
    }
}