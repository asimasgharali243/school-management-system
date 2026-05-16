using Hangfire;
using school_management_Backend.Models;
using school_management_Backend.Data; // Add this line
using Microsoft.EntityFrameworkCore;

namespace school_management_Backend.Hangfire
{
    public class RecurringJobService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<RecurringJobService> _logger;

        public RecurringJobService(ApplicationDbContext context, ILogger<RecurringJobService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void ScheduleAllActiveRules()
        {
            try
            {
                var cronRules = _context.NotificationRules
                    .Where(r => r.IsActive && r.RuleType == "CRON" && !string.IsNullOrEmpty(r.CronExpression))
                    .ToList();

                foreach (var rule in cronRules)
                {
                    RecurringJob.AddOrUpdate<NotificationJobs>(
                        $"notification-rule-{rule.RuleID}",
                        jobs => jobs.ExecuteRuleAsync(rule.RuleID),
                        rule.CronExpression,
                        TimeZoneInfo.Local);
                    
                    _logger.LogInformation("Scheduled cron job for rule {RuleID} with expression: {Expression}", 
                        rule.RuleID, rule.CronExpression);
                }

                // Schedule daily cleanup job
                RecurringJob.AddOrUpdate<NotificationJobs>(
                    "cleanup-old-data",
                    jobs => jobs.CleanupOldDataAsync(),
                    Cron.Daily(2, 0), // Run at 2:00 AM daily
                    TimeZoneInfo.Local);
                
                _logger.LogInformation("Scheduled daily cleanup job");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error scheduling recurring jobs");
            }
        }
    }
}