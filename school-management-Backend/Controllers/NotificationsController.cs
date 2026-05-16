// Controllers/NotificationsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using school_management_Backend.DTOs;
using school_management_Backend.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;

namespace school_management_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(
            INotificationService notificationService,
            ApplicationDbContext context,
            ILogger<NotificationsController> logger)
        {
            _notificationService = notificationService;
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllNotifications(
            [FromQuery] string status = null,
            [FromQuery] int? userId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                _logger.LogInformation("⚡⚡⚡⚡⚡⚡========== GET ALL NOTIFICATIONS REQUEST ==========");
                
                var query = _context.NotificationQueue.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(n => n.Status == status);
                
                if (userId.HasValue)
                    query = query.Where(n => n.UserID == userId.Value);
                
                if (fromDate.HasValue)
                    query = query.Where(n => n.CreatedTime >= fromDate.Value);
                
                if (toDate.HasValue)
                    query = query.Where(n => n.CreatedTime <= toDate.Value);

                var totalCount = await query.CountAsync();
                
                var notifications = await query
                    .OrderByDescending(n => n.CreatedTime)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var notificationDtos = new List<NotificationDTO>();
                
                foreach (var n in notifications)
                {
                    try
                    {
                        var dto = new NotificationDTO
                        {
                            QueueID = n.QueueID,
                            RuleID = n.RuleID,
                            UserID = n.UserID,
                            UserType = n.UserType ?? "",
                            Title = n.Title ?? "",
                            Message = n.Message ?? "",
                            DataPayload = TryParseJson(n.DataPayload),
                            Status = n.Status ?? "",
                            Priority = n.Priority,
                            ScheduledTime = n.ScheduledTime,
                            ProcessedTime = n.ProcessedTime,
                            CreatedTime = n.CreatedTime,
                            AttemptCount = n.AttemptCount,
                            ErrorMessage = n.ErrorMessage
                        };
                        
                        notificationDtos.Add(dto);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error creating DTO for notification {QueueID}", n.QueueID);
                        
                        notificationDtos.Add(new NotificationDTO
                        {
                            QueueID = n.QueueID,
                            Title = n.Title ?? "",
                            Message = n.Message ?? "",
                            Status = n.Status ?? "",
                            CreatedTime = n.CreatedTime,
                            DataPayload = new Dictionary<string, object>
                            {
                                ["error"] = "Failed to parse",
                                ["raw"] = n.DataPayload?.Substring(0, Math.Min(100, n.DataPayload?.Length ?? 0)) ?? ""
                            }
                        });
                    }
                }

                var maxPage = (int)Math.Ceiling(totalCount / (double)pageSize);
                
                var result = new
                {
                    Success = true,
                    Data = notificationDtos,
                    Total = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = maxPage,
                    Debug = new
                    {
                        TotalInDatabase = await _context.NotificationQueue.CountAsync(),
                        ReturnedCount = notificationDtos.Count,
                        WithDataPayload = notificationDtos.Count(d => d.HasDataPayload),
                        WithoutDataPayload = notificationDtos.Count(d => !d.HasDataPayload)
                    }
                };

                _logger.LogInformation("Returning {Count} notifications. With DataPayload: {WithData}", 
                    notificationDtos.Count, 
                    notificationDtos.Count(d => d.HasDataPayload));
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all notifications");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpGet("debug/payload/{id}")]
        public async Task<IActionResult> DebugPayload(int id)
        {
            var notification = await _context.NotificationQueue
                .FirstOrDefaultAsync(n => n.QueueID == id);
            
            if (notification == null)
                return NotFound();
            
            var result = new
            {
                notification.QueueID,
                notification.Title,
                RawData = notification.DataPayload,
                RawDataLength = notification.DataPayload?.Length ?? 0,
                Parsed = TryParseJson(notification.DataPayload),
                ParsedType = TryParseJson(notification.DataPayload)?.GetType().Name
            };
            
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(int userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.NotificationQueue
                    .Where(n => n.UserID == userId)
                    .OrderByDescending(n => n.CreatedTime);

                var totalCount = await query.CountAsync();
                var notifications = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
                
                var notificationDtos = new List<NotificationDTO>();
                
                foreach (var n in notifications)
                {
                    object parsedPayload = null;
                    
                    if (!string.IsNullOrEmpty(n.DataPayload))
                    {
                        try
                        {
                            // Parse with JObject first
                            var jObject = JObject.Parse(n.DataPayload);
                            
                            // Convert JObject to a regular Dictionary that System.Text.Json can handle
                            var dict = new Dictionary<string, object>();
                            foreach (var property in jObject.Properties())
                            {
                                var value = property.Value;
                                
                                // Handle different value types
                                if (value.Type == JTokenType.Object)
                                {
                                    dict[property.Name] = ConvertJObjectToDictionary((JObject)value);
                                }
                                else if (value.Type == JTokenType.Array)
                                {
                                    dict[property.Name] = ConvertJArrayToList((JArray)value);
                                }
                                else
                                {
                                    dict[property.Name] = ((JValue)value).Value;
                                }
                            }
                            
                            parsedPayload = dict;
                            _logger.LogInformation("Successfully parsed payload for notification {Id}", n.QueueID);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Failed to parse payload for notification {Id}", n.QueueID);
                            parsedPayload = new Dictionary<string, object>
                            {
                                ["raw"] = n.DataPayload,
                                ["error"] = ex.Message
                            };
                        }
                    }
                    
                    notificationDtos.Add(new NotificationDTO
                    {
                        QueueID = n.QueueID,
                        RuleID = n.RuleID,
                        UserID = n.UserID,
                        UserType = n.UserType ?? "",
                        Title = n.Title ?? "",
                        Message = n.Message ?? "",
                        DataPayload = parsedPayload,
                        Status = n.Status ?? "",
                        Priority = n.Priority,
                        ScheduledTime = n.ScheduledTime,
                        ProcessedTime = n.ProcessedTime,
                        CreatedTime = n.CreatedTime,
                        AttemptCount = n.AttemptCount,
                        ErrorMessage = n.ErrorMessage
                    });
                }
                
                return Ok(new
                {
                    Success = true,
                    Data = notificationDtos,
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
                _logger.LogError(ex, "Error getting notifications for user {UserId}", userId);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }




        // Add this method to NotificationsController.cs
// GET: api/notifications/{id}
[HttpGet("{id}")]
public async Task<IActionResult> GetNotificationById(long id)
{
    try
    {
        _logger.LogInformation("Getting notification by ID: {Id}", id);
        
        var notification = await _context.NotificationQueue
            .FirstOrDefaultAsync(n => n.QueueID == id);
        
        if (notification == null)
        {
            return NotFound(new { Success = false, Message = "Notification not found" });
        }
        
        // Use your existing ParseNotificationWithHtml method
        var response = ParseNotificationWithHtml(notification);
        
        return Ok(new { Success = true, Data = response });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting notification by ID {Id}", id);
        return StatusCode(500, new { Success = false, Message = "Internal server error" });
    }
}

        // GET: api/notifications/unread-count/{userId}
        [HttpGet("unread-count/{userId}")]
        public async Task<IActionResult> GetUnreadCount(int userId)
        {
            try
            {
                var count = await _context.NotificationQueue
                    .Where(n => n.UserID == userId && (n.Status == "SENT" || n.Status == "PENDING"))
                    .CountAsync();
                return Ok(new { Success = true, Count = count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unread count for user {UserId}", userId);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // POST: api/notifications/{id}/read
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkAsRead(long id, [FromQuery] int userId)
        {
            try
            {
                var notification = await _context.NotificationQueue
                    .FirstOrDefaultAsync(n => n.QueueID == id && n.UserID == userId);
                
                if (notification == null)
                    return NotFound(new { Success = false, Message = "Notification not found" });

                notification.Status = "READ";
                notification.ProcessedTime = DateTime.Now;
                await _context.SaveChangesAsync();

                // Log the action
                var log = new NotificationLog
                {
                    QueueID = notification.QueueID,
                    UserID = userId,
                    Action = "MARKED_READ",
                    Timestamp = DateTime.Now,
                    Details = $"Notification marked as read by user {userId}"
                };
                _context.NotificationLogs.Add(log);
                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = "Notification marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification {Id} as read", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // POST: api/notifications/mark-all-read
        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllAsRead([FromQuery] int userId)
        {
            try
            {
                var notifications = await _context.NotificationQueue
                    .Where(n => n.UserID == userId && (n.Status == "SENT" || n.Status == "PENDING"))
                    .ToListAsync();

                foreach (var notification in notifications)
                {
                    notification.Status = "READ";
                    notification.ProcessedTime = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                // Log the action
                var log = new NotificationLog
                {
                    QueueID = 0,
                    UserID = userId,
                    Action = "MARKED_ALL_READ",
                    Timestamp = DateTime.Now,
                    Details = $"All notifications marked as read by user {userId}, count: {notifications.Count}"
                };
                _context.NotificationLogs.Add(log);
                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = $"All notifications marked as read", Count = notifications.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read for user {UserId}", userId);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // GET: api/notifications/pending
        [HttpGet("pending")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetPendingNotifications([FromQuery] int limit = 100)
        {
            try
            {
                var notifications = await _context.NotificationQueue
                    .Where(n => n.Status == "PENDING")
                    .OrderBy(n => n.ScheduledTime)
                    .Take(limit)
                    .ToListAsync();
                
                var notificationDtos = notifications.Select(n => new NotificationDTO
                {
                    QueueID = n.QueueID,
                    RuleID = n.RuleID,
                    UserID = n.UserID,
                    UserType = n.UserType ?? "",
                    Title = n.Title ?? "",
                    Message = n.Message ?? "",
                    DataPayload = TryParseJson(n.DataPayload),
                    Status = n.Status ?? "",
                    Priority = n.Priority,
                    ScheduledTime = n.ScheduledTime,
                    ProcessedTime = n.ProcessedTime,
                    CreatedTime = n.CreatedTime,
                    AttemptCount = n.AttemptCount,
                    ErrorMessage = n.ErrorMessage
                }).ToList();
                
                return Ok(new { Success = true, Data = notificationDtos, Count = notificationDtos.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending notifications");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // GET: api/notifications/failed
        [HttpGet("failed")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetFailedNotifications([FromQuery] int limit = 100)
        {
            try
            {
                var notifications = await _context.NotificationQueue
                    .Where(n => n.Status == "FAILED")
                    .OrderByDescending(n => n.CreatedTime)
                    .Take(limit)
                    .ToListAsync();
                
                var notificationDtos = notifications.Select(n => new NotificationDTO
                {
                    QueueID = n.QueueID,
                    RuleID = n.RuleID,
                    UserID = n.UserID,
                    UserType = n.UserType ?? "",
                    Title = n.Title ?? "",
                    Message = n.Message ?? "",
                    DataPayload = TryParseJson(n.DataPayload),
                    Status = n.Status ?? "",
                    Priority = n.Priority,
                    ScheduledTime = n.ScheduledTime,
                    ProcessedTime = n.ProcessedTime,
                    CreatedTime = n.CreatedTime,
                    AttemptCount = n.AttemptCount,
                    ErrorMessage = n.ErrorMessage
                }).ToList();
                
                return Ok(new { Success = true, Data = notificationDtos, Count = notificationDtos.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting failed notifications");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // GET: api/notifications/stats
        [HttpGet("stats")]
        [Authorize(Roles = "Admin,Manager,admin")]
        public async Task<IActionResult> GetNotificationStats([FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            try
            {
                fromDate ??= DateTime.Now.AddDays(-30);
                toDate ??= DateTime.Now;
                
                var stats = await _context.NotificationQueue
                    .Where(n => n.CreatedTime >= fromDate && n.CreatedTime <= toDate)
                    .GroupBy(n => n.Status)
                    .Select(g => new
                    {
                        Status = g.Key,
                        Count = g.Count(),
                        LastCreated = g.Max(n => n.CreatedTime)
                    })
                    .ToListAsync();
                
                var total = stats.Sum(s => s.Count);
                var sentCount = stats.FirstOrDefault(s => s.Status == "SENT")?.Count ?? 0;
                var failedCount = stats.FirstOrDefault(s => s.Status == "FAILED")?.Count ?? 0;
                
                return Ok(new
                {
                    Success = true,
                    Data = new
                    {
                        Period = new { From = fromDate, To = toDate },
                        Total = total,
                        ByStatus = stats,
                        SuccessRate = total > 0 ? (sentCount / (double)total * 100) : 0,
                        FailureRate = total > 0 ? (failedCount / (double)total * 100) : 0
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification stats");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // POST: api/notifications/retry/{id}
        [HttpPost("retry/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> RetryNotification(long id)
        {
            try
            {
                var notification = await _context.NotificationQueue.FindAsync(id);
                if (notification == null)
                    return NotFound(new { Success = false, Message = "Notification not found" });
                
                if (notification.Status != "FAILED")
                    return BadRequest(new { Success = false, Message = "Only failed notifications can be retried" });
                
                notification.Status = "PENDING";
                notification.ScheduledTime = DateTime.Now;
                notification.LastAttemptTime = null;
                notification.ErrorMessage = null;
                notification.AttemptCount = 0;
                
                await _context.SaveChangesAsync();

                // Log the action
                var log = new NotificationLog
                {
                    QueueID = notification.QueueID,
                    UserID = notification.UserID,
                    Action = "RETRY",
                    Timestamp = DateTime.Now,
                    Details = $"Notification queued for retry"
                };
                _context.NotificationLogs.Add(log);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Retrying notification {Id}", id);
                
                return Ok(new { Success = true, Message = "Notification queued for retry" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrying notification {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // POST: api/notifications/retry-failed
        [HttpPost("retry-failed")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> RetryAllFailed([FromQuery] int? ruleId = null)
        {
            try
            {
                var query = _context.NotificationQueue.Where(n => n.Status == "FAILED");
                
                if (ruleId.HasValue)
                    query = query.Where(n => n.RuleID == ruleId.Value);
                
                var failedNotifications = await query.ToListAsync();
                
                foreach (var notification in failedNotifications)
                {
                    notification.Status = "PENDING";
                    notification.ScheduledTime = DateTime.Now;
                    notification.LastAttemptTime = null;
                    notification.ErrorMessage = null;
                    notification.AttemptCount = 0;
                }
                
                await _context.SaveChangesAsync();

                // Log the action
                var log = new NotificationLog
                {
                    QueueID = 0,
                    UserID = 0,
                    Action = "RETRY_ALL_FAILED",
                    Timestamp = DateTime.Now,
                    Details = $"All failed notifications queued for retry, count: {failedNotifications.Count}"
                };
                _context.NotificationLogs.Add(log);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Retried {Count} failed notifications", failedNotifications.Count);
                
                return Ok(new { Success = true, Message = $"Retried {failedNotifications.Count} failed notifications" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrying all failed notifications");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        // POST: api/notifications/cleanup
        [HttpPost("cleanup")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CleanupOldNotifications([FromQuery] int days = 30)
        {
            try
            {
                var cutoffDate = DateTime.Now.AddDays(-days);
                
                // Find notifications to archive
                var notificationsToArchive = await _context.NotificationQueue
                    .Where(n => n.CreatedTime < cutoffDate && 
                               (n.Status == "READ" || n.Status == "FAILED" || n.Status == "SENT"))
                    .ToListAsync();
                
                // Move to history
                foreach (var notification in notificationsToArchive)
                {
                    var history = new NotificationHistory
                    {
                        RuleID = notification.RuleID,
                        UserID = notification.UserID,
                        Title = notification.Title,
                        Message = notification.Message,
                        Category = GetCategoryFromRule(notification.RuleID),
                        SentTime = notification.CreatedTime,
                        ReadTime = notification.ProcessedTime,
                        ArchivedDate = DateTime.Now
                    };
                    
                    _context.NotificationHistory.Add(history);
                    _context.NotificationQueue.Remove(notification);
                }
                
                await _context.SaveChangesAsync();

                // Log the action
                var log = new NotificationLog
                {
                    QueueID = 0,
                    UserID = 0,
                    Action = "CLEANUP",
                    Timestamp = DateTime.Now,
                    Details = $"Cleaned up {notificationsToArchive.Count} notifications older than {days} days"
                };
                _context.NotificationLogs.Add(log);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Cleaned up {Count} old notifications", notificationsToArchive.Count);
                
                return Ok(new { 
                    Success = true, 
                    Message = $"Cleaned up {notificationsToArchive.Count} old notifications",
                    ArchivedCount = notificationsToArchive.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up old notifications");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        private NotificationResponseDto ParseNotificationWithHtml(NotificationQueue notification)
{
    var isHtml = (notification.Title?.Contains("<") == true && notification.Title?.Contains(">") == true) ||
                 (notification.Message?.Contains("<") == true && notification.Message?.Contains(">") == true);

    var response = new NotificationResponseDto
    {
        QueueID = notification.QueueID,
        Title = notification.Title ?? "",
        Message = notification.Message ?? "",
        Status = notification.Status ?? "",
        CreatedTime = notification.CreatedTime,
        IsHtmlContent = isHtml
    };

    if (isHtml)
    {
        response.TitleHtml = notification.Title ?? "";
        response.MessageHtml = notification.Message ?? "";
        response.TitlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(notification.Title ?? "", 100);
        response.MessagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(notification.Message ?? "", 200);
    }
    else
    {
        response.TitlePlain = notification.Title ?? "";
        response.MessagePlain = notification.Message ?? "";
    }

    response.DataPayload = TryParseJson(notification.DataPayload);
    
    return response;
}

        // DELETE: api/notifications/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DeleteNotification(long id)
        {
            try
            {
                var notification = await _context.NotificationQueue.FindAsync(id);
                if (notification == null)
                    return NotFound(new { Success = false, Message = "Notification not found" });

                // Check if it's still pending
                if (notification.Status == "PENDING" || notification.Status == "PROCESSING")
                    return BadRequest(new { Success = false, Message = "Cannot delete pending or processing notifications" });

                _context.NotificationQueue.Remove(notification);
                await _context.SaveChangesAsync();

                // Log the action
                var log = new NotificationLog
                {
                    QueueID = id,
                    UserID = notification.UserID,
                    Action = "DELETE",
                    Timestamp = DateTime.Now,
                    Details = $"Notification deleted"
                };
                _context.NotificationLogs.Add(log);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Deleted notification {Id}", id);
                
                return Ok(new { Success = true, Message = "Notification deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notification {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        private string GetCategoryFromRule(int ruleId)
        {
            var rule = _context.NotificationRules.Find(ruleId);
            return rule?.Category ?? "GENERAL";
        }

        // Helper methods to convert JObject to Dictionary
        private Dictionary<string, object> ConvertJObjectToDictionary(JObject jObject)
        {
            var dict = new Dictionary<string, object>();
            foreach (var property in jObject.Properties())
            {
                var value = property.Value;
                
                if (value.Type == JTokenType.Object)
                {
                    dict[property.Name] = ConvertJObjectToDictionary((JObject)value);
                }
                else if (value.Type == JTokenType.Array)
                {
                    dict[property.Name] = ConvertJArrayToList((JArray)value);
                }
                else
                {
                    dict[property.Name] = ((JValue)value).Value;
                }
            }
            return dict;
        }

        private List<object> ConvertJArrayToList(JArray jArray)
        {
            var list = new List<object>();
            foreach (var item in jArray)
            {
                if (item.Type == JTokenType.Object)
                {
                    list.Add(ConvertJObjectToDictionary((JObject)item));
                }
                else if (item.Type == JTokenType.Array)
                {
                    list.Add(ConvertJArrayToList((JArray)item));
                }
                else
                {
                    list.Add(((JValue)item).Value);
                }
            }
            return list;
        }

        private object TryParseJson(string json)
        {
            if (string.IsNullOrEmpty(json))
            {
                return null;
            }
            
            try
            {
                var jObject = JObject.Parse(json);
                
                // Convert to Dictionary for System.Text.Json compatibility
                var dict = new Dictionary<string, object>();
                foreach (var property in jObject.Properties())
                {
                    var value = property.Value;
                    
                    if (value.Type == JTokenType.Object)
                    {
                        dict[property.Name] = ConvertJObjectToDictionary((JObject)value);
                    }
                    else if (value.Type == JTokenType.Array)
                    {
                        dict[property.Name] = ConvertJArrayToList((JArray)value);
                    }
                    else
                    {
                        dict[property.Name] = ((JValue)value).Value;
                    }
                }
                
                return dict;
            }
            catch
            {
                return new Dictionary<string, object>
                {
                    ["raw"] = json,
                    ["error"] = "Failed to parse JSON"
                };
            }
        }
    }

    public class NotificationResponseDto
{
    public long QueueID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string TitleHtml { get; set; } = string.Empty;
    public string MessageHtml { get; set; } = string.Empty;
    public string TitlePlain { get; set; } = string.Empty;
    public string MessagePlain { get; set; } = string.Empty;
    public bool IsHtmlContent { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedTime { get; set; }
    public object DataPayload { get; set; } = null!;
}
}