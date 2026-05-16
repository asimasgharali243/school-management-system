
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace school_management_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminNotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminNotificationController> _logger;

        public AdminNotificationController(ApplicationDbContext context, ILogger<AdminNotificationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/adminnotification/logs
        [HttpGet("logs")]
        public async Task<IActionResult> GetNotificationLogs(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string action = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.NotificationLogs.AsQueryable();

                if (fromDate.HasValue)
                    query = query.Where(l => l.Timestamp >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(l => l.Timestamp <= toDate.Value);

                if (!string.IsNullOrEmpty(action))
                    query = query.Where(l => l.Action == action);

                var totalCount = await query.CountAsync();
                var logs = await query
                    .OrderByDescending(l => l.Timestamp)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(l => new
                    {
                        l.LogID,
                        l.QueueID,
                        l.UserID,
                        l.Action,
                        l.Timestamp,
                        l.Details
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Success = true,
                    Data = logs,
                    Pagination = new
                    {
                        Page = page,
                        PageSize = pageSize,
                        TotalCount = totalCount,
                        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification logs");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // GET: api/adminnotification/history
        [HttpGet("history")]
        public async Task<IActionResult> GetNotificationHistory(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int? userId = null,
            [FromQuery] string category = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.NotificationHistory.AsQueryable();

                if (fromDate.HasValue)
                    query = query.Where(h => h.SentTime >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(h => h.SentTime <= toDate.Value);

                if (userId.HasValue)
                    query = query.Where(h => h.UserID == userId.Value);

                if (!string.IsNullOrEmpty(category))
                    query = query.Where(h => h.Category == category);

                var totalCount = await query.CountAsync();
                var history = await query
                    .OrderByDescending(h => h.SentTime)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(h => new
                    {
                        h.HistoryID,
                        h.RuleID,
                        h.UserID,
                        h.Title,
                        h.Message,
                        h.Category,
                        h.SentTime,
                        h.ReadTime,
                        h.ArchivedDate
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Success = true,
                    Data = history,
                    Pagination = new
                    {
                        Page = page,
                        PageSize = pageSize,
                        TotalCount = totalCount,
                        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification history");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // GET: api/adminnotification/batch
        [HttpGet("batch")]
        public async Task<IActionResult> GetBatchNotifications(
            [FromQuery] string status = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var query = _context.BatchNotifications.AsQueryable();

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(b => b.Status == status);

                if (fromDate.HasValue)
                    query = query.Where(b => b.CreatedTime >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(b => b.CreatedTime <= toDate.Value);

                var batches = await query
                    .OrderByDescending(b => b.CreatedTime)
                    .Select(b => new
                    {
                        b.BatchID,
                        b.RuleID,
                        b.Title,
                        b.Message,
                        b.TargetType,
                        b.TotalRecipients,
                        b.SentCount,
                        b.FailedCount,
                        b.Status,
                        b.CreatedTime,
                        b.CompletedTime,
                        SuccessRate = b.TotalRecipients > 0 ? 
                            (b.SentCount / (double)b.TotalRecipients) * 100 : 0
                    })
                    .ToListAsync();

                return Ok(new { Success = true, Data = batches });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting batch notifications");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // GET: api/adminnotification/system-stats
     // GET: api/adminnotification/system-stats
// GET: api/adminnotification/system-stats
[HttpGet("system-stats")]
public async Task<IActionResult> GetSystemStats([FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
{
    try
    {
        fromDate ??= DateTime.Now.AddDays(-30);
        toDate ??= DateTime.Now;

        // Rule statistics
        var ruleStats = await _context.NotificationRules
            .Select(r => new
            {
                r.RuleID,
                r.RuleName,
                r.RuleType,
                r.Category,
                r.IsActive,
                r.TotalRuns,
                r.LastRunTime,
                r.NextRunTime
            })
            .ToListAsync();

        // Notification statistics
        var notificationStats = await _context.NotificationQueue
            .Where(n => n.CreatedTime >= fromDate && n.CreatedTime <= toDate)
            .GroupBy(n => n.Status)
            .Select(g => new
            {
                Status = g.Key,
                Count = g.Count(),
                AverageAttempts = g.Average(n => n.AttemptCount)
            })
            .ToListAsync();

        var totalNotifications = notificationStats.Sum(s => s.Count);
        var sentNotifications = notificationStats.FirstOrDefault(s => s.Status == "SENT")?.Count ?? 0;

        // Calculate average attempts - SIMPLE AND WORKING
        double averageAttemptsValue = 0;
        if (totalNotifications > 0)
        {
            averageAttemptsValue = await _context.NotificationQueue
                .Where(n => n.CreatedTime >= fromDate && n.CreatedTime <= toDate)
                .AverageAsync(n => (double)n.AttemptCount);
        }

        // Device statistics
        var deviceStats = await _context.UserDevices
            .GroupBy(d => d.Platform)
            .Select(g => new
            {
                Platform = g.Key,
                Total = g.Count(),
                Active = g.Count(d => d.IsActive)
            })
            .ToListAsync();

        // History statistics
        var historyStats = await _context.NotificationHistory
            .Where(h => h.ArchivedDate >= fromDate && h.ArchivedDate <= toDate)
            .GroupBy(h => h.Category)
            .Select(g => new
            {
                Category = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        // Log statistics
        var logStats = await _context.NotificationLogs
            .Where(l => l.Timestamp >= fromDate && l.Timestamp <= toDate)
            .GroupBy(l => l.Action)
            .Select(g => new
            {
                Action = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        return Ok(new
        {
            Success = true,
            Data = new
            {
                Period = new { From = fromDate, To = toDate },
                Rules = new
                {
                    Total = ruleStats.Count,
                    Active = ruleStats.Count(r => r.IsActive),
                    ByType = ruleStats.GroupBy(r => r.RuleType)
                        .Select(g => new { Type = g.Key, Count = g.Count() }),
                    ByCategory = ruleStats.GroupBy(r => r.Category)
                        .Select(g => new { Category = g.Key, Count = g.Count() })
                },
                Notifications = new
                {
                    Total = totalNotifications,
                    ByStatus = notificationStats,
                    SuccessRate = totalNotifications > 0 ? (sentNotifications / (double)totalNotifications) * 100 : 0,
                    AverageAttempts = Math.Round(averageAttemptsValue, 2)
                },
                Devices = new
                {
                    Total = deviceStats.Sum(d => d.Total),
                    Active = deviceStats.Sum(d => d.Active),
                    ByPlatform = deviceStats
                },
                History = new
                {
                    Total = historyStats.Sum(h => h.Count),
                    ByCategory = historyStats
                },
                Logs = new
                {
                    Total = logStats.Sum(l => l.Count),
                    ByAction = logStats
                }
            }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting system stats");
        return StatusCode(500, new { Success = false, Message = "Internal server error" });
    }
}

        // POST: api/adminnotification/broadcast
        [HttpPost("broadcast")]
        public async Task<IActionResult> SendBroadcastNotification([FromBody] BroadcastNotificationVM model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { Success = false, Errors = ModelState.Values.SelectMany(v => v.Errors) });

                if (string.IsNullOrEmpty(model.Title))
                    return BadRequest(new { Success = false, Message = "Title is required" });

                if (string.IsNullOrEmpty(model.Message))
                    return BadRequest(new { Success = false, Message = "Message is required" });

                // Get target users based on broadcast type
                var users = await GetBroadcastTargetUsersAsync(model);

                if (users.Count == 0)
                    return BadRequest(new { Success = false, Message = "No users found for the specified criteria" });

                // Create a batch notification record
                var batch = new BatchNotification
                {
                    RuleID = 0, // Manual broadcast
                    Title = model.Title,
                    Message = model.Message,
                    DataPayload = model.Data?.ToString(),
                    TargetType = model.TargetType,
                    TargetFilter = model.TargetFilter?.ToString(),
                    TotalRecipients = users.Count,
                    SentCount = 0,
                    FailedCount = 0,
                    Status = "PROCESSING",
                    CreatedTime = DateTime.Now
                };

                _context.BatchNotifications.Add(batch);
                await _context.SaveChangesAsync();

                // Create notifications for each user
                var notifications = new List<NotificationQueue>();
                foreach (var user in users)
                {
                    var notification = new NotificationQueue
                    {
                        RuleID = 0,
                        UserID = user.UserID,
                        UserType = user.UserType,
                        DeviceToken = user.ExpoToken,
                        Title = model.Title,
                        Message = model.Message,
                        DataPayload = model.Data?.ToString(),
                        Status = "PENDING",
                        Priority = model.Priority,
                        ScheduledTime = DateTime.Now,
                        CreatedTime = DateTime.Now,
                        AttemptCount = 0
                    };

                    notifications.Add(notification);
                }

                _context.NotificationQueue.AddRange(notifications);
                await _context.SaveChangesAsync();

                // Update batch status
                batch.Status = "PENDING";
                await _context.SaveChangesAsync();

                _logger.LogInformation("Created broadcast notification for {Count} users (Batch ID: {BatchId})", users.Count, batch.BatchID);

                return Ok(new
                {
                    Success = true,
                    Message = $"Broadcast notification created for {users.Count} users",
                    BatchId = batch.BatchID,
                    NotificationsCreated = notifications.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending broadcast notification");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // POST: api/adminnotification/test-webhook
        [HttpPost("test-webhook")]
        public async Task<IActionResult> TestWebhook([FromBody] WebhookTestVM model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.WebhookUrl))
                    return BadRequest(new { Success = false, Message = "Webhook URL is required" });

                // Log the webhook test
                var log = new NotificationLog
                {
                    QueueID = 0,
                    UserID = 0,
                    Action = "WEBHOOK_TEST",
                    Timestamp = DateTime.Now,
                    Details = $"Webhook test to {model.WebhookUrl}"
                };

                _context.NotificationLogs.Add(log);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Tested webhook: {Url}", model.WebhookUrl);
                
                return Ok(new { 
                    Success = true, 
                    Message = "Webhook test logged successfully",
                    TestData = new
                    {
                        Url = model.WebhookUrl,
                        Timestamp = DateTime.Now,
                        LogId = log.LogID
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing webhook");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        private async Task<List<BroadcastUser>> GetBroadcastTargetUsersAsync(BroadcastNotificationVM model)
        {
            var users = new List<BroadcastUser>();

            switch (model.TargetType?.ToUpper())
            {
                case "ALL":
                    var allUsers = await _context.UserDevices
                        .Where(d => d.IsActive && !string.IsNullOrEmpty(d.ExpoToken))
                        .Select(d => new BroadcastUser
                        {
                            UserID = d.UserID,
                            UserType = d.UserType,
                            ExpoToken = d.ExpoToken
                        })
                        .ToListAsync();
                    users.AddRange(allUsers);
                    break;

                case "PARENTS":
                    var parents = await _context.UserDevices
                        .Where(d => d.IsActive && !string.IsNullOrEmpty(d.ExpoToken) && d.UserType == "PARENT")
                        .Select(d => new BroadcastUser
                        {
                            UserID = d.UserID,
                            UserType = d.UserType,
                            ExpoToken = d.ExpoToken
                        })
                        .ToListAsync();
                    users.AddRange(parents);
                    break;

                case "TEACHERS":
                    var teachers = await _context.UserDevices
                        .Where(d => d.IsActive && !string.IsNullOrEmpty(d.ExpoToken) && d.UserType == "TEACHER")
                        .Select(d => new BroadcastUser
                        {
                            UserID = d.UserID,
                            UserType = d.UserType,
                            ExpoToken = d.ExpoToken
                        })
                        .ToListAsync();
                    users.AddRange(teachers);
                    break;

                case "ADMIN":
                    var admins = await _context.UserDevices
                        .Where(d => d.IsActive && !string.IsNullOrEmpty(d.ExpoToken) && d.UserType == "ADMIN")
                        .Select(d => new BroadcastUser
                        {
                            UserID = d.UserID,
                            UserType = d.UserType,
                            ExpoToken = d.ExpoToken
                        })
                        .ToListAsync();
                    users.AddRange(admins);
                    break;

                case "CLASS":
                    if (model.TargetFilter != null && model.TargetFilter.ContainsKey("ClassId"))
                    {
                        var classId = model.TargetFilter["ClassId"].Value<int>();
                        // This query depends on your actual database structure
                        // Adjust based on your actual student-parent relationships
                        var classUsers = await _context.UserDevices
                            .Where(d => d.IsActive && !string.IsNullOrEmpty(d.ExpoToken))
                            .Take(10) // Limit for demo - adjust based on your actual query
                            .Select(d => new BroadcastUser
                            {
                                UserID = d.UserID,
                                UserType = d.UserType,
                                ExpoToken = d.ExpoToken
                            })
                            .ToListAsync();
                        users.AddRange(classUsers);
                    }
                    break;

                default:
                    // Default to all active users with tokens
                    var defaultUsers = await _context.UserDevices
                        .Where(d => d.IsActive && !string.IsNullOrEmpty(d.ExpoToken))
                        .Select(d => new BroadcastUser
                        {
                            UserID = d.UserID,
                            UserType = d.UserType,
                            ExpoToken = d.ExpoToken
                        })
                        .ToListAsync();
                    users.AddRange(defaultUsers);
                    break;
            }

            return users.DistinctBy(u => u.UserID).ToList();
        }

        public class BroadcastNotificationVM
        {
            public string Title { get; set; }
            public string Message { get; set; }
            public JObject Data { get; set; }
            public string TargetType { get; set; } // ALL, PARENTS, TEACHERS, ADMIN, CLASS
            public JObject TargetFilter { get; set; }
            public byte Priority { get; set; } = 2;
        }

        public class WebhookTestVM
        {
            public string WebhookUrl { get; set; }
            public JObject TestPayload { get; set; }
        }

        public class BroadcastUser
        {
            public int UserID { get; set; }
            public string UserType { get; set; }
            public string ExpoToken { get; set; }
        }
    }
}