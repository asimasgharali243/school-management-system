using Newtonsoft.Json.Linq;

namespace school_management_Backend.DTOs
{
    public class PushNotificationDTO
    {
        public string ExpoToken { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public JObject Data { get; set; }
        public string Sound { get; set; } = "default";
        public string Priority { get; set; } = "high";
        public string ChannelId { get; set; } = "default";
    }
    
    public class SendPushNotificationDTO
    {
        public int? UserID { get; set; } // ✅ ADD THIS PROPERTY
        public string ExpoToken { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public string Sound { get; set; } = "default";
        public string Priority { get; set; } = "high";
    }
    
    public class RegisterDeviceDTO
    {
        public int UserID { get; set; }
        public string UserType { get; set; }
        public string ExpoToken { get; set; }
        public string FCMToken { get; set; }
        public string Platform { get; set; }
        public string DeviceModel { get; set; }
        public string AppVersion { get; set; }
        public string OSVersion { get; set; }
    }
    
    public class PushNotificationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string ReceiptId { get; set; }
        public int NotificationId { get; set; }
        public string MessageId { get; set; } // Added for Firebase
        public bool ShouldDeactivateDevice { get; set; } // Added for device deactivation
    }
}