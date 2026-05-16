// Services/IBackgroundNotificationService.cs
using school_management_Backend.Models;

namespace school_management_Backend.Services
{
    public interface IBackgroundNotificationService
    {
        Task ProcessScheduledNotificationsAsync();
        
        Task CheckSpecificEventRuleAsync(NotificationRule rule);
        Task CheckEventRulesAsync();
        Task ProcessExpiredNotificationsAsync();
        Task CleanupOldDataAsync();
         Task RetryFailedNotificationsAsync();
    }
}



    
