


using school_management_Backend.Models;

namespace school_management_Backend.Services
{
    public interface INotificationRuleProcessor
    {
        Task<List<NotificationQueue>> ExecuteRuleAsync(NotificationRule rule);
        Task ScheduleRule(NotificationRule rule);
        Task<List<dynamic>> GetTargetUsersAsync(NotificationRule rule);
        Task<string> ResolveTemplate(string template, dynamic data);
        Task<DateTime?> CalculateNextRunTime(NotificationRule rule);
        Task<bool> ShouldRuleRunNowAsync(NotificationRule rule);
        Task ExecuteRuleDirectAsync(int ruleId);
        Task ExecuteRuleManuallyAsync(int ruleId);
        DateTime GetPakistanTime(); // For timezone support
    }
}