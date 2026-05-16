// Services/INotificationService.cs
using school_management_Backend.Models;

namespace school_management_Backend.Services
{
    public interface INotificationService
    {
        Task<List<NotificationQueue>> GetPendingNotificationsAsync(int batchSize = 100);
        Task ProcessNotificationAsync(NotificationQueue notification);
        Task<int> ProcessNotificationBatchAsync(List<NotificationQueue> notifications);
        Task<NotificationQueue> CreateNotificationAsync(int ruleId, int userId, Dictionary<string, object> data);
        Task LogNotificationActionAsync(long queueId, int userId, string action, string details = null);
        Task ArchiveOldNotificationsAsync(int daysToKeep = 90);
        Task<List<NotificationQueue>> GetUserNotificationsAsync(int userId, int page = 1, int pageSize = 20);
        Task<int> GetUnreadCountAsync(int userId);
        Task MarkAsReadAsync(long notificationId, int userId);
    }
}