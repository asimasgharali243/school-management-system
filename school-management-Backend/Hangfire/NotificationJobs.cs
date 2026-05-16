using school_management_Backend.Services;
using school_management_Backend.Data; // Add this line
using school_management_Backend.Models; // Add this line
using Microsoft.EntityFrameworkCore; // Add this line

namespace school_management_Backend.Hangfire
{
    public class NotificationJobs
    {
        private readonly INotificationRuleProcessor _ruleProcessor;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NotificationJobs> _logger;

        public NotificationJobs(
            INotificationRuleProcessor ruleProcessor,
            ApplicationDbContext context,
            ILogger<NotificationJobs> logger)
        {
            _ruleProcessor = ruleProcessor;
            _context = context;
            _logger = logger;
        }

        public async Task ExecuteRuleAsync(int ruleId)
        {
            try
            {
                var rule = await _context.NotificationRules.FindAsync(ruleId);
                if (rule == null || !rule.IsActive)
                {
                    _logger.LogWarning("Rule {RuleID} not found or inactive", ruleId);
                    return;
                }

                _logger.LogInformation("Executing rule {RuleID} via Hangfire", ruleId);
                await _ruleProcessor.ExecuteRuleAsync(rule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing rule {RuleID} via Hangfire", ruleId);
            }
        }

        public async Task CleanupOldDataAsync()
        {
            try
            {
                _logger.LogInformation("Cleaning up old notification data via Hangfire");
                
                // Archive old notifications (older than 90 days)
                var cutoffDate = DateTime.Now.AddDays(-90);
                var oldNotifications = await _context.NotificationQueue
                    .Where(n => n.Status == "SENT" && n.ProcessedTime < cutoffDate)
                    .ToListAsync();

                foreach (var notification in oldNotifications)
                {
                    var rule = await _context.NotificationRules
                        .FirstOrDefaultAsync(r => r.RuleID == notification.RuleID);
                        
                    var history = new NotificationHistory
                    {
                        RuleID = notification.RuleID,
                        UserID = notification.UserID,
                        Title = notification.Title,
                        Message = notification.Message,
                        Category = rule?.Category ?? "GENERAL",
                        SentTime = notification.ProcessedTime ?? notification.CreatedTime,
                        ArchivedDate = DateTime.Now
                    };

                    await _context.NotificationHistory.AddAsync(history);
                    _context.NotificationQueue.Remove(notification);
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation("Archived {Count} old notifications", oldNotifications.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up old data via Hangfire");
            }
        }
    }
}