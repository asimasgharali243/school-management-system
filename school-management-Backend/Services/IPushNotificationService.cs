// Services/IPushNotificationService.cs
using school_management_Backend.DTOs;

namespace school_management_Backend.Services
{
    public interface IPushNotificationService
    {
        Task<PushNotificationResult> SendPushNotificationAsync(SendPushNotificationDTO model);
        Task<PushNotificationResult> SendPushNotificationBatchAsync(List<SendPushNotificationDTO> models);
        Task<PushNotificationResult> SendToUserAsync(int userId, string title, string message, object data = null);
    }
}