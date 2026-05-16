using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Models;
using school_management_Backend.Models.ViewModels;
using school_management_Backend.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using Hangfire;  // ✅ Only this Hangfire using statement

namespace school_management_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationRulesController : ControllerBase
    {
        private readonly INotificationRuleProcessor _ruleProcessor;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NotificationRulesController> _logger;

        public NotificationRulesController(
            INotificationRuleProcessor ruleProcessor,
            ApplicationDbContext context,
            ILogger<NotificationRulesController> logger)
        {
            _ruleProcessor = ruleProcessor;
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public async Task<IActionResult> GetRules([FromQuery] bool? active = null, [FromQuery] string? category = null)
        {
            try
            {
                var query = _context.NotificationRules.AsQueryable();
                
                if (active.HasValue)
                    query = query.Where(r => r.IsActive == active.Value);
                
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(r => r.Category == category);
                
                var currentUserId = GetCurrentUserId();
                var isAdmin = User.IsInRole("Admin");
                var isManager = User.IsInRole("Manager");
                
                if (!isAdmin && !isManager)
                {
                    query = query.Where(r => r.CreatedBy == currentUserId);
                }
                
                var rules = await query
                    .OrderByDescending(r => r.CreatedDate)
                    .AsNoTracking()
                    .ToListAsync();
                
                var ruleDTOs = new List<NotificationRuleDTO>();
                foreach (var rule in rules)
                {
                    var dto = new NotificationRuleDTO
                    {
                        RuleID = rule.RuleID,
                        RuleName = rule.RuleName ?? string.Empty,
                        RuleType = rule.RuleType ?? "EVENT",
                        Category = rule.Category ?? "GENERAL",
                        SourceTable = rule.SourceTable,
                        TriggerField = rule.TriggerField,
                        TriggerValue = rule.TriggerValue,
                        TimingType = rule.TimingType,
                        FixedTime = rule.FixedTime,
                        DaysOffset = rule.DaysOffset,
                        CronExpression = rule.CronExpression,
                        TitleTemplate = rule.TitleTemplate ?? string.Empty,
                        MessageTemplate = rule.MessageTemplate ?? string.Empty,
                        DataTemplate = rule.DataTemplate,
                        TargetType = rule.TargetType,
                        TargetFilter = SafeParseTargetFilter(rule.TargetFilter),
                        IsActive = rule.IsActive,
                        IsBatch = rule.IsBatch,
                        Priority = rule.Priority,
                        LastRunTime = rule.LastRunTime,
                        NextRunTime = rule.NextRunTime,
                        TotalRuns = rule.TotalRuns,
                        CreatedDate = rule.CreatedDate,
                        CreatedBy = rule.CreatedBy,
                        IsManualTrigger = rule.IsManualTrigger
                    };
                    ruleDTOs.Add(dto);
                }
                
                return Ok(new { Success = true, Data = ruleDTOs });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification rules");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public async Task<IActionResult> GetRule(int id)
        {
            try
            {
                var rule = await _context.NotificationRules.FindAsync(id);
                if (rule == null)
                    return NotFound(new { Success = false, Message = "Rule not found" });

                var currentUserId = GetCurrentUserId();
                var isAdmin = User.IsInRole("Admin");
                var isManager = User.IsInRole("Manager");
                
                if (!isAdmin && !isManager && rule.CreatedBy != currentUserId)
                    return Forbid();

                var ruleDto = new NotificationRuleDTO
                {
                    RuleID = rule.RuleID,
                    RuleName = rule.RuleName ?? string.Empty,
                    RuleType = rule.RuleType ?? "EVENT",
                    Category = rule.Category ?? "GENERAL",
                    SourceTable = rule.SourceTable,
                    TriggerField = rule.TriggerField,
                    TriggerValue = rule.TriggerValue,
                    TimingType = rule.TimingType,
                    FixedTime = rule.FixedTime,
                    DaysOffset = rule.DaysOffset,
                    CronExpression = rule.CronExpression,
                    TitleTemplate = rule.TitleTemplate ?? string.Empty,
                    MessageTemplate = rule.MessageTemplate ?? string.Empty,
                    DataTemplate = rule.DataTemplate,
                    TargetType = rule.TargetType,
                    TargetFilter = SafeParseTargetFilter(rule.TargetFilter),
                    IsActive = rule.IsActive,
                    IsBatch = rule.IsBatch,
                    Priority = rule.Priority,
                    LastRunTime = rule.LastRunTime,
                    NextRunTime = rule.NextRunTime,
                    TotalRuns = rule.TotalRuns,
                    CreatedDate = rule.CreatedDate,
                    CreatedBy = rule.CreatedBy,
                    IsManualTrigger = rule.IsManualTrigger
                };

                return Ok(new { Success = true, Data = ruleDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting rule {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public async Task<IActionResult> CreateRule([FromBody] CreateNotificationRuleVM model)
        {
            try
            {
                _logger.LogInformation("CreateRule called with model: {@Model}", model);

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    _logger.LogWarning("Model validation failed: {@Errors}", errors);
                    
                    return BadRequest(new { 
                        Success = false, 
                        Errors = errors 
                    });
                }

                var currentUserId = GetCurrentUserId();

                bool isManualTrigger = model.RuleType == "MANUAL" || 
                                      (model.RuleType == "EVENT" && model.TimingType == "IMMEDIATE");

                _logger.LogInformation("Creating rule: RuleName={RuleName}, Category={Category}, CreatedBy={CreatedBy}, IsManual={IsManual}", 
                    model.RuleName, model.Category, currentUserId, isManualTrigger);

                string processedTargetFilter = await ProcessTargetFilterAsync(model.TargetFilter, model.TargetType, model.Category);

                var rule = new NotificationRule
                {
                    RuleName = model.RuleName ?? string.Empty,
                    Category = model.Category ?? "GENERAL",
                    RuleType = model.RuleType ?? "EVENT",
                    IsManualTrigger = isManualTrigger,
                    SourceTable = model.SourceTable,
                    TriggerField = model.TriggerField,
                    TriggerValue = model.TriggerValue,
                    TimingType = model.TimingType ?? "DAILY",
                    DaysOffset = model.DaysOffset,
                    FixedTime = model.FixedTime,
                    CronExpression = model.CronExpression,
                    TitleTemplate = model.TitleTemplate ?? string.Empty,
                    MessageTemplate = model.MessageTemplate ?? string.Empty,
                    DataTemplate = model.DataTemplate,
                    TargetType = model.TargetType ?? "ALL",
                    TargetFilter = processedTargetFilter,
                    IsBatch = model.IsBatch,
                    Priority = (byte)model.Priority,
                    CreatedBy = currentUserId,
                    IsActive = model.IsActive,
                    CreatedDate = DateTime.Now
                };

                if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
                {
                    try
                    {
                        JToken.Parse(rule.TargetFilter);
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogWarning("Invalid JSON in TargetFilter: {Error}", ex.Message);
                        return BadRequest(new { 
                            Success = false, 
                            Message = "TargetFilter must be valid JSON" 
                        });
                    }
                }

                _logger.LogInformation("Storing TargetFilter as: {TargetFilter}", rule.TargetFilter);

                if (!rule.IsManualTrigger && rule.RuleType != "MANUAL")
                {
                    rule.NextRunTime = await _ruleProcessor.CalculateNextRunTime(rule);
                }
                
                _context.NotificationRules.Add(rule);
                await _context.SaveChangesAsync();
                
                if (rule.RuleType == "CRON" && !rule.IsManualTrigger && rule.IsActive)
                {
                    await _ruleProcessor.ScheduleRule(rule);
                }
                
                _logger.LogInformation("Successfully created notification rule: {RuleName} (ID: {RuleID}, Manual: {IsManual})", 
                    rule.RuleName, rule.RuleID, rule.IsManualTrigger);
                
                return Ok(new { 
                    Success = true, 
                    Message = "Rule created successfully", 
                    Data = new { rule.RuleID, rule.RuleName, rule.NextRunTime, rule.IsManualTrigger } 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification rule");
                return StatusCode(500, new { 
                    Success = false, 
                    Message = $"Internal server error: {ex.Message}" 
                });
            }
        }

        [HttpPost("{id}/update")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public async Task<IActionResult> UpdateRule(int id, [FromBody] CreateNotificationRuleVM model)
        {
            try
            {
                _logger.LogInformation("UpdateRule called for ID {Id} with model: {@Model}", id, model);

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    _logger.LogWarning("Model validation failed: {@Errors}", errors);
                    
                    return BadRequest(new { 
                        Success = false, 
                        Errors = errors 
                    });
                }

                var rule = await _context.NotificationRules.FindAsync(id);
                if (rule == null)
                    return NotFound(new { Success = false, Message = "Rule not found" });

                var currentUserId = GetCurrentUserId();
                var isAdmin = User.IsInRole("Admin");
                var isManager = User.IsInRole("Manager");
                
                if (!isAdmin && !isManager && rule.CreatedBy != currentUserId)
                    return Forbid();

                bool isManualTrigger = model.RuleType == "MANUAL" || 
                                      (model.RuleType == "EVENT" && model.TimingType == "IMMEDIATE");

                _logger.LogInformation("Updating rule {Id} with: RuleName={RuleName}, IsActive={IsActive}, IsManual={IsManual}", 
                    id, model.RuleName, model.IsActive, isManualTrigger);

                string processedTargetFilter = await ProcessTargetFilterAsync(model.TargetFilter, model.TargetType, model.Category);

                rule.RuleName = model.RuleName ?? string.Empty;
                rule.Category = model.Category ?? "GENERAL";
                rule.RuleType = model.RuleType ?? "EVENT";
                rule.IsManualTrigger = isManualTrigger;
                rule.SourceTable = model.SourceTable;
                rule.TriggerField = model.TriggerField;
                rule.TriggerValue = model.TriggerValue;
                rule.TimingType = model.TimingType ?? "DAILY";
                rule.DaysOffset = model.DaysOffset;
                rule.FixedTime = model.FixedTime;
                rule.CronExpression = model.CronExpression;
                rule.TitleTemplate = model.TitleTemplate ?? string.Empty;
                rule.MessageTemplate = model.MessageTemplate ?? string.Empty;
                rule.DataTemplate = model.DataTemplate;
                rule.TargetType = model.TargetType ?? "ALL";
                rule.TargetFilter = processedTargetFilter;
                rule.IsBatch = model.IsBatch;
                rule.Priority = (byte)model.Priority;
                rule.ModifiedDate = DateTime.Now;
                rule.ModifiedBy = currentUserId;
                rule.IsActive = model.IsActive;

                if (!rule.IsManualTrigger && rule.RuleType != "MANUAL" && rule.IsActive)
                {
                    rule.NextRunTime = await _ruleProcessor.CalculateNextRunTime(rule);
                }
                else
                {
                    rule.NextRunTime = null;
                }
                
                await _context.SaveChangesAsync();
                
                if (rule.RuleType == "CRON" && !rule.IsManualTrigger && rule.IsActive)
                {
                    await _ruleProcessor.ScheduleRule(rule);
                }
                else if (!rule.IsActive || rule.IsManualTrigger)
                {
                    RecurringJob.RemoveIfExists($"notification-rule-{rule.RuleID}");
                }
                
                _logger.LogInformation("Successfully updated notification rule: {RuleName} (ID: {RuleID}, Manual: {IsManual})", 
                    rule.RuleName, rule.RuleID, rule.IsManualTrigger);
                
                return Ok(new { Success = true, Message = "Rule updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating rule {Id}", id);
                return StatusCode(500, new { 
                    Success = false, 
                    Message = $"Internal server error: {ex.Message}" 
                });
            }
        }

        [HttpPost("{id}/test")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public async Task<IActionResult> TestRule(int id, [FromBody] TestRuleVM model)
        {
            try
            {
                var rule = await _context.NotificationRules.FindAsync(id);
                if (rule == null)
                    return NotFound(new { Success = false, Message = "Rule not found" });
                
                var currentUserId = GetCurrentUserId();
                var isAdmin = User.IsInRole("Admin");
                var isManager = User.IsInRole("Manager");
                
                if (!isAdmin && !isManager && rule.CreatedBy != currentUserId)
                    return Forbid();
                
                var testData = new Dictionary<string, object>();
                if (model.TestData != null)
                {
                    testData = model.TestData;
                }
                else
                {
                    testData = GetSampleTestData(rule.Category ?? "GENERAL");
                }
                
                var notification = new NotificationQueue
                {
                    RuleID = rule.RuleID,
                    UserID = model.TestUserID,
                    Title = await _ruleProcessor.ResolveTemplate(rule.TitleTemplate ?? string.Empty, testData),
                    Message = await _ruleProcessor.ResolveTemplate(rule.MessageTemplate ?? string.Empty, testData),
                    DataPayload = !string.IsNullOrEmpty(rule.DataTemplate) ? 
                        await _ruleProcessor.ResolveTemplate(rule.DataTemplate, testData) : null,
                    Status = "PENDING",
                    Priority = rule.Priority,
                    ScheduledTime = DateTime.Now,
                    CreatedTime = DateTime.Now
                };
                
                _context.NotificationQueue.Add(notification);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Tested rule {RuleID} for user {UserID}", rule.RuleID, model.TestUserID);
                
                return Ok(new { 
                    Success = true, 
                    Message = "Rule tested successfully",
                    NotificationId = notification.QueueID
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing rule {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpPost("{id}/activate")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public async Task<IActionResult> ActivateRule(int id, [FromBody] UpdateRuleStatusVM model)
        {
            try
            {
                var rule = await _context.NotificationRules.FindAsync(id);
                if (rule == null)
                    return NotFound(new { Success = false, Message = "Rule not found" });
                
                var currentUserId = GetCurrentUserId();
                var isAdmin = User.IsInRole("Admin");
                var isManager = User.IsInRole("Manager");
                
                if (!isAdmin && !isManager && rule.CreatedBy != currentUserId)
                    return Forbid();
                
                rule.IsActive = model.IsActive;
                rule.ModifiedDate = DateTime.Now;
                rule.ModifiedBy = currentUserId;
                
                if (model.IsActive && !rule.IsManualTrigger && rule.RuleType != "MANUAL")
                {
                    rule.NextRunTime = await _ruleProcessor.CalculateNextRunTime(rule);
                    if (rule.RuleType == "CRON")
                    {
                        await _ruleProcessor.ScheduleRule(rule);
                    }
                }
                else if (!model.IsActive)
                {
                    rule.NextRunTime = null;
                    if (rule.RuleType == "CRON")
                    {
                        RecurringJob.RemoveIfExists($"notification-rule-{rule.RuleID}");
                    }
                }
                
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("{Action} rule {RuleID}", model.IsActive ? "Activated" : "Deactivated", rule.RuleID);
                
                return Ok(new { 
                    Success = true, 
                    Message = $"Rule {(model.IsActive ? "activated" : "deactivated")} successfully" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating rule status {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpPost("{id}/execute")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public async Task<IActionResult> ExecuteRule(int id)
        {
            try
            {
                _logger.LogInformation("🚀 Manual execution requested for rule ID: {Id}", id);
                
                var rule = await _context.NotificationRules.FindAsync(id);
                if (rule == null)
                    return NotFound(new { Success = false, Message = "Rule not found" });
                
                var currentUserId = GetCurrentUserId();
                var isAdmin = User.IsInRole("Admin");
                var isManager = User.IsInRole("Manager");
                
                if (!isAdmin && !isManager && rule.CreatedBy != currentUserId)
                    return Forbid();
                
                if (!rule.IsActive)
                    return BadRequest(new { Success = false, Message = "Rule is not active" });
                
                _logger.LogInformation("⚡ Manually executing rule: {RuleName} (ID: {RuleID}, Manual: {IsManual})", 
                    rule.RuleName, rule.RuleID, rule.IsManualTrigger);
                
                await _ruleProcessor.ExecuteRuleManuallyAsync(id);
                
                await _context.Entry(rule).ReloadAsync();
                
                return Ok(new { 
                    Success = true, 
                    Message = "Rule executed manually successfully",
                    RuleStatistics = new {
                        rule.LastRunTime,
                        rule.NextRunTime,
                        rule.TotalRuns
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error executing rule {Id} manually", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpPost("{id}/delete")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DeleteRule(int id)
        {
            try
            {
                var rule = await _context.NotificationRules.FindAsync(id);
                if (rule == null)
                    return NotFound(new { Success = false, Message = "Rule not found" });

                var hasPendingNotifications = await _context.NotificationQueue
                    .AnyAsync(n => n.RuleID == id && (n.Status == "PENDING" || n.Status == "PROCESSING"));
                
                if (hasPendingNotifications)
                    return BadRequest(new { 
                        Success = false, 
                        Message = "Cannot delete rule with pending notifications" 
                    });

                if (rule.RuleType == "CRON")
                {
                    RecurringJob.RemoveIfExists($"notification-rule-{rule.RuleID}");
                }

                _context.NotificationRules.Remove(rule);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Deleted rule {RuleID}", rule.RuleID);
                
                return Ok(new { Success = true, Message = "Rule deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting rule {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpGet("categories")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public IActionResult GetCategories()
        {
            var categories = new[]
            {
                new { Value = "FEE", Label = "Fee", Description = "Fee-related notifications", Icon = "PaymentIcon" },
                new { Value = "ATTENDANCE", Label = "Attendance", Description = "Attendance notifications", Icon = "AccountBalanceIcon" },
                new { Value = "EXAM", Label = "Exam", Description = "Exam notifications", Icon = "SchoolIcon" },
                new { Value = "HOMEWORK", Label = "Homework", Description = "Homework notifications", Icon = "AssignmentIcon" },
                new { Value = "ANNOUNCEMENT", Label = "Announcement", Description = "Announcement notifications", Icon = "AnnouncementIcon" },
                new { Value = "GENERAL", Label = "General", Description = "General notifications", Icon = "InfoIcon" },
                new { Value = "ALERT", Label = "Alert", Description = "Alert notifications", Icon = "WarningIcon" },
                new { Value = "EVENT", Label = "Event", Description = "Event notifications", Icon = "EventIcon" }
            };
            
            return Ok(new { Success = true, Data = categories });
        }

        [HttpGet("timing-types")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public IActionResult GetTimingTypes()
        {
            var timingTypes = new[]
            {
                new { Value = "IMMEDIATE", Label = "Immediate", Description = "Run immediately when triggered" },
                new { Value = "FIXED_TIME", Label = "Fixed Time", Description = "Run at specific time each day" },
                new { Value = "DAYS_OFFSET", Label = "Days Offset", Description = "Run every X days" },
                new { Value = "CRON", Label = "Cron Expression", Description = "Advanced scheduling using cron syntax" },
                new { Value = "DAILY", Label = "Daily", Description = "Run once per day" },
                new { Value = "WEEKLY", Label = "Weekly", Description = "Run once per week" },
                new { Value = "BIWEEKLY", Label = "Bi-weekly", Description = "Run every 2 weeks" },
                new { Value = "MONTHLY", Label = "Monthly", Description = "Run once per month" },
                new { Value = "WEEKDAY", Label = "Weekday", Description = "Run on weekdays only" },
                new { Value = "WEEKEND", Label = "Weekend", Description = "Run on weekends only" }
            };
            
            return Ok(new { Success = true, Data = timingTypes });
        }

        [HttpGet("target-types")]
        [Authorize(Roles = "Admin,Manager,Teacher")]
        public IActionResult GetTargetTypes()
        {
            var targetTypes = new[]
            {
                new { Value = "ALL", Label = "All Users", Description = "Send to all users" },
                new { Value = "PARENTS", Label = "Parents Only", Description = "Send to parents only" },
                new { Value = "TEACHERS", Label = "Teachers Only", Description = "Send to teachers only" },
                new { Value = "STUDENTS", Label = "Students Only", Description = "Send to students only" },
                new { Value = "CLASS", Label = "Class Specific", Description = "Send to specific class" },
                new { Value = "SECTION", Label = "Section Specific", Description = "Send to specific section" },
                new { Value = "SPECIFIC_USERS", Label = "Specific Users", Description = "Send to specific users" }
            };
            
            return Ok(new { Success = true, Data = targetTypes });
        }

        private async Task<string> ProcessTargetFilterAsync(string targetFilter, string targetType, string category)
        {
            if (string.IsNullOrEmpty(targetFilter) || targetFilter == "{}")
                return "{}";

            try
            {
                JToken parsed;
                try
                {
                    parsed = JToken.Parse(targetFilter);
                }
                catch (JsonException)
                {
                    _logger.LogWarning("Invalid JSON in TargetFilter: {TargetFilter}", targetFilter);
                    return "{}";
                }
                
                if (targetType == "CLASS")
                {
                    List<int> classIds = new List<int>();
                    
                    if (parsed["ClassID"] is JArray classArray)
                    {
                        foreach (var item in classArray)
                        {
                            if (item.Type == JTokenType.Integer)
                            {
                                classIds.Add(item.Value<int>());
                            }
                            else if (item.Type == JTokenType.String)
                            {
                                if (int.TryParse(item.Value<string>(), out int val))
                                    classIds.Add(val);
                            }
                        }
                    }
                    else if (parsed["classId"] != null)
                    {
                        if (parsed["classId"].Type == JTokenType.Integer)
                        {
                            classIds.Add(parsed["classId"].Value<int>());
                        }
                        else if (parsed["classId"].Type == JTokenType.String)
                        {
                            if (int.TryParse(parsed["classId"].Value<string>(), out int val))
                                classIds.Add(val);
                        }
                    }
                    else if (parsed["classes"] is JArray classesArray)
                    {
                        foreach (var item in classesArray)
                        {
                            if (item.Type == JTokenType.Integer)
                            {
                                classIds.Add(item.Value<int>());
                            }
                        }
                    }
                    else if (parsed.Type == JTokenType.Array)
                    {
                        var array = parsed as JArray;
                        foreach (var item in array)
                        {
                            if (item.Type == JTokenType.Integer)
                            {
                                classIds.Add(item.Value<int>());
                            }
                        }
                    }
                    
                    if (classIds.Any())
                    {
                        var result = new JObject
                        {
                            ["ClassID"] = JArray.FromObject(classIds)
                        };
                        return result.ToString(Formatting.None);
                    }
                }
                else if (targetType == "SECTION" && parsed["SectionID"] != null)
                {
                    var transformed = new JObject
                    {
                        ["SectionID"] = parsed["SectionID"]
                    };
                    return transformed.ToString(Formatting.None);
                }
                
                return parsed.ToString(Formatting.None);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error processing TargetFilter");
                return "{}";
            }
        }

        private object? SafeParseTargetFilter(string targetFilter)
        {
            if (string.IsNullOrEmpty(targetFilter) || targetFilter == "{}")
                return null;
            
            try
            {
                var parsed = JObject.Parse(targetFilter);
                
                if (parsed["ClassID"] is JArray classArray)
                {
                    var actualValues = new List<int>();
                    foreach (var item in classArray)
                    {
                        if (item.Type == JTokenType.Integer)
                        {
                            actualValues.Add(item.Value<int>());
                        }
                        else if (item.Type == JTokenType.String)
                        {
                            if (int.TryParse(item.Value<string>(), out int val))
                                actualValues.Add(val);
                        }
                    }
                    
                    if (actualValues.Any())
                    {
                        return new Dictionary<string, object>
                        {
                            ["ClassID"] = actualValues
                        };
                    }
                }
                
                var dict = new Dictionary<string, object>();
                foreach (var prop in parsed.Properties())
                {
                    var value = prop.Value;
                    if (value.Type == JTokenType.Integer)
                    {
                        dict[prop.Name] = value.Value<int>();
                    }
                    else if (value.Type == JTokenType.String)
                    {
                        dict[prop.Name] = value.Value<string>() ?? string.Empty;
                    }
                    else if (value.Type == JTokenType.Boolean)
                    {
                        dict[prop.Name] = value.Value<bool>();
                    }
                    else if (value.Type == JTokenType.Array)
                    {
                        var array = value as JArray;
                        if (array != null && array.Count > 0 && array[0].Type == JTokenType.Integer)
                        {
                            dict[prop.Name] = array.Select(x => x.Value<int>()).ToList();
                        }
                        else
                        {
                            dict[prop.Name] = array?.Select(x => x.ToString()).ToList() ?? new List<string>();
                        }
                    }
                    else
                    {
                        dict[prop.Name] = value.ToString();
                    }
                }
                
                return dict;
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse TargetFilter as JObject: {TargetFilter}", targetFilter);
                
                try
                {
                    var array = JArray.Parse(targetFilter);
                    var values = new List<int>();
                    foreach (var item in array)
                    {
                        if (item.Type == JTokenType.Integer)
                        {
                            values.Add(item.Value<int>());
                        }
                    }
                    if (values.Any())
                    {
                        return new Dictionary<string, object>
                        {
                            ["ClassID"] = values
                        };
                    }
                    return values;
                }
                catch
                {
                    _logger.LogWarning("Failed to parse TargetFilter: {TargetFilter}", targetFilter);
                    return null;
                }
            }
        }

        private Dictionary<string, object> GetSampleTestData(string category)
        {
            var data = new Dictionary<string, object>();
            var pakistanNow = _ruleProcessor.GetPakistanTime();
            
            var categoryUpper = (category ?? "GENERAL").ToUpper();
            
            switch (categoryUpper)
            {
                case "FEE":
                    data["StudentName"] = "John Doe";
                    data["RollNumber"] = "2023-001";
                    data["ParentName"] = "Mr. Smith";
                    data["ClassName"] = "Grade 10";
                    data["DueAmount"] = "5000";
                    data["DueDate"] = pakistanNow.AddDays(7).ToString("dd/MM/yyyy");
                    data["FeeMonth"] = pakistanNow.ToString("MMMM");
                    data["FeeYear"] = pakistanNow.Year.ToString();
                    data["NotificationType"] = "DUE_IN_7_DAYS";
                    data["StatusText"] = "Due in 7 days";
                    break;
                    
                case "ATTENDANCE":
                    data["StudentName"] = "John Doe";
                    data["RollNumber"] = "2023-001";
                    data["ClassName"] = "Grade 10";
                    data["AttendanceDate"] = pakistanNow.ToString("dd/MM/yyyy");
                    data["Status"] = "Absent";
                    data["Remarks"] = "Medical Leave";
                    data["StudentCount"] = 1;
                    data["MultipleStudents"] = false;
                    break;
                    
                case "EXAM":
                    data["StudentName"] = "John Doe";
                    data["ExamTitle"] = "Mid Term Examination";
                    data["ExamDate"] = pakistanNow.AddDays(14).ToString("dd/MM/yyyy");
                    data["Subject"] = "Mathematics";
                    data["TotalMarks"] = "100";
                    data["PassingMarks"] = "33";
                    data["ExamType"] = "Regular";
                    break;
                    
                case "HOMEWORK":
                    data["StudentName"] = "John Doe";
                    data["HomeworkTitle"] = "Math Assignment";
                    data["HomeworkDescription"] = "Complete exercises 1-10";
                    data["Subject"] = "Mathematics";
                    data["DueDate"] = pakistanNow.AddDays(2).ToString("dd/MM/yyyy");
                    data["AssignedDate"] = pakistanNow.ToString("dd/MM/yyyy");
                    data["HomeworkType"] = "Regular";
                    break;
                    
                case "EVENT":
                    data["EventTitle"] = "Annual Sports Day";
                    data["EventDescription"] = "Annual sports competition";
                    data["EventDate"] = pakistanNow.AddDays(14).ToString("dd/MM/yyyy");
                    data["EventTime"] = "09:00 AM";
                    data["Location"] = "School Ground";
                    break;
                    
                default:
                    data["Name"] = "Test User";
                    data["Date"] = pakistanNow.ToString("dd/MM/yyyy");
                    data["Time"] = pakistanNow.ToString("hh:mm tt");
                    break;
            }
            
            data["CurrentDate"] = pakistanNow.ToString("dd/MM/yyyy");
            data["CurrentTime"] = pakistanNow.ToString("HH:mm");
            data["RuleName"] = "Test Rule";
            data["Category"] = category;
            
            return data;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? 
                             User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (int.TryParse(userIdClaim, out int userId))
                return userId;
            
            var userDataClaim = User.FindFirst("userData")?.Value;
            if (!string.IsNullOrEmpty(userDataClaim))
            {
                try
                {
                    var userData = JsonConvert.DeserializeObject<Dictionary<string, object>>(userDataClaim);
                    if (userData != null && userData.TryGetValue("id", out var idObj))
                    {
                        if (int.TryParse(idObj.ToString(), out int idFromData))
                            return idFromData;
                    }
                }
                catch
                {
                }
            }
            
            return 1;
        }
    }
}