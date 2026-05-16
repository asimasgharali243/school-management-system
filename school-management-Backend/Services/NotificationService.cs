

// Services/NotificationService.cs
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using school_management_Backend.DTOs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.Json;

namespace school_management_Backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPushNotificationService _pushService;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            ApplicationDbContext context, 
            IPushNotificationService pushService, 
            ILogger<NotificationService> logger)
        {
            _context = context;
            _pushService = pushService;
            _logger = logger;
        }

        public async Task<List<NotificationQueue>> GetPendingNotificationsAsync(int batchSize = 100)
        {
            try
            {
                var notifications = await _context.NotificationQueue
                    .Where(n => n.Status == "PENDING" && n.ScheduledTime <= DateTime.Now)
                    .OrderBy(n => n.Priority)
                    .ThenBy(n => n.ScheduledTime)
                    .Take(batchSize)
                    .ToListAsync();
                
                _logger.LogInformation("Found {Count} pending notifications", notifications.Count);
                return notifications;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending notifications");
                return new List<NotificationQueue>();
            }
        }

        // public async Task ProcessNotificationAsync(NotificationQueue notification)
        // {
        //     try
        //     {
        //         _logger.LogInformation("Processing notification {QueueID} for user {UserID}", notification.QueueID, notification.UserID);

        //         notification.Status = "PROCESSING";
        //         notification.LastAttemptTime = DateTime.Now;
        //         notification.AttemptCount++;
                
        //         await _context.SaveChangesAsync();
                
        //         // Get device token - check if already stored or get from UserDevices
        //         string fcmToken = notification.DeviceToken;
                
        //         if (string.IsNullOrEmpty(fcmToken))
        //         {
        //             var device = await _context.UserDevices
        //                 .FirstOrDefaultAsync(d => d.UserID == notification.UserID && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                        
        //             if (device == null || string.IsNullOrEmpty(device.FCMToken))
        //             {
        //                 notification.Status = "FAILED";
        //                 notification.ErrorMessage = "No active FCM token found";
        //                 await _context.SaveChangesAsync();
                        
        //                 await LogNotificationActionAsync(notification.QueueID, notification.UserID, "FAILED", "No active FCM token found");
        //                 _logger.LogWarning("No FCM token for user {UserID}", notification.UserID);
        //                 return;
        //             }
                    
        //             fcmToken = device.FCMToken;
        //             // Update notification with the device token for future reference
        //             notification.DeviceToken = fcmToken;
        //             await _context.SaveChangesAsync();
        //         }
                
        //         // Prepare data for Firebase notification
        //         JObject dataObject = null;
        //         if (!string.IsNullOrEmpty(notification.DataPayload))
        //         {
        //             try
        //             {
        //                 dataObject = JObject.Parse(notification.DataPayload);
        //             }
        //             catch (Exception ex)
        //             {
        //                 _logger.LogWarning(ex, "Failed to parse data payload for notification {QueueID}", 
        //                     notification.QueueID);
        //                 dataObject = new JObject();
        //             }
        //         }
        //         else
        //         {
        //             dataObject = new JObject();
        //         }
                
        //         // Add notification ID to data
        //         dataObject["notificationId"] = notification.QueueID.ToString();
        //         dataObject["type"] = "notification";
        //         dataObject["timestamp"] = DateTime.Now.ToString("o");
                
        //         // FIXED: Use _pushService instead of _firebaseService
        //         var pushResult = await _pushService.SendToUserAsync(
        //             notification.UserID, 
        //             notification.Title, 
        //             notification.Message, 
        //             dataObject);
                
        //         if (pushResult.Success)
        //         {
        //             notification.Status = "SENT";
        //             notification.ProcessedTime = DateTime.Now;
                    
        //             // Log the success
        //             await LogNotificationActionAsync(notification.QueueID, notification.UserID, "SENT", 
        //                 pushResult.Message);
                    
        //             _logger.LogInformation("Notification {QueueID} sent successfully via Firebase", notification.QueueID);
        //         }
        //         else
        //         {
        //             notification.Status = "FAILED";
        //             notification.ErrorMessage = pushResult.Message;
                    
        //             // If token is invalid, mark device as inactive
        //             if (pushResult.ShouldDeactivateDevice)
        //             {
        //                 var device = await _context.UserDevices
        //                     .FirstOrDefaultAsync(d => d.UserID == notification.UserID && d.FCMToken == fcmToken);
        //                 if (device != null)
        //                 {
        //                     device.IsActive = false;
        //                     _logger.LogWarning("Deactivated device for user {UserID} due to invalid token", notification.UserID);
        //                 }
        //             }
                    
        //             // Move failed notifications to history after 3 attempts
        //             if (notification.AttemptCount >= 3)
        //             {
        //                 await ArchiveFailedNotificationAsync(notification);
        //                 _logger.LogInformation("Moved notification {QueueID} to history after {Attempts} failed attempts", 
        //                     notification.QueueID, notification.AttemptCount);
        //             }
                    
        //             await _context.SaveChangesAsync();
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error processing notification {QueueID}", notification.QueueID);
                
        //         notification.Status = "FAILED";
        //         notification.ErrorMessage = ex.Message;
        //         await _context.SaveChangesAsync();
        //     }
        // }
// Services/NotificationService.cs - Fix ProcessNotificationAsync
public async Task ProcessNotificationAsync(NotificationQueue notification)
{
    try
    {
        _logger.LogInformation("Processing notification {QueueID} for user {UserID}", notification.QueueID, notification.UserID);

        notification.Status = "PROCESSING";
        notification.LastAttemptTime = DateTime.Now;
        notification.AttemptCount++;
        
        await _context.SaveChangesAsync();
        
        string fcmToken = notification.DeviceToken;
        
        if (string.IsNullOrEmpty(fcmToken))
        {
            var device = await _context.UserDevices
                .FirstOrDefaultAsync(d => d.UserID == notification.UserID && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                
            if (device == null || string.IsNullOrEmpty(device.FCMToken))
            {
                notification.Status = "FAILED";
                notification.ErrorMessage = "No active FCM token found";
                await _context.SaveChangesAsync();
                
                await LogNotificationActionAsync(notification.QueueID, notification.UserID, "FAILED", "No active FCM token found");
                _logger.LogWarning("No FCM token for user {UserID}", notification.UserID);
                return;
            }
            
            fcmToken = device.FCMToken;
            notification.DeviceToken = fcmToken;
            await _context.SaveChangesAsync();
        }
        
        // FIX: Create a proper Dictionary instead of JObject
        var dataDict = new Dictionary<string, object>();
        
        if (!string.IsNullOrEmpty(notification.DataPayload))
        {
            try
            {
                var existingData = JsonConvert.DeserializeObject<Dictionary<string, object>>(notification.DataPayload);
                if (existingData != null)
                {
                    foreach (var kvp in existingData)
                    {
                        dataDict[kvp.Key] = kvp.Value;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to parse data payload for notification {QueueID}", notification.QueueID);
            }
        }
        
        // Add notification ID to data - AS STRING, NOT ARRAY
        dataDict["notificationId"] = notification.QueueID.ToString();
        dataDict["queueID"] = notification.QueueID.ToString();
        dataDict["type"] = "notification";
        dataDict["timestamp"] = DateTime.Now.ToString("o");
        
        // Create a custom DTO that includes the notification ID
        var sendDto = new SendPushNotificationDTO
        {
            UserID = notification.UserID,
            Title = notification.Title,
            Message = notification.Message,
            Data = dataDict,  // Use the dictionary instead of JObject
            Sound = "default",
            Priority = "high"
        };
        
        var pushResult = await _pushService.SendPushNotificationAsync(sendDto);
        
        if (pushResult.Success)
        {
            notification.Status = "SENT";
            notification.ProcessedTime = DateTime.Now;
            
            await LogNotificationActionAsync(notification.QueueID, notification.UserID, "SENT", pushResult.Message);
            _logger.LogInformation("Notification {QueueID} sent successfully", notification.QueueID);
        }
        else
        {
            notification.Status = "FAILED";
            notification.ErrorMessage = pushResult.Message;
            
            if (pushResult.ShouldDeactivateDevice)
            {
                var device = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == notification.UserID && d.FCMToken == fcmToken);
                if (device != null)
                {
                    device.IsActive = false;
                    _logger.LogWarning("Deactivated device for user {UserID} due to invalid token", notification.UserID);
                }
            }
            
            if (notification.AttemptCount >= 3)
            {
                await ArchiveFailedNotificationAsync(notification);
                _logger.LogInformation("Moved notification {QueueID} to history after {Attempts} failed attempts", 
                    notification.QueueID, notification.AttemptCount);
            }
            
            await _context.SaveChangesAsync();
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error processing notification {QueueID}", notification.QueueID);
        
        notification.Status = "FAILED";
        notification.ErrorMessage = ex.Message;
        await _context.SaveChangesAsync();
    }
}

        public async Task<int> ProcessNotificationBatchAsync(List<NotificationQueue> notifications)
        {
            int successCount = 0;
            
            foreach (var notification in notifications)
            {
                await ProcessNotificationAsync(notification);
                
                if (notification.Status == "SENT")
                    successCount++;
            }
            
            _logger.LogInformation("Processed batch: {SuccessCount}/{TotalCount} successful", successCount, notifications.Count);
            return successCount;
        }

        public async Task<NotificationQueue> CreateNotificationAsync(int ruleId, int userId, Dictionary<string, object> data)
        {
            var rule = await _context.NotificationRules.FindAsync(ruleId);
            if (rule == null)
                throw new ArgumentException($"Rule with ID {ruleId} not found");

            // Resolve template with data
            var title = ResolveTemplate(rule.TitleTemplate, data);
            var message = ResolveTemplate(rule.MessageTemplate, data);
            var dataPayload = rule.DataTemplate != null ? 
                ResolveTemplate(rule.DataTemplate, data) : JsonConvert.SerializeObject(data);

            var notification = new NotificationQueue
            {
                RuleID = ruleId,
                UserID = userId,
                Title = title,
                Message = message,
                DataPayload = dataPayload,
                Status = "PENDING",
                Priority = rule.Priority,
                ScheduledTime = CalculateScheduledTime(rule),
                CreatedTime = DateTime.Now,
                ExpiryTime = DateTime.Now.AddDays(7),
                DeviceToken = null // Will be populated when sending
            };

            _context.NotificationQueue.Add(notification);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created notification for user {UserID} via rule {RuleID}", userId, ruleId);

            return notification;
        }

        public async Task LogNotificationActionAsync(long queueId, int userId, string action, string details = null)
        {
            var log = new NotificationLog
            {
                QueueID = queueId,
                UserID = userId,
                Action = action,
                Details = details,
                Timestamp = DateTime.Now
            };

            _context.NotificationLogs.Add(log);
            await _context.SaveChangesAsync();
            
            _logger.LogDebug("Logged notification action: {Action} for queue {QueueID}", action, queueId);
        }

        public async Task ArchiveOldNotificationsAsync(int daysToKeep = 90)
        {
            var cutoffDate = DateTime.Now.AddDays(-daysToKeep);
            
            var oldNotifications = await _context.NotificationQueue
                .Where(n => n.Status == "SENT" && n.ProcessedTime < cutoffDate)
                .ToListAsync();

            _logger.LogInformation("Archiving {Count} old notifications", oldNotifications.Count);

            foreach (var notification in oldNotifications)
            {
                await MoveToHistoryAsync(notification);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<NotificationQueue>> GetUserNotificationsAsync(int userId, int page = 1, int pageSize = 20)
        {
            return await _context.NotificationQueue
                .Where(n => n.UserID == userId && (n.Status == "SENT" || n.Status == "PENDING"))
                .OrderByDescending(n => n.ScheduledTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            // Count sent notifications that haven't been marked as read
            var sentNotifications = await _context.NotificationQueue
                .Where(n => n.UserID == userId && n.Status == "SENT")
                .CountAsync();
                
            // Subtract read notifications (you might want to track read status separately)
            var readNotifications = await _context.NotificationLogs
                .Where(l => l.UserID == userId && l.Action == "READ")
                .CountAsync();
                
            return Math.Max(0, sentNotifications - readNotifications);
        }

        public async Task MarkAsReadAsync(long notificationId, int userId)
        {
            var notification = await _context.NotificationQueue
                .FirstOrDefaultAsync(n => n.QueueID == notificationId && n.UserID == userId);

            if (notification != null)
            {
                await LogNotificationActionAsync(notificationId, userId, "READ");
            }
        }

        private string ResolveTemplate(string template, Dictionary<string, object> data)
        {
            if (string.IsNullOrEmpty(template))
                return string.Empty;

            var result = template;

            foreach (var item in data)
            {
                var placeholder = "{" + item.Key + "}";
                var value = item.Value?.ToString() ?? string.Empty;
                result = result.Replace(placeholder, value);
            }

            return result;
        }

        private DateTime CalculateScheduledTime(NotificationRule rule)
        {
            var now = DateTime.Now;

            switch (rule.TimingType)
            {
                case "FIXED_TIME":
                    if (rule.FixedTime.HasValue)
                    {
                        var scheduled = DateTime.Today.Add(rule.FixedTime.Value);
                        if (scheduled <= now)
                            scheduled = scheduled.AddDays(1);
                        return scheduled;
                    }
                    break;

                case "DAYS_OFFSET":
                    if (rule.DaysOffset.HasValue)
                        return now.AddDays(rule.DaysOffset.Value);
                    break;

                case "IMMEDIATE":
                    return now;
            }

            return now;
        }

        private async Task MoveToHistoryAsync(NotificationQueue notification)
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

            _context.NotificationHistory.Add(history);
            _context.NotificationQueue.Remove(notification);
            
            _logger.LogDebug("Moved notification {QueueID} to history", notification.QueueID);
        }

        private async Task ArchiveSentNotificationAsync(NotificationQueue notification)
        {
            await MoveToHistoryAsync(notification);
        }

        private async Task ArchiveFailedNotificationAsync(NotificationQueue notification)
        {
            // For failed notifications, we might want to keep them in history for analysis
            var rule = await _context.NotificationRules
                .FirstOrDefaultAsync(r => r.RuleID == notification.RuleID);
                
            var history = new NotificationHistory
            {
                RuleID = notification.RuleID,
                UserID = notification.UserID,
                Title = notification.Title,
                Message = notification.Message,
                Category = rule?.Category ?? "GENERAL",
                SentTime = notification.CreatedTime,
                ArchivedDate = DateTime.Now,
                // You might want to add error information here
                // ErrorDetails = notification.ErrorMessage
            };

            _context.NotificationHistory.Add(history);
            _context.NotificationQueue.Remove(notification);
            
            _logger.LogDebug("Archived failed notification {QueueID}", notification.QueueID);
        }
    }
}