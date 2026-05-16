
// BackgroundNotificationService.cs
using System;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Cronos;

namespace school_management_Backend.Services
{
    public class BackgroundNotificationService : IBackgroundNotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationRuleProcessor _ruleProcessor;
        private readonly INotificationService _notificationService;
        private readonly ILogger<BackgroundNotificationService> _logger;
        private readonly TimeZoneInfo _pakistanTimeZone;

        public BackgroundNotificationService(
            ApplicationDbContext context,
            INotificationRuleProcessor ruleProcessor,
            INotificationService notificationService,
            ILogger<BackgroundNotificationService> logger)
        {
            _context = context;
            _ruleProcessor = ruleProcessor;
            _notificationService = notificationService;
            _logger = logger;
            
            try
            {
                _pakistanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Pakistan Standard Time");
            }
            catch
            {
                try
                {
                    _pakistanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Karachi");
                }
                catch
                {
                    _pakistanTimeZone = TimeZoneInfo.Local;
                    _logger.LogWarning("⚠️ Pakistan timezone not found, using local timezone");
                }
            }
        }

        private DateTime GetPakistanTime()
        {
            return TimeZoneInfo.ConvertTime(DateTime.UtcNow, _pakistanTimeZone);
        }

        public async Task ProcessScheduledNotificationsAsync()
        {
            try
            {
                var pakistanNow = GetPakistanTime();
                _logger.LogInformation("🕐 Processing scheduled notifications at Pakistan time: {Time}", 
                    pakistanNow.ToString("yyyy-MM-dd HH:mm:ss"));
                
                var dueRules = await _context.NotificationRules
                    .Where(r => r.IsActive && 
                           (r.RuleType == "SCHEDULED" || r.RuleType == "CRON") &&
                           !r.IsManualTrigger &&
                           (r.NextRunTime == null || r.NextRunTime <= pakistanNow))
                    .ToListAsync();

                _logger.LogInformation("📋 Found {Count} scheduled rules due for processing", dueRules.Count);

                foreach (var rule in dueRules)
                {
                    try
                    {
                        _logger.LogInformation("⚡ Processing scheduled rule: {RuleName} (ID: {RuleID}, Type: {RuleType})", 
                            rule.RuleName, rule.RuleID, rule.RuleType);
                        
                        await ProcessRuleBasedOnCategory(rule);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error processing scheduled rule {RuleID}", rule.RuleID);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in ProcessScheduledNotificationsAsync");
            }
        }

        public async Task CheckEventRulesAsync()
        {
            try
            {
                var pakistanNow = GetPakistanTime();
                
                var eventRules = await _context.NotificationRules
                    .Where(r => r.IsActive && 
                           r.RuleType == "EVENT" && 
                           !r.IsManualTrigger)
                    .ToListAsync();

                _logger.LogInformation("📋 Found {Count} active automatic event rules", eventRules.Count);

                foreach (var rule in eventRules)
                {
                    try
                    {
                        if (rule.TimingType == "IMMEDIATE")
                        {
                            if (rule.LastRunTime.HasValue && 
                                (pakistanNow - rule.LastRunTime.Value).TotalMinutes < 5)
                            {
                                _logger.LogInformation("⏸️ Event rule {RuleID} ran {Minutes} minutes ago, skipping", 
                                    rule.RuleID, (int)(pakistanNow - rule.LastRunTime.Value).TotalMinutes);
                                continue;
                            }
                        }
                        
                        await CheckSpecificEventRuleAsync(rule);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error checking event rule {RuleID}", rule.RuleID);
                    }
                }
                
                var manualRules = await _context.NotificationRules
                    .Where(r => r.IsActive && r.IsManualTrigger)
                    .ToListAsync();
                    
                if (manualRules.Any())
                {
                    _logger.LogInformation("🔧 Found {Count} manual trigger rules (will only run when manually executed)", 
                        manualRules.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in CheckEventRulesAsync");
            }
        }

        public async Task CheckSpecificEventRuleAsync(NotificationRule rule)
        {
            _logger.LogInformation("🔍 Processing event rule: {RuleName} (Category: {Category})", rule.RuleName, rule.Category);

            if (!await ShouldRuleRunNowAsync(rule))
            {
                _logger.LogInformation("⏸️ Event rule {RuleID} should not run now based on timing, skipping", rule.RuleID);
                return;
            }

            switch (rule.Category?.ToUpper())
            {
                case "ATTENDANCE":
                    await ProcessAttendanceRuleAsync(rule);
                    break;
                case "FEE":
                    await ProcessFeeRuleAsync(rule);
                    break;
                case "EXAM":
                    await ProcessExamRuleAsync(rule);
                    break;
                case "HOMEWORK":
                case "ANNOUNCEMENT":
                case "GENERAL":
                case "ALERT":
                    await ProcessGenericRuleAsync(rule);
                    break;
                default:
                    _logger.LogWarning("⚠️ Unknown category '{Category}' for rule {RuleID}", rule.Category, rule.RuleID);
                    break;
            }
        }

        private async Task<bool> ShouldRuleRunNowAsync(NotificationRule rule)
        {
            try
            {
                var pakistanNow = GetPakistanTime();
                
                if (rule.RuleType == "MANUAL" || rule.IsManualTrigger)
                    return false;
                
                if (rule.RuleType == "EVENT")
                {
                    if (rule.TimingType == "IMMEDIATE")
                    {
                        if (!rule.LastRunTime.HasValue)
                            return true;
                            
                        var minutesSinceLastRun = (pakistanNow - rule.LastRunTime.Value).TotalMinutes;
                        return minutesSinceLastRun >= 5;
                    }
                    
                    return true;
                }
                
                if (rule.RuleType == "CRON" || rule.RuleType == "SCHEDULED")
                {
                    return await CheckScheduleTimingAsync(rule, pakistanNow);
                }
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error checking if rule should run now");
                return false;
            }
        }

        private async Task<bool> CheckScheduleTimingAsync(NotificationRule rule, DateTime pakistanNow)
        {
            switch (rule.TimingType?.ToUpper())
            {
                case "IMMEDIATE":
                    return true;
                    
                case "FIXED_TIME":
                    if (!rule.FixedTime.HasValue) return false;
                    var scheduledTime = pakistanNow.Date.Add(rule.FixedTime.Value);
                    var timeDifference = Math.Abs((pakistanNow - scheduledTime).TotalMinutes);
                    return timeDifference <= 15;
                    
                case "DAYS_OFFSET":
                    if (!rule.DaysOffset.HasValue || !rule.LastRunTime.HasValue) return false;
                    var daysSinceLastRun = (pakistanNow.Date - rule.LastRunTime.Value.Date).Days;
                    return daysSinceLastRun >= rule.DaysOffset.Value;
                    
                case "CRON":
                    if (string.IsNullOrEmpty(rule.CronExpression)) return false;
                    return await CheckCronExpressionAsync(rule.CronExpression, pakistanNow);
                    
                case "DAILY":
                    if (!rule.LastRunTime.HasValue) return true;
                    return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 1;
                    
                case "WEEKLY":
                    if (!rule.LastRunTime.HasValue) return true;
                    return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 7;
                    
                case "BIWEEKLY":
                    if (!rule.LastRunTime.HasValue) return true;
                    return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 14;
                    
                case "MONTHLY":
                    if (!rule.LastRunTime.HasValue) return true;
                    return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 30;
                    
                case "WEEKDAY":
                    return pakistanNow.DayOfWeek != DayOfWeek.Saturday && pakistanNow.DayOfWeek != DayOfWeek.Sunday;
                    
                case "WEEKEND":
                    return pakistanNow.DayOfWeek == DayOfWeek.Saturday || pakistanNow.DayOfWeek == DayOfWeek.Sunday;
                    
                default:
                    return true;
            }
        }

        private async Task<bool> CheckCronExpressionAsync(string cronExpression, DateTime pakistanNow)
        {
            try
            {
                var utcNow = pakistanNow.ToUniversalTime();
                var parts = cronExpression.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                
                if (parts.Length != 5 && parts.Length != 6)
                {
                    _logger.LogError("❌ Invalid cron expression format: {Cron}", cronExpression);
                    return false;
                }
                
                var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;
                var parsedExpression = CronExpression.Parse(cronExpression, format);
                
                var nextOccurrence = parsedExpression.GetNextOccurrence(utcNow.AddMinutes(-5), inclusive: false);
                
                if (nextOccurrence.HasValue)
                {
                    var nextLocal = nextOccurrence.Value.ToLocalTime();
                    var timeDiff = Math.Abs((pakistanNow - nextLocal).TotalMinutes);
                    return timeDiff <= 5;
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error parsing cron expression: {Cron}", cronExpression);
                return false;
            }
        }

        private async Task ProcessRuleBasedOnCategory(NotificationRule rule)
        {
            switch (rule.Category?.ToUpper())
            {
                case "FEE":
                    await ProcessFeeRuleAsync(rule);
                    break;
                case "ATTENDANCE":
                    await ProcessAttendanceRuleAsync(rule);
                    break;
                case "EXAM":
                    await ProcessExamRuleAsync(rule);
                    break;
                case "HOMEWORK":
                case "ANNOUNCEMENT":
                case "GENERAL":
                case "ALERT":
                    await ProcessGenericRuleAsync(rule);
                    break;
                default:
                    _logger.LogWarning("⚠️ Unknown category '{Category}' for rule {RuleID}", rule.Category, rule.RuleID);
                    break;
            }
        }

        // ==================== GET TARGET USERS FOR RULE ====================

        /// <summary>
        /// Gets target users for a rule based on target type and filter
        /// Supports multiple sections with their own class IDs, specific students, and direct student selection
        /// </summary>
        private async Task<List<int>> GetTargetUsersForRuleAsync(NotificationRule rule)
        {
            var users = new List<int>();

            try
            {
                if (string.IsNullOrEmpty(rule.TargetType))
                {
                    return users;
                }

                switch (rule.TargetType.ToUpper())
                {
                    case "ALL":
                        users = await _context.tbl_User
                            .Where(u => u.Status == true)
                            .Select(u => u.ID)
                            .ToListAsync();
                        break;

                    case "PARENTS":
                        users = await _context.tbl_User
                            .Where(u => u.Status == true && u.RoleID == 4)
                            .Select(u => u.ID)
                            .ToListAsync();
                        break;

                    case "TEACHERS":
                        users = await _context.tbl_User
                            .Where(u => u.Status == true && u.RoleID == 3)
                            .Select(u => u.ID)
                            .ToListAsync();
                        break;

                    case "STUDENTS":
                        users = await _context.tbl_User
                            .Where(u => u.Status == true && u.RoleID == 4)
                            .Select(u => u.ID)
                            .ToListAsync();
                        break;

                    case "SECTION":
                        var sections = ParseSectionsFromTargetFilter(rule);
                        
                        if (sections.Any())
                        {
                            var allParentIds = new HashSet<int>();
                            
                            _logger.LogInformation("📋 Processing {Count} sections for rule {RuleID}", sections.Count, rule.RuleID);
                            
                            foreach (var section in sections)
                            {
                                _logger.LogInformation("🎯 Processing Section ID: {SectionID} (Class ID: {ClassID}) with {StudentCount} specific students", 
                                    section.SectionID, section.ClassID, section.StudentIDs.Count);
                                
                                var studentQuery = _context.tbl_StudentRegistration
                                    .Where(s => s.Section_ID == section.SectionID 
                                        && s.Class_ID == section.ClassID
                                        && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission"));
                                
                                if (section.StudentIDs.Any())
                                {
                                    studentQuery = studentQuery.Where(s => section.StudentIDs.Contains(s.Reg_Id));
                                    _logger.LogInformation("   📍 Filtering to {Count} specific students: {StudentIDs}", 
                                        section.StudentIDs.Count, string.Join(",", section.StudentIDs));
                                }
                                else
                                {
                                    _logger.LogInformation("   📍 No specific student filter - will include ALL students in this section");
                                }
                                
                                var familyCodes = await studentQuery
                                    .Where(s => s.Family_Code.HasValue)
                                    .Select(s => s.Family_Code.Value)
                                    .Distinct()
                                    .ToListAsync();
                                
                                _logger.LogInformation("   👨‍👩‍👧 Found {FamilyCount} family codes for Section {SectionID}", 
                                    familyCodes.Count, section.SectionID);
                                
                                if (familyCodes.Any())
                                {
                                    var parentIds = await _context.tbl_User
                                        .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
                                        .Select(u => u.ID)
                                        .ToListAsync();
                                    
                                    foreach (var pid in parentIds)
                                    {
                                        allParentIds.Add(pid);
                                    }
                                    
                                    _logger.LogInformation("   👨‍👩‍👧 Found {ParentCount} parents for Section {SectionID}", 
                                        parentIds.Count, section.SectionID);
                                }
                                else
                                {
                                    _logger.LogWarning("   ⚠️ No family codes found for Section {SectionID}", section.SectionID);
                                }
                            }
                            
                            users = allParentIds.ToList();
                            _logger.LogInformation("📊 Total unique parents from all sections: {TotalParents}", users.Count);
                        }
                        else
                        {
                            _logger.LogWarning("⚠️ No sections parsed from target filter for rule {RuleID}", rule.RuleID);
                        }
                        break;

                    case "CLASS":
                        var classIds = ParseClassFilter(rule);
                        if (classIds.Any())
                        {
                            var familyCodes = await _context.tbl_StudentRegistration
                                .Where(s => classIds.Contains(s.Class_ID ?? 0) 
                                    && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission")
                                    && s.Family_Code.HasValue)
                                .Select(s => s.Family_Code.Value)
                                .Distinct()
                                .ToListAsync();
                            
                            if (familyCodes.Any())
                            {
                                users = await _context.tbl_User
                                    .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
                                    .Select(u => u.ID)
                                    .ToListAsync();
                            }
                        }
                        break;

                    case "SPECIFIC_USERS":
                        var userIds = ParseSpecificUsers(rule);
                        if (userIds.Any())
                        {
                            users = await _context.tbl_User
                                .Where(u => userIds.Contains(u.ID) && u.Status == true)
                                .Select(u => u.ID)
                                .ToListAsync();
                        }
                        break;

                    // NEW: Handle direct student selection - send to parents of selected students
                    case "SPECIFIC_STUDENTS_DIRECT":
                        var specificStudentIds = ParseSpecificStudents(rule);
                        if (specificStudentIds.Any())
                        {
                            _logger.LogInformation("🎯 Processing SPECIFIC_STUDENTS_DIRECT with {Count} students: {StudentIds}", 
                                specificStudentIds.Count, string.Join(",", specificStudentIds));
                            
                            // Get family codes for these specific students
                            var familyCodes = await _context.tbl_StudentRegistration
                                .Where(s => specificStudentIds.Contains(s.Reg_Id) 
                                    && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission")
                                    && s.Family_Code.HasValue)
                                .Select(s => s.Family_Code.Value)
                                .Distinct()
                                .ToListAsync();
                            
                            _logger.LogInformation("👨‍👩‍👧 Found {FamilyCount} family codes for selected students", familyCodes.Count);
                            
                            if (familyCodes.Any())
                            {
                                // Get parent IDs from family codes
                                var parentIds = await _context.tbl_User
                                    .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
                                    .Select(u => u.ID)
                                    .ToListAsync();
                                
                                users = parentIds;
                                _logger.LogInformation("👥 Found {ParentCount} parents for the selected students", parentIds.Count);
                            }
                            else
                            {
                                _logger.LogWarning("⚠️ No family codes found for selected students: {StudentIds}", 
                                    string.Join(",", specificStudentIds));
                            }
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in GetTargetUsersForRuleAsync for rule {RuleID}", rule.RuleID);
            }

            return users;
        }

        // ==================== PARSING HELPER METHODS ====================

        private class SectionTarget
        {
            public int SectionID { get; set; }
            public int ClassID { get; set; }
            public List<int> StudentIDs { get; set; } = new List<int>();
        }

        private List<SectionTarget> ParseSectionsFromTargetFilter(NotificationRule rule)
        {
            var sections = new List<SectionTarget>();
            
            try
            {
                if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
                {
                    var filter = JObject.Parse(rule.TargetFilter);
                    
                    if (filter["Sections"] is JArray sectionsArray)
                    {
                        foreach (var section in sectionsArray)
                        {
                            var sectionId = section["SectionID"]?.Value<int>();
                            var classId = section["ClassID"]?.Value<int>();
                            var studentIds = section["StudentID"]?.Value<JArray>()
                                ?.Select(x => x.Value<int>()).ToList() ?? new List<int>();
                            
                            if (sectionId.HasValue && classId.HasValue)
                            {
                                sections.Add(new SectionTarget
                                {
                                    SectionID = sectionId.Value,
                                    ClassID = classId.Value,
                                    StudentIDs = studentIds
                                });
                                
                                _logger.LogDebug("📚 Parsed section: SectionID={SectionID}, ClassID={ClassID}, Students={StudentCount}", 
                                    sectionId.Value, classId.Value, studentIds.Count);
                            }
                        }
                    }
                    else if (filter["SectionID"] != null)
                    {
                        var sectionId = filter["SectionID"]?.Value<int>();
                        var studentIds = filter["StudentID"]?.Value<JArray>()
                            ?.Select(x => x.Value<int>()).ToList() ?? new List<int>();
                        
                        if (sectionId.HasValue)
                        {
                            var section = _context.tbl_AddSection
                                .FirstOrDefault(s => s.ID == sectionId.Value);
                            
                            sections.Add(new SectionTarget
                            {
                                SectionID = sectionId.Value,
                                ClassID = section?.Class_ID ?? 0,
                                StudentIDs = studentIds
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error parsing sections from target filter for rule {RuleID}", rule.RuleID);
            }
            
            return sections;
        }

        private List<int> ParseClassFilter(NotificationRule rule)
        {
            var classIds = new List<int>();
            
            try
            {
                if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
                {
                    var filter = JObject.Parse(rule.TargetFilter);
                    
                    if (filter["ClassID"] is JArray classArray)
                    {
                        classIds = classArray.Select(x => x.Value<int>()).ToList();
                    }
                    else if (filter["ClassID"] != null)
                    {
                        classIds.Add(filter["ClassID"].Value<int>());
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error parsing class filter for rule {RuleID}", rule.RuleID);
            }
            
            return classIds;
        }

        private List<int> ParseSpecificUsers(NotificationRule rule)
        {
            var userIds = new List<int>();
            
            try
            {
                if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
                {
                    var filter = JObject.Parse(rule.TargetFilter);
                    
                    if (filter["UserID"] is JArray userArray)
                    {
                        userIds = userArray.Select(x => x.Value<int>()).ToList();
                    }
                    else if (filter["UserID"] != null)
                    {
                        userIds.Add(filter["UserID"].Value<int>());
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error parsing user filter for rule {RuleID}", rule.RuleID);
            }
            
            return userIds;
        }

        /// <summary>
        /// Parses specific student IDs from target filter for SPECIFIC_STUDENTS_DIRECT
        /// </summary>
        private List<int> ParseSpecificStudents(NotificationRule rule)
        {
            var studentIds = new List<int>();
            
            try
            {
                if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
                {
                    var filter = JObject.Parse(rule.TargetFilter);
                    
                    if (filter["Students"] is JArray studentArray)
                    {
                        studentIds = studentArray.Select(x => x.Value<int>()).ToList();
                        _logger.LogDebug("📚 Parsed {Count} specific students from Students array: {StudentIds}", 
                            studentIds.Count, string.Join(",", studentIds));
                    }
                    else if (filter["StudentID"] is JArray studentIdArray)
                    {
                        studentIds = studentIdArray.Select(x => x.Value<int>()).ToList();
                    }
                    else if (filter["StudentID"] != null)
                    {
                        studentIds.Add(filter["StudentID"].Value<int>());
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error parsing specific students filter for rule {RuleID}", rule.RuleID);
            }
            
            return studentIds;
        }

        // ==================== PROCESS RULES ====================

        private async Task ProcessFeeRuleAsync(NotificationRule rule)
        {
            try
            {
                _logger.LogInformation("💰 Processing fee rule {RuleID} - {RuleName}", rule.RuleID, rule.RuleName);

                var ruleSettings = ParseRuleSettings(rule);
                
                var intervalDays = Convert.ToInt32(ruleSettings.GetValueOrDefault("intervalDays", 3));
                var minAmount = Convert.ToInt32(ruleSettings.GetValueOrDefault("minAmount", 0));
                var maxDaysOverdue = Convert.ToInt32(ruleSettings.GetValueOrDefault("maxDaysOverdue", 90));
                var minDaysOverdue = Convert.ToInt32(ruleSettings.GetValueOrDefault("minDaysOverdue", 0));
                var excludePartial = Convert.ToBoolean(ruleSettings.GetValueOrDefault("excludePartialPayments", false));
                
                var classFilter = ruleSettings.ContainsKey("classes") ? 
                    ruleSettings["classes"] as List<int> : null;

                if (rule.LastRunTime.HasValue)
                {
                    var daysSinceLastRun = (GetPakistanTime() - rule.LastRunTime.Value).TotalDays;
                    if (daysSinceLastRun < intervalDays)
                    {
                        _logger.LogInformation("⏸️ Fee rule {RuleID} ran {Days} days ago, interval is {Interval} days", 
                            rule.RuleID, (int)daysSinceLastRun, intervalDays);
                        return;
                    }
                }

                var feeDueStudents = await GetFeeDueStudentsAsync(rule.RuleID, intervalDays, minAmount, 
                    maxDaysOverdue, minDaysOverdue, excludePartial, classFilter);

                _logger.LogInformation("📋 Found {Count} fee due students for rule {RuleID}", 
                    feeDueStudents.Count, rule.RuleID);

                if (feeDueStudents.Count == 0)
                {
                    _logger.LogInformation("📭 No fee due students found for rule {RuleID}", rule.RuleID);
                    await UpdateRuleStatisticsAsync(rule);
                    return;
                }

                Guid? batchId = null;
                if (rule.IsBatch)
                {
                    batchId = await CreateBatchNotificationAsync(rule, feeDueStudents.Count);
                }

                int notificationCount = 0;
                foreach (var student in feeDueStudents)
                {
                    try
                    {
                        var notificationCreated = await CreateFeeNotificationForStudentAsync(rule, student, intervalDays, batchId);
                        if (notificationCreated)
                            notificationCount++;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error creating fee notification for student {StudentID}", 
                            student.StudentID);
                    }
                }

                if (batchId.HasValue && rule.IsBatch)
                {
                    await UpdateBatchNotificationAsync(batchId.Value, notificationCount);
                }

                await UpdateRuleStatisticsAsync(rule);
                
                _logger.LogInformation("🎉 Fee rule {RuleID} processed successfully. Created {Count} notifications", 
                    rule.RuleID, notificationCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in ProcessFeeRuleAsync for rule {RuleID}", rule.RuleID);
            }
        }

        private async Task<Guid> CreateBatchNotificationAsync(NotificationRule rule, int totalRecipients)
        {
            var batchId = Guid.NewGuid();
            
            var batchNotification = new BatchNotification
            {
                BatchID = batchId,
                RuleID = rule.RuleID,
                Title = rule.TitleTemplate,
                Message = rule.MessageTemplate,
                TargetType = rule.TargetType ?? "ALL",
                TargetFilter = rule.TargetFilter,
                TotalRecipients = totalRecipients,
                Status = "PROCESSING",
                CreatedTime = GetPakistanTime()
            };

            _context.BatchNotifications.Add(batchNotification);
            await _context.SaveChangesAsync();

            _logger.LogInformation("📦 Created batch notification {BatchID} for rule {RuleID} with {Count} recipients", 
                batchId, rule.RuleID, totalRecipients);

            return batchId;
        }

        private async Task UpdateBatchNotificationAsync(Guid batchId, int sentCount)
        {
            var batchNotification = await _context.BatchNotifications
                .FirstOrDefaultAsync(b => b.BatchID == batchId);

            if (batchNotification != null)
            {
                batchNotification.SentCount = sentCount;
                batchNotification.FailedCount = batchNotification.TotalRecipients - sentCount;
                batchNotification.Status = sentCount > 0 ? "COMPLETED" : "FAILED";
                batchNotification.CompletedTime = GetPakistanTime();

                await _context.SaveChangesAsync();

                _logger.LogInformation("📊 Updated batch notification {BatchID}: Sent={Sent}, Failed={Failed}", 
                    batchId, sentCount, batchNotification.FailedCount);
            }
        }

        private async Task<List<FeeDueStudent>> GetFeeDueStudentsAsync(int ruleId, int intervalDays, 
            int minAmount, int maxDaysOverdue, int minDaysOverdue, bool excludePartial, List<int>? classFilter)
        {
            var students = new List<FeeDueStudent>();
            
            try
            {
                var sql = @"
                    SELECT DISTINCT 
                        fp.ID as FeePostingID,
                        fp.Reg_ID as StudentID,
                        s.Frist_Name as StudentName,
                        s.RollNo as RollNumber,
                        s.Class_ID as ClassID,
                        s.Section_ID as SectionID,
                        u.ID as ParentID,
                        u.Name as ParentName,
                        u.Mobile_No as ParentMobile,
                        fp.Amount as DueAmount,
                        fp.Fine as LateFee,
                        fp.FeeMonth,
                        fp.FeeYear,
                        fp.IssueDate,
                        fp.DueDate,
                        DATEDIFF(day, fp.DueDate, GETDATE()) as DaysOverdue,
                        fp.ChallanNo,
                        c.Class_Name as ClassName,
                        sec.Section as SectionName,
                        d.FCMToken,
                        ISNULL(fp.Amount, 0) - ISNULL((
                            SELECT SUM(frd.Received) 
                            FROM tbl_FeeReceiveDetail frd
                            INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
                            WHERE frd.Challan_No = fp.ChallanNo 
                                AND frm.RegID = fp.Reg_ID
                        ), 0) as RemainingAmount,
                        CASE WHEN EXISTS (
                            SELECT 1 FROM tbl_FeeReceiveDetail frd
                            INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
                            WHERE frd.Challan_No = fp.ChallanNo 
                                AND frm.RegID = fp.Reg_ID
                                AND frd.Received > 0
                        ) THEN 1 ELSE 0 END as HasPartialPayment
                    FROM tbl_FeePosting fp
                    INNER JOIN tbl_StudentRegistration s ON fp.Reg_ID = s.Reg_Id
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
                    LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
                    LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
                    WHERE fp.Type = 'POSTED'
                        AND fp.DueDate <= CAST(GETDATE() AS DATE)
                        AND u.Status = 1
                        AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active', 'Addmission'))
                        AND fp.Amount >= @minAmount
                        AND DATEDIFF(day, fp.DueDate, GETDATE()) BETWEEN @minDaysOverdue AND @maxDaysOverdue";

                if (classFilter != null && classFilter.Any())
                {
                    sql += $" AND s.Class_ID IN ({string.Join(",", classFilter)})";
                }

                if (excludePartial)
                {
                    sql += " AND NOT EXISTS (" +
                           "    SELECT 1 FROM tbl_FeeReceiveDetail frd" +
                           "    INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID" +
                           "    WHERE frd.Challan_No = fp.ChallanNo" +
                           "        AND frm.RegID = fp.Reg_ID" +
                           "        AND frd.Received > 0" +
                           ")";
                }

                sql += @"
                    HAVING ISNULL(fp.Amount, 0) > ISNULL((
                        SELECT SUM(frd.Received) 
                        FROM tbl_FeeReceiveDetail frd
                        INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
                        WHERE frd.Challan_No = fp.ChallanNo 
                            AND frm.RegID = fp.Reg_ID
                    ), 0)
                    AND NOT EXISTS (
                        SELECT 1 FROM NotificationQueue nq
                        WHERE nq.RuleID = @ruleId
                            AND nq.UserID = u.ID
                            AND nq.CreatedTime >= DATEADD(day, -@intervalDays, CAST(GETDATE() AS DATE))
                            AND nq.Status IN ('SENT', 'READ', 'PENDING', 'PROCESSING')
                    )
                    ORDER BY fp.DueDate ASC, DaysOverdue DESC";

                var parameters = new[]
                {
                    new SqlParameter("@ruleId", ruleId),
                    new SqlParameter("@intervalDays", intervalDays),
                    new SqlParameter("@minAmount", minAmount),
                    new SqlParameter("@maxDaysOverdue", maxDaysOverdue),
                    new SqlParameter("@minDaysOverdue", minDaysOverdue)
                };

                students = await _context.Database.SqlQueryRaw<FeeDueStudent>(sql, parameters).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting fee due students");
            }

            return students;
        }

        private async Task<bool> CreateFeeNotificationForStudentAsync(NotificationRule rule, 
            FeeDueStudent student, int intervalDays, Guid? batchId = null)
        {
            try
            {
                if (string.IsNullOrEmpty(student.FCMToken))
                {
                    _logger.LogWarning("⚠️ No FCM token for parent {ParentID} of student {StudentName}", 
                        student.ParentID, student.StudentName);
                    return false;
                }

                var pakistanNow = GetPakistanTime();

                var data = new Dictionary<string, object>
                {
                    ["StudentID"] = student.StudentID,
                    ["StudentName"] = student.StudentName ?? "Student",
                    ["ParentName"] = student.ParentName ?? "Parent",
                    ["ParentMobile"] = student.ParentMobile ?? "",
                    ["RollNumber"] = student.RollNumber?.ToString() ?? "N/A",
                    ["ClassName"] = student.ClassName ?? "",
                    ["SectionName"] = student.SectionName ?? "",
                    ["DueAmount"] = student.DueAmount?.ToString("N0") ?? "0",
                    ["RemainingAmount"] = student.RemainingAmount?.ToString("N0") ?? "0",
                    ["LateFee"] = student.LateFee?.ToString("N0") ?? "0",
                    ["TotalDue"] = (student.RemainingAmount + student.LateFee)?.ToString("N0") ?? "0",
                    ["OriginalAmount"] = student.DueAmount ?? 0,
                    ["FeeMonth"] = student.FeeMonth ?? pakistanNow.ToString("MMMM"),
                    ["FeeYear"] = student.FeeYear ?? pakistanNow.Year.ToString(),
                    ["IssueDate"] = student.IssueDate?.ToString("dd/MM/yyyy") ?? pakistanNow.ToString("dd/MM/yyyy"),
                    ["DueDate"] = student.DueDate?.ToString("dd/MM/yyyy") ?? pakistanNow.ToString("dd/MM/yyyy"),
                    ["DaysOverdue"] = student.DaysOverdue ?? 0,
                    ["CurrentDate"] = pakistanNow.ToString("dd/MM/yyyy"),
                    ["ChallanNo"] = student.ChallanNo ?? "",
                    ["RuleInterval"] = intervalDays,
                    ["NextReminder"] = pakistanNow.AddDays(intervalDays).ToString("dd/MM/yyyy"),
                    ["HasPartialPayment"] = student.HasPartialPayment == 1,
                    ["FeePostingID"] = student.FeePostingID,
                    ["ClassID"] = student.ClassID ?? 0,
                    ["SectionID"] = student.SectionID ?? 0
                };

                var title = ParseTemplate(rule.TitleTemplate ?? "Fee Payment Reminder", data);
                var message = ParseTemplate(rule.MessageTemplate ?? "{StudentName} has pending fee", data);
                
                string dataPayload;
                if (!string.IsNullOrEmpty(rule.DataTemplate))
                {
                    dataPayload = ParseTemplate(rule.DataTemplate, data);
                }
                else
                {
                    dataPayload = JsonConvert.SerializeObject(new
                    {
                        action = "view_fee_details",
                        studentId = student.StudentID,
                        challanNo = student.ChallanNo,
                        feePostingId = student.FeePostingID,
                        amount = student.RemainingAmount,
                        dueDate = student.DueDate?.ToString("yyyy-MM-dd"),
                        daysOverdue = student.DaysOverdue,
                        batchId = batchId
                    });
                }

                var notification = new NotificationQueue
                {
                    RuleID = rule.RuleID,
                    UserID = student.ParentID,
                    UserType = "PARENT",
                    DeviceToken = student.FCMToken,
                    Title = title,
                    Message = message,
                    DataPayload = dataPayload,
                    Status = "PENDING",
                    Priority = rule.Priority,
                    ScheduledTime = pakistanNow,
                    CreatedTime = pakistanNow,
                    ExpiryTime = pakistanNow.AddDays(14),
                    AttemptCount = 0,
                    LastAttemptTime = null,
                    ErrorMessage = null
                };

                _context.NotificationQueue.Add(notification);
                
                var log = new NotificationLog
                {
                    QueueID = notification.QueueID > 0 ? (long?)notification.QueueID : null,
                    UserID = student.ParentID,
                    Action = "FEE_REMINDER_CREATED",
                    Timestamp = pakistanNow,
                    Details = $"Fee reminder for {student.StudentName}, " +
                             $"Challan: {student.ChallanNo}, " +
                             $"Amount: {student.RemainingAmount}, " +
                             $"Overdue: {student.DaysOverdue} days, " +
                             $"BatchID: {(batchId.HasValue ? batchId.Value.ToString() : "N/A")}"
                };
                _context.NotificationLogs.Add(log);

                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Created fee notification {QueueID} for student {StudentName}, " +
                    "parent {ParentID}, Amount: {Amount}, Overdue: {Days} days, Batch: {BatchId}", 
                    notification.QueueID, student.StudentName, student.ParentID, 
                    student.RemainingAmount, student.DaysOverdue, 
                    batchId.HasValue ? batchId.Value.ToString() : "N/A");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating fee notification for student {StudentID}", 
                    student.StudentID);
                return false;
            }
        }

        private async Task ProcessAttendanceRuleAsync(NotificationRule rule)
        {
            try
            {
                _logger.LogInformation("📊 Checking attendance rule {RuleID} - {RuleName}", rule.RuleID, rule.RuleName);

                var pakistanNow = GetPakistanTime();
                var today = pakistanNow.Date;
                
                _logger.LogInformation("📅 Looking for absent students on: {Today}", today.ToString("yyyy-MM-dd"));
                
                if (rule.TimingType == "IMMEDIATE" && rule.LastRunTime.HasValue)
                {
                    var minutesSinceLastRun = (pakistanNow - rule.LastRunTime.Value).TotalMinutes;
                    if (minutesSinceLastRun < 5)
                    {
                        _logger.LogInformation("⏸️ Attendance rule {RuleID} ran {Minutes} minutes ago, skipping to avoid duplicates", 
                            rule.RuleID, (int)minutesSinceLastRun);
                        return;
                    }
                }
                
                var sql = @"
                    SELECT DISTINCT 
                        s.Reg_Id as StudentID,
                        u.ID as ParentID,
                        s.Frist_Name as StudentName,
                        s.RollNo as RollNumber,
                        m.AttDate as AbsentDate,
                        a.Status as StatusValue,
                        a.Remarks as StudentRemarks
                    FROM tbl_StudentRegistration s
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_StudentAttDetail a ON s.Reg_Id = a.RegID
                    INNER JOIN tbl_StudentAttMaster m ON a.MasterId = m.ID
                    WHERE (
                        UPPER(a.Status) = 'A' OR 
                        UPPER(a.Status) = 'ABSENT' OR
                        a.Status LIKE '%Absent%'
                    )
                    AND CAST(m.AttDate AS DATE) = @todayDate
                    AND u.Status = 1
                    AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))";
                
                var absentStudents = await _context.Database.SqlQueryRaw<AttendanceRecord>(
                    sql,
                    new SqlParameter("@todayDate", today)
                ).ToListAsync();

                _logger.LogInformation("👥 Found {Count} absent students for rule {RuleID} on {Date}", 
                    absentStudents?.Count ?? 0, rule.RuleID, today.ToString("yyyy-MM-dd"));

                if (absentStudents == null || absentStudents.Count == 0)
                {
                    _logger.LogInformation("📭 No absent students found for rule {RuleID} today", rule.RuleID);
                    await UpdateRuleStatisticsAsync(rule);
                    return;
                }

                var existingParentIds = new HashSet<int>();
                if (rule.TimingType == "IMMEDIATE")
                {
                    existingParentIds = new HashSet<int>(await _context.NotificationQueue
                        .Where(n => n.RuleID == rule.RuleID && n.CreatedTime.Date == today)
                        .Select(n => n.UserID)
                        .Distinct()
                        .ToListAsync());
                    
                    _logger.LogInformation("📋 Found {Count} parents already notified today", existingParentIds.Count);
                }

                Guid? batchId = null;
                if (rule.IsBatch)
                {
                    var parents = absentStudents.Select(s => s.ParentID).Distinct().Count();
                    batchId = await CreateBatchNotificationAsync(rule, parents);
                }

                var studentsByParent = absentStudents
                    .GroupBy(s => s.ParentID)
                    .ToList();

                int notificationCount = 0;
                foreach (var parentGroup in studentsByParent)
                {
                    var parentId = parentGroup.Key;
                    
                    if (existingParentIds.Contains(parentId))
                    {
                        _logger.LogInformation("⏸️ Skipping parent {ParentID} - already notified today", parentId);
                        continue;
                    }
                    
                    var parentStudents = parentGroup.ToList();
                    
                    try
                    {
                        if (parentStudents.Count > 0)
                        {
                            await CreateAttendanceNotificationForParentAsync(rule, parentId, parentStudents, today, batchId);
                            notificationCount++;
                            
                            _logger.LogInformation("✅ Created attendance notification for parent {ParentID} with {Count} absent students", 
                                parentId, parentStudents.Count);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error processing attendance for parent {ParentID}", parentId);
                    }
                }

                if (batchId.HasValue && rule.IsBatch)
                {
                    await UpdateBatchNotificationAsync(batchId.Value, notificationCount);
                }

                await UpdateRuleStatisticsAsync(rule);
                
                _logger.LogInformation("🎉 Attendance rule {RuleID} processed successfully. Created {Count} notifications", 
                    rule.RuleID, notificationCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in ProcessAttendanceRuleAsync for rule {RuleID}", rule.RuleID);
            }
        }

        private async Task CreateAttendanceNotificationForParentAsync(
            NotificationRule rule, 
            int parentId, 
            List<AttendanceRecord> parentStudents,
            DateTime today,
            Guid? batchId = null)
        {
            try
            {
                var device = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == parentId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                
                string? fcmToken = device?.FCMToken;

                if (string.IsNullOrEmpty(fcmToken))
                {
                    _logger.LogWarning("⚠️ No FCM token found for parent {ParentID}, skipping notification", parentId);
                    return;
                }

                var parent = await _context.tbl_User
                    .Where(u => u.ID == parentId)
                    .Select(u => u.Name)
                    .FirstOrDefaultAsync();

                var studentNames = string.Join(", ", parentStudents.Select(s => s.StudentName ?? ""));
                var rollNumbers = string.Join(", ", parentStudents.Select(s => s.RollNumber?.ToString() ?? "N/A"));
                
                var data = new Dictionary<string, object>
                {
                    ["StudentID"] = parentStudents.First().StudentID,
                    ["StudentName"] = studentNames,
                    ["StudentCount"] = parentStudents.Count,
                    ["RollNumber"] = rollNumbers,
                    ["AbsentDate"] = today.ToString("dd/MM/yyyy"),
                    ["Date"] = today.ToString("dd/MM/yyyy"),
                    ["Status"] = "Absent",
                    ["Remarks"] = parentStudents.First().StudentRemarks ?? "",
                    ["MultipleStudents"] = parentStudents.Count > 1,
                    ["ParentName"] = parent ?? "Parent",
                    ["AllAbsentStudents"] = parentStudents.Select(s => new 
                    {
                        StudentID = s.StudentID,
                        Name = s.StudentName,
                        RollNumber = s.RollNumber,
                        Remarks = s.StudentRemarks,
                        Status = s.StatusValue
                    }).ToList(),
                    ["BatchId"] = batchId
                };

                var pakistanNow = GetPakistanTime();
                var title = ParseTemplate(rule.TitleTemplate ?? "Attendance Alert: {StudentName}", data);
                var message = ParseTemplate(rule.MessageTemplate ?? "{StudentName} ({StudentCount} students) were Absent on {Date}", data);

                var notification = new NotificationQueue
                {
                    RuleID = rule.RuleID,
                    UserID = parentId,
                    UserType = "PARENT",
                    Title = title,
                    Message = message,
                    Status = "PENDING",
                    Priority = rule.Priority,
                    ScheduledTime = pakistanNow,
                    CreatedTime = pakistanNow,
                    ExpiryTime = pakistanNow.AddDays(7),
                    DataPayload = JsonConvert.SerializeObject(data),
                    DeviceToken = fcmToken,
                    AttemptCount = 0,
                    LastAttemptTime = null,
                    ErrorMessage = null
                };

                _context.NotificationQueue.Add(notification);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Created attendance notification {QueueID} for parent {ParentID} with {Count} students", 
                    notification.QueueID, parentId, parentStudents.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parentId);
            }
        }

        private async Task ProcessExamRuleAsync(NotificationRule rule)
        {
            try
            {
                _logger.LogInformation("📚 Processing exam rule {RuleID} - {RuleName}", rule.RuleID, rule.RuleName);
                
                var pakistanNow = GetPakistanTime();
                
                if (rule.TimingType == "IMMEDIATE" && rule.LastRunTime.HasValue)
                {
                    var minutesSinceLastRun = (pakistanNow - rule.LastRunTime.Value).TotalMinutes;
                    if (minutesSinceLastRun < 60)
                    {
                        _logger.LogInformation("⏸️ Exam rule {RuleID} ran {Minutes} minutes ago, skipping", 
                            rule.RuleID, (int)minutesSinceLastRun);
                        return;
                    }
                }

                var sql = @"
                    SELECT DISTINCT 
                        s.Reg_Id as StudentID,
                        u.ID as ParentID,
                        s.Frist_Name as StudentName,
                        e.ExamTitle,
                        e.ExamDate,
                        e.Subject
                    FROM tbl_StudentRegistration s
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_Exams e ON s.Class_ID = e.ClassID
                    WHERE CAST(e.ExamDate AS DATE) >= CAST(GETDATE() AS DATE)
                        AND CAST(e.ExamDate AS DATE) <= DATEADD(DAY, 7, CAST(GETDATE() AS DATE))
                        AND u.Status = 1
                        AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))";
                
                var examStudents = await _context.Database.SqlQueryRaw<ExamRecord>(sql).ToListAsync();

                _logger.LogInformation("📋 Found {Count} students with upcoming exams for rule {RuleID}", examStudents?.Count ?? 0, rule.RuleID);

                if (examStudents == null || examStudents.Count == 0)
                {
                    _logger.LogInformation("📭 No upcoming exams found for rule {RuleID}", rule.RuleID);
                    await UpdateRuleStatisticsAsync(rule);
                    return;
                }

                Guid? batchId = null;
                if (rule.IsBatch)
                {
                    batchId = await CreateBatchNotificationAsync(rule, examStudents.Count);
                }

                int notificationCount = 0;
                foreach (var student in examStudents)
                {
                    try
                    {
                        var data = new Dictionary<string, object>
                        {
                            ["StudentID"] = student.StudentID,
                            ["StudentName"] = student.StudentName ?? "Student",
                            ["ExamTitle"] = student.ExamTitle ?? "Exam",
                            ["ExamDate"] = student.ExamDate.HasValue 
                                ? student.ExamDate.Value.ToString("dd/MM/yyyy") 
                                : pakistanNow.AddDays(7).ToString("dd/MM/yyyy"),
                            ["Subject"] = student.Subject ?? "Subject"
                        };

                        if (student.ParentID > 0)
                        {
                            await CreateNotificationForParentAsync(rule, student.ParentID, data, batchId);
                            notificationCount++;
                            
                            _logger.LogInformation("✅ Created exam notification for student {StudentName}, parent {ParentID}", 
                                student.StudentName, student.ParentID);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error creating exam notification for student {StudentID}", student.StudentID);
                    }
                }

                if (batchId.HasValue && rule.IsBatch)
                {
                    await UpdateBatchNotificationAsync(batchId.Value, notificationCount);
                }

                await UpdateRuleStatisticsAsync(rule);
                
                _logger.LogInformation("🎉 Exam rule {RuleID} processed successfully. Created {Count} notifications", 
                    rule.RuleID, notificationCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in ProcessExamRuleAsync for rule {RuleID}", rule.RuleID);
            }
        }

        private async Task ProcessGenericRuleAsync(NotificationRule rule)
        {
            try
            {
                _logger.LogInformation("⚡ Processing generic rule: {RuleName} (ID: {RuleID}, TargetType: {TargetType})", 
                    rule.RuleName, rule.RuleID, rule.TargetType);
                
                var pakistanNow = GetPakistanTime();
                
                if (rule.TimingType == "IMMEDIATE" && rule.LastRunTime.HasValue)
                {
                    var minutesSinceLastRun = (pakistanNow - rule.LastRunTime.Value).TotalMinutes;
                    if (minutesSinceLastRun < 5)
                    {
                        _logger.LogInformation("⏸️ Immediate rule {RuleID} ran {Minutes} minutes ago, skipping", 
                            rule.RuleID, (int)minutesSinceLastRun);
                        return;
                    }
                }
                
                _logger.LogInformation("📋 Rule {RuleID} TargetFilter: {TargetFilter}", rule.RuleID, rule.TargetFilter);
                
                if (rule.TargetType?.ToUpper() == "SECTION")
                {
                    var sections = ParseSectionsFromTargetFilter(rule);
                    foreach (var section in sections)
                    {
                        _logger.LogInformation("📚 Rule {RuleID} targeting Section ID: {SectionID} (Class ID: {ClassID}) with {StudentCount} specific students", 
                            rule.RuleID, section.SectionID, section.ClassID, section.StudentIDs.Count);
                    }
                }
                
                var targetUsers = await GetTargetUsersForRuleAsync(rule);
                
                _logger.LogInformation("👥 Found {Count} target users for rule {RuleID}", targetUsers.Count, rule.RuleID);

                var today = pakistanNow.Date;
                var existingUserIds = new HashSet<int>();
                if (rule.TimingType == "IMMEDIATE")
                {
                    existingUserIds = new HashSet<int>(await _context.NotificationQueue
                        .Where(n => n.RuleID == rule.RuleID && n.CreatedTime.Date == today)
                        .Select(n => n.UserID)
                        .Distinct()
                        .ToListAsync());
                    
                    _logger.LogInformation("📋 Found {Count} existing notifications for today, will skip those users", 
                        existingUserIds.Count);
                }

                Guid? batchId = null;
                if (rule.IsBatch)
                {
                    batchId = await CreateBatchNotificationAsync(rule, targetUsers.Count);
                }

                int notificationCount = 0;
                foreach (var userId in targetUsers)
                {
                    try
                    {
                        if (existingUserIds.Contains(userId))
                        {
                            _logger.LogInformation("⏸️ Skipping user {UserID} - already notified today", userId);
                            continue;
                        }

                        var data = new Dictionary<string, object>
                        {
                            ["RuleName"] = rule.RuleName,
                            ["Category"] = rule.Category,
                            ["Date"] = pakistanNow.ToString("dd/MM/yyyy"),
                            ["Time"] = pakistanNow.ToString("hh:mm tt")
                        };

                        if (rule.TargetType?.ToUpper() == "SECTION")
                        {
                            var sections = ParseSectionsFromTargetFilter(rule);
                            if (sections.Any())
                            {
                                data["SectionInfo"] = sections.Select(s => new { s.SectionID, s.ClassID }).ToList();
                                data["TotalSections"] = sections.Count;
                            }
                        }

                        switch (rule.Category?.ToUpper())
                        {
                            case "ANNOUNCEMENT":
                                data["EffectiveDate"] = pakistanNow.AddDays(7).ToString("dd MMM yyyy");
                                data["NewStartTime"] = "08:30 AM";
                                data["NewEndTime"] = "02:30 PM";
                                data["AssemblyTime"] = "08:15 AM";
                                data["ReasonForChange"] = "improve academic schedule";
                                data["HolidayDate"] = pakistanNow.AddDays(7).ToString("dd/MM/yyyy");
                                data["HolidayReason"] = "Public Holiday";
                                break;
                            case "ALERT":
                                data["AlertLevel"] = "High";
                                data["Instructions"] = "Please follow safety guidelines";
                                data["Reason"] = "Emergency";
                                data["ClosureDate"] = pakistanNow.ToString("dd/MM/yyyy");
                                data["ResumptionDate"] = pakistanNow.AddDays(1).ToString("dd/MM/yyyy");
                                break;
                        }

                        await CreateNotificationForParentAsync(rule, userId, data, batchId);
                        notificationCount++;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error creating notification for user {UserID} in rule {RuleID}", userId, rule.RuleID);
                    }
                }

                if (batchId.HasValue && rule.IsBatch)
                {
                    await UpdateBatchNotificationAsync(batchId.Value, notificationCount);
                }

                await UpdateRuleStatisticsAsync(rule);
                
                _logger.LogInformation("🎉 Generic rule {RuleID} processed successfully. Created {Count} notifications", 
                    rule.RuleID, notificationCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in ProcessGenericRuleAsync for rule {RuleID}", rule.RuleID);
            }
        }

      private async Task CreateNotificationForParentAsync(NotificationRule rule, int userId, Dictionary<string, object> data, Guid? batchId = null)
{
    try
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserID == userId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
        
        string? fcmToken = device?.FCMToken;

        if (string.IsNullOrEmpty(fcmToken))
        {
            _logger.LogWarning("⚠️ No FCM token found for user {UserID}, skipping notification", userId);
            return;
        }

        var user = await _context.tbl_User
            .Where(u => u.ID == userId)
            .Select(u => u.Name)
            .FirstOrDefaultAsync();
        
        data["ParentName"] = user ?? "User";

        if (batchId.HasValue)
        {
            data["BatchId"] = batchId.Value;
        }

        var pakistanNow = GetPakistanTime();
        
        var titleHtml = ParseTemplate(rule.TitleTemplate ?? "", data);
        var messageHtml = ParseTemplate(rule.MessageTemplate ?? "", data);
        
        var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
        var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
        
        if (string.IsNullOrEmpty(titlePlain)) titlePlain = "School Notification";
        if (string.IsNullOrEmpty(messagePlain)) messagePlain = "You have a new notification";

        var notificationData = new Dictionary<string, object>();
        foreach (var kvp in data)
        {
            notificationData[kvp.Key] = kvp.Value;
        }
        notificationData["titleHtml"] = titleHtml;
        notificationData["messageHtml"] = messageHtml;
        notificationData["isHtml"] = true;

        var notification = new NotificationQueue
        {
            RuleID = rule.RuleID,
            UserID = userId,
            UserType = GetUserTypeFromTarget(rule.TargetType),
            Title = titlePlain,
            Message = messagePlain,
            Status = "PENDING",
            Priority = rule.Priority,
            ScheduledTime = pakistanNow,
            CreatedTime = pakistanNow,
            ExpiryTime = pakistanNow.AddDays(7),
            DataPayload = JsonConvert.SerializeObject(notificationData),
            DeviceToken = fcmToken,
            AttemptCount = 0,
            LastAttemptTime = null,
            ErrorMessage = null
        };

        _context.NotificationQueue.Add(notification);
        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Created notification {QueueID} for user {UserID}", notification.QueueID, userId);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "❌ Error creating notification for user {UserID}", userId);
    }
}

        private string GetUserTypeFromTarget(string targetType)
        {
            return targetType?.ToUpper() switch
            {
                "PARENTS" => "PARENT",
                "TEACHERS" => "TEACHER",
                "STUDENTS" => "STUDENT",
                _ => "USER"
            };
        }

        private Dictionary<string, object> ParseRuleSettings(NotificationRule rule)
        {
            var settings = new Dictionary<string, object>();
            
            try
            {
                if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
                {
                    var filter = JObject.Parse(rule.TargetFilter);
                    
                    foreach (var property in filter.Properties())
                    {
                        if (property.Name == "Sections")
                        {
                            settings[property.Name] = property.Value;
                        }
                        else if (property.Value.Type == JTokenType.Integer)
                        {
                            settings[property.Name] = property.Value.Value<int>();
                        }
                        else if (property.Value.Type == JTokenType.Boolean)
                        {
                            settings[property.Name] = property.Value.Value<bool>();
                        }
                        else if (property.Value.Type == JTokenType.Array)
                        {
                            var list = property.Value.ToObject<List<int>>();
                            settings[property.Name] = list ?? new List<int>();
                        }
                        else if (property.Value.Type == JTokenType.String)
                        {
                            settings[property.Name] = property.Value.Value<string>() ?? string.Empty;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error parsing rule settings for rule {RuleID}", rule.RuleID);
            }

            if (!settings.ContainsKey("intervalDays"))
                settings["intervalDays"] = 3;
            if (!settings.ContainsKey("minAmount"))
                settings["minAmount"] = 0;
            if (!settings.ContainsKey("maxDaysOverdue"))
                settings["maxDaysOverdue"] = 90;
            if (!settings.ContainsKey("minDaysOverdue"))
                settings["minDaysOverdue"] = 0;
            if (!settings.ContainsKey("excludePartialPayments"))
                settings["excludePartialPayments"] = false;

            return settings;
        }

        private async Task UpdateRuleStatisticsAsync(NotificationRule rule)
        {
            try
            {
                var pakistanNow = GetPakistanTime();
                rule.LastRunTime = pakistanNow;
                rule.TotalRuns++;
                
                if (!rule.IsManualTrigger)
                {
                    rule.NextRunTime = CalculateNextRunTime(rule);
                }
                
                rule.ModifiedDate = pakistanNow;
                await _context.SaveChangesAsync();
                
                _logger.LogDebug("📊 Updated statistics for rule {RuleID}: LastRun={LastRun}, TotalRuns={TotalRuns}",
                    rule.RuleID, rule.LastRunTime?.ToString("yyyy-MM-dd HH:mm:ss"), rule.TotalRuns);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error updating rule statistics for rule {RuleID}", rule.RuleID);
            }
        }

        private DateTime? CalculateNextRunTime(NotificationRule rule)
        {
            if (rule.RuleType == "MANUAL" || rule.IsManualTrigger)
                return null;

            var pakistanNow = GetPakistanTime();
            
            if (rule.RuleType == "CRON" && !string.IsNullOrEmpty(rule.CronExpression))
            {
                try
                {
                    var utcNow = pakistanNow.ToUniversalTime();
                    var parts = rule.CronExpression.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    
                    if (parts.Length != 5 && parts.Length != 6)
                    {
                        _logger.LogWarning("⚠️ Invalid cron expression format for rule {RuleID}: {CronExpression}", 
                            rule.RuleID, rule.CronExpression);
                        return null;
                    }
                    
                    var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;
                    var expression = CronExpression.Parse(rule.CronExpression, format);
                    
                    var nextUtc = expression.GetNextOccurrence(utcNow, inclusive: false);
                    if (nextUtc.HasValue)
                        return nextUtc.Value.ToLocalTime();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Error calculating next run time for cron expression: {CronExpression}", 
                        rule.CronExpression);
                }
            }
            else if (rule.TimingType == "DAYS_OFFSET" && rule.DaysOffset.HasValue)
            {
                return pakistanNow.AddDays(rule.DaysOffset.Value);
            }
            else if (rule.TimingType == "FIXED_TIME" && rule.FixedTime.HasValue)
            {
                var nextRun = pakistanNow.Date.Add(rule.FixedTime.Value);
                if (nextRun <= pakistanNow)
                {
                    nextRun = nextRun.AddDays(1);
                }
                return nextRun;
            }

            return null;
        }

        private string ParseTemplate(string template, Dictionary<string, object> data)
        {
            if (string.IsNullOrEmpty(template))
                return string.Empty;

            var result = template;
            foreach (var kvp in data)
            {
                result = result.Replace($"{{{kvp.Key}}}", kvp.Value?.ToString() ?? "");
            }

            return result;
        }


        // Add these methods to BackgroundNotificationService.cs

/// <summary>
/// Processes expired notifications (older than expiry time)
/// </summary>
public async Task ProcessExpiredNotificationsAsync()
{
    try
    {
        var pakistanNow = GetPakistanTime();
        var expiryDate = pakistanNow.AddDays(-30); // Keep 30 days of history
        
        // Get expired notifications (older than expiry date and not sent)
        var expiredNotifications = await _context.NotificationQueue
            .Where(n => n.CreatedTime < expiryDate && 
                       (n.Status == "PENDING" || n.Status == "PROCESSING" || n.Status == "FAILED"))
            .ToListAsync();

        _logger.LogInformation("Found {Count} expired notifications to process", expiredNotifications.Count);

        foreach (var notification in expiredNotifications)
        {
            try
            {
                // Move to history instead of deleting
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
                    ArchivedDate = pakistanNow,
                    // Store error info if failed
                    // You may need to add these columns to NotificationHistory table
                };

                _context.NotificationHistory.Add(history);
                _context.NotificationQueue.Remove(notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing expired notification {QueueID}", notification.QueueID);
            }
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Successfully processed {Count} expired notifications", expiredNotifications.Count);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error in ProcessExpiredNotificationsAsync");
    }
}

/// <summary>
/// Cleans up old data (older than specified days)
/// </summary>
public async Task CleanupOldDataAsync()
{
    try
    {
        var pakistanNow = GetPakistanTime();
        var cutoffDate = pakistanNow.AddDays(-90); // Keep 90 days of data
        
        // Archive old sent notifications
        var oldSentNotifications = await _context.NotificationQueue
            .Where(n => n.Status == "SENT" && n.ProcessedTime < cutoffDate)
            .ToListAsync();

        _logger.LogInformation("Found {Count} old sent notifications to archive", oldSentNotifications.Count);

        foreach (var notification in oldSentNotifications)
        {
            try
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
                    ArchivedDate = pakistanNow
                };

                _context.NotificationHistory.Add(history);
                _context.NotificationQueue.Remove(notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error archiving old notification {QueueID}", notification.QueueID);
            }
        }

        // Clean up old logs (older than 180 days)
        var logCutoffDate = pakistanNow.AddDays(-180);
        var oldLogs = await _context.NotificationLogs
            .Where(l => l.Timestamp < logCutoffDate)
            .ToListAsync();

        _context.NotificationLogs.RemoveRange(oldLogs);
        
        // Clean up old batch notifications (older than 90 days)
        var batchCutoffDate = pakistanNow.AddDays(-90);
        var oldBatches = await _context.BatchNotifications
            .Where(b => b.CreatedTime < batchCutoffDate && 
                       (b.Status == "COMPLETED" || b.Status == "FAILED"))
            .ToListAsync();

        _context.BatchNotifications.RemoveRange(oldBatches);

        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Cleanup completed: Archived {Archived} notifications, Removed {Logs} logs, Removed {Batches} batches", 
            oldSentNotifications.Count, oldLogs.Count, oldBatches.Count);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error in CleanupOldDataAsync");
    }
}

/// <summary>
/// Retries failed notifications
/// </summary>
public async Task RetryFailedNotificationsAsync()
{
    try
    {
        var pakistanNow = GetPakistanTime();
        
        // Get failed notifications that haven't exceeded max retry attempts
        var failedNotifications = await _context.NotificationQueue
            .Where(n => n.Status == "FAILED" && n.AttemptCount < 3)
            .OrderBy(n => n.LastAttemptTime)
            .Take(100) // Process 100 at a time
            .ToListAsync();

        _logger.LogInformation("Found {Count} failed notifications to retry", failedNotifications.Count);

        int retriedCount = 0;
        
        foreach (var notification in failedNotifications)
        {
            try
            {
                // Reset status to PENDING for retry
                notification.Status = "PENDING";
                notification.ScheduledTime = pakistanNow;
                notification.ErrorMessage = null;
                notification.AttemptCount = 0;
                notification.LastAttemptTime = null;
                
                retriedCount++;
                
                _logger.LogInformation("Retrying notification {QueueID} for user {UserID}", 
                    notification.QueueID, notification.UserID);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting failed notification {QueueID}", notification.QueueID);
            }
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Successfully reset {Count} failed notifications for retry", retriedCount);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error in RetryFailedNotificationsAsync");
    }
}

        // Helper classes
        private class AttendanceRecord
        {
            public int StudentID { get; set; }
            public int ParentID { get; set; }
            public string? StudentName { get; set; }
            public int? RollNumber { get; set; }
            public DateTime? AbsentDate { get; set; }
            public string? StatusValue { get; set; }
            public string? StudentRemarks { get; set; }
        }

        private class FeeDueStudent
        {
            public int FeePostingID { get; set; }
            public int StudentID { get; set; }
            public string StudentName { get; set; } = string.Empty;
            public int? RollNumber { get; set; }
            public int? ClassID { get; set; }
            public int? SectionID { get; set; }
            public int ParentID { get; set; }
            public string ParentName { get; set; } = string.Empty;
            public string ParentMobile { get; set; } = string.Empty;
            public int? DueAmount { get; set; }
            public int? LateFee { get; set; }
            public string FeeMonth { get; set; } = string.Empty;
            public string FeeYear { get; set; } = string.Empty;
            public DateOnly? IssueDate { get; set; }
            public DateOnly? DueDate { get; set; }
            public int? DaysOverdue { get; set; }
            public string ChallanNo { get; set; } = string.Empty;
            public string ClassName { get; set; } = string.Empty;
            public string SectionName { get; set; } = string.Empty;
            public string FCMToken { get; set; } = string.Empty;
            public int? RemainingAmount { get; set; }
            public int HasPartialPayment { get; set; }
        }

        private class ExamRecord
        {
            public int StudentID { get; set; }
            public int ParentID { get; set; }
            public string? StudentName { get; set; }
            public string? ExamTitle { get; set; }
            public DateTime? ExamDate { get; set; }
            public string? Subject { get; set; }
        }
    }
}