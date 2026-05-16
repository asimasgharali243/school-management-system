using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Hangfire;
using System.Dynamic;
using Microsoft.Data.SqlClient;
using Cronos;
using System.Globalization;

namespace school_management_Backend.Services
{
    public class NotificationRuleProcessor : INotificationRuleProcessor
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly ILogger<NotificationRuleProcessor> _logger;
        private readonly TimeZoneInfo _pakistanTimeZone;

        public NotificationRuleProcessor(
            ApplicationDbContext context,
            INotificationService notificationService,
            ILogger<NotificationRuleProcessor> logger)
        {
            _context = context;
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
                    _logger.LogWarning("⚠️ Pakistan timezone not found, using local timezone: {Timezone}", 
                        TimeZoneInfo.Local.DisplayName);
                }
            }
        }

        public DateTime GetPakistanTime()
        {
            return TimeZoneInfo.ConvertTime(DateTime.UtcNow, _pakistanTimeZone);
        }

        #region Helper Classes for Section Parsing

        private class SectionTarget
        {
            public int SectionID { get; set; }
            public int ClassID { get; set; }
            public List<int> StudentIDs { get; set; } = new List<int>();
        }

        #endregion

        #region Section Parsing Methods

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

        #endregion

        // ==================== MAIN EXECUTION METHODS ====================

        public async Task<List<NotificationQueue>> ExecuteRuleAsync(NotificationRule rule)
        {
            var notifications = new List<NotificationQueue>();
            
            try
            {
                _logger.LogInformation("🚀 Executing rule: {RuleName} (ID: {RuleID}, Type: {RuleType}, Category: {Category}, Manual: {IsManual})", 
                    rule.RuleName, rule.RuleID, rule.RuleType, rule.Category, rule.IsManualTrigger);

                if (!await ShouldRuleRunNowAsync(rule))
                {
                    _logger.LogInformation("⏸️ Rule {RuleID} should not run now based on timing, skipping", rule.RuleID);
                    return notifications;
                }

                var targetUsers = await GetTargetUsersAsync(rule);
                
                _logger.LogInformation("👥 Found {Count} target users for rule {RuleID}", targetUsers.Count, rule.RuleID);
                
                if (targetUsers.Count == 0)
                {
                    _logger.LogInformation("📭 Rule {RuleID} executed with 0 target users", rule.RuleID);
                    await UpdateRuleStatisticsAsync(rule);
                    return notifications;
                }
                
                notifications = await ProcessRuleByCategoryAsync(rule, targetUsers);
                
                await UpdateRuleStatisticsAsync(rule);
                
                _logger.LogInformation("✅ Rule {RuleID} executed successfully. Created/Updated {Count} notifications", 
                    rule.RuleID, notifications.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error executing rule {RuleID}", rule.RuleID);
            }
            
            return notifications;
        }

        public async Task ExecuteRuleManuallyAsync(int ruleId)
        {
            try
            {
                _logger.LogInformation("🚀 MANUAL EXECUTION triggered for rule ID: {RuleId}", ruleId);
                
                var rule = await _context.NotificationRules
                    .FirstOrDefaultAsync(r => r.RuleID == ruleId);
                
                if (rule == null)
                {
                    _logger.LogWarning("⚠️ Rule {RuleId} not found for manual execution", ruleId);
                    return;
                }
                
                if (!rule.IsActive)
                {
                    _logger.LogWarning("⏸️ Rule {RuleId} is inactive, cannot execute manually", ruleId);
                    return;
                }
                
                _logger.LogInformation("⚡ Manually executing rule: {RuleName} (ID: {RuleID}, Type: {RuleType}, Category: {Category}, Manual: {IsManual})", 
                    rule.RuleName, rule.RuleID, rule.RuleType, rule.Category, rule.IsManualTrigger);
                
                var targetUsers = await GetTargetUsersAsync(rule);
                
                _logger.LogInformation("👥 Found {Count} target users for manual rule {RuleID}", targetUsers.Count, rule.RuleID);
                
                if (targetUsers.Count == 0)
                {
                    _logger.LogInformation("📭 Manual rule {RuleID} executed with 0 target users", rule.RuleID);
                    await UpdateRuleStatisticsForManualExecutionAsync(rule);
                    return;
                }
                
                List<NotificationQueue> notifications;
                
                switch (rule.Category?.ToUpper())
                {
                    case "FEE":
                        notifications = await ProcessFeeNotificationsAsync(rule, targetUsers);
                        break;
                    case "ATTENDANCE":
                        notifications = await ProcessAttendanceNotificationsAsync(rule, targetUsers);
                        break;
                    case "EXAM":
                        notifications = await ProcessExamNotificationsAsync(rule, targetUsers);
                        break;
                    case "HOMEWORK":
                        notifications = await ProcessHomeworkNotificationsAsync(rule, targetUsers);
                        break;
                    case "ANNOUNCEMENT":
                        notifications = await ProcessAnnouncementNotificationsAsync(rule, targetUsers);
                        break;
                    case "GENERAL":
                        notifications = await ProcessGeneralNotificationsAsync(rule, targetUsers);
                        break;
                    case "ALERT":
                        notifications = await ProcessAlertNotificationsAsync(rule, targetUsers);
                        break;
                    case "EVENT":
                        notifications = await ProcessEventNotificationsAsync(rule, targetUsers);
                        break;
                    default:
                        notifications = await ProcessGenericNotificationsAsync(rule, targetUsers);
                        break;
                }
                
                await UpdateRuleStatisticsForManualExecutionAsync(rule);
                
                _logger.LogInformation("✅ Manual rule {RuleID} executed successfully. Created {Count} notifications", 
                    rule.RuleID, notifications.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in manual execution for rule {RuleId}", ruleId);
                throw;
            }
        }

        private async Task UpdateRuleStatisticsForManualExecutionAsync(NotificationRule rule)
        {
            try
            {
                var pakistanNow = GetPakistanTime();
                rule.LastRunTime = pakistanNow;
                rule.TotalRuns++;
                rule.ModifiedDate = pakistanNow;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error updating rule statistics for manual rule {RuleID}", rule.RuleID);
            }
        }

        private async Task<List<NotificationQueue>> ProcessRuleByCategoryAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            var notifications = new List<NotificationQueue>();
            
            switch (rule.Category?.ToUpper())
            {
                case "FEE":
                    notifications = await ProcessFeeNotificationsAsync(rule, targetUsers);
                    break;
                case "ATTENDANCE":
                    notifications = await ProcessAttendanceNotificationsAsync(rule, targetUsers);
                    break;
                case "EXAM":
                    notifications = await ProcessExamNotificationsAsync(rule, targetUsers);
                    break;
                case "HOMEWORK":
                    notifications = await ProcessHomeworkNotificationsAsync(rule, targetUsers);
                    break;
                case "ANNOUNCEMENT":
                    notifications = await ProcessAnnouncementNotificationsAsync(rule, targetUsers);
                    break;
                case "GENERAL":
                    notifications = await ProcessGeneralNotificationsAsync(rule, targetUsers);
                    break;
                case "ALERT":
                    notifications = await ProcessAlertNotificationsAsync(rule, targetUsers);
                    break;
                case "EVENT":
                    notifications = await ProcessEventNotificationsAsync(rule, targetUsers);
                    break;
                default:
                    notifications = await ProcessGenericNotificationsAsync(rule, targetUsers);
                    break;
            }
            
            return notifications;
        }

        // ==================== TIMING VALIDATION ====================

        public async Task<bool> ShouldRuleRunNowAsync(NotificationRule rule)
        {
            try
            {
                var pakistanNow = GetPakistanTime();
                
                if (rule.RuleType == "MANUAL")
                    return false;
                
                if (rule.RuleType == "EVENT")
                {
                    if (rule.IsManualTrigger)
                    {
                        return false;
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

        // ==================== TARGET USER METHODS ====================

        public async Task<List<dynamic>> GetTargetUsersAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                _logger.LogInformation("🔍 Getting target users for rule {RuleID} with category {Category}", 
                    rule.RuleID, rule.Category);

                // For FEE category, always use GetFeeTargetUsersAsync
                if (rule.Category?.ToUpper() == "FEE")
                {
                    users = await GetFeeTargetUsersAsync(rule);
                }
                else if (!string.IsNullOrEmpty(rule.TargetType))
                {
                    users = await GetTargetUsersByTargetTypeAsync(rule);
                }
                else
                {
                    switch (rule.Category?.ToUpper())
                    {
                        case "ATTENDANCE":
                            users = await GetAttendanceTargetUsersAsync(rule);
                            break;
                        case "EXAM":
                            users = await GetExamTargetUsersAsync(rule);
                            break;
                        case "HOMEWORK":
                            users = await GetHomeworkTargetUsersAsync(rule);
                            break;
                        case "EVENT":
                            users = await GetEventTargetUsersAsync(rule);
                            break;
                        default:
                            users = await GetGenericTargetUsersAsync(rule);
                            break;
                    }
                }
                
                _logger.LogInformation("👥 Found {Count} target users for rule {RuleID}", users.Count, rule.RuleID);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting target users for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        private async Task<List<dynamic>> GetTargetUsersByTargetTypeAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                switch (rule.TargetType.ToUpper())
                {
                    case "ALL":
                        var allUsers = await _context.tbl_User
                            .Where(u => u.Status == true)
                            .Select(u => new { u.ID, u.Name, u.RoleID })
                            .ToListAsync();
                        
                        foreach (var user in allUsers)
                        {
                            dynamic userObj = new ExpandoObject();
                            userObj.UserID = user.ID;
                            userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
                            userObj.UserName = user.Name;
                            users.Add(userObj);
                        }
                        break;

                    case "PARENTS":
                        var parents = await _context.tbl_User
                            .Where(u => u.Status == true && u.RoleID == 4)
                            .Select(u => new { u.ID, u.Name })
                            .ToListAsync();
                        
                        foreach (var parent in parents)
                        {
                            dynamic userObj = new ExpandoObject();
                            userObj.UserID = parent.ID;
                            userObj.UserType = "PARENT";
                            userObj.UserName = parent.Name;
                            users.Add(userObj);
                        }
                        break;

                    case "TEACHERS":
                        var teachers = await _context.tbl_User
                            .Where(u => u.Status == true && u.RoleID == 3)
                            .Select(u => new { u.ID, u.Name })
                            .ToListAsync();
                        
                        foreach (var teacher in teachers)
                        {
                            dynamic userObj = new ExpandoObject();
                            userObj.UserID = teacher.ID;
                            userObj.UserType = "TEACHER";
                            userObj.UserName = teacher.Name;
                            users.Add(userObj);
                        }
                        break;

                    case "STUDENTS":
                        var students = await _context.tbl_User
                            .Where(u => u.Status == true && u.RoleID == 5)
                            .Select(u => new { u.ID, u.Name })
                            .ToListAsync();
                        
                        foreach (var student in students)
                        {
                            dynamic userObj = new ExpandoObject();
                            userObj.UserID = student.ID;
                            userObj.UserType = "STUDENT";
                            userObj.UserName = student.Name;
                            users.Add(userObj);
                        }
                        break;

                    case "CLASS":
                        var classIds = ParseClassFilter(rule);
                        if (classIds.Any())
                        {
                            var familyCodes = await _context.tbl_StudentRegistration
                                .Where(s => classIds.Contains(s.Class_ID ?? 0) && (s.cur_Status == null || s.cur_Status == "A") && s.Family_Code.HasValue)
                                .Select(s => s.Family_Code.Value)
                                .Distinct()
                                .ToListAsync();
                            
                            if (familyCodes.Any())
                            {
                                var parentUsers = await _context.tbl_User
                                    .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
                                    .Select(u => new { u.ID, u.Name })
                                    .ToListAsync();
                                
                                foreach (var user in parentUsers)
                                {
                                    dynamic userObj = new ExpandoObject();
                                    userObj.UserID = user.ID;
                                    userObj.UserType = "PARENT";
                                    userObj.UserName = user.Name;
                                    users.Add(userObj);
                                }
                            }
                        }
                        break;

                    case "SECTION":
                        var sections = ParseSectionsFromTargetFilter(rule);
                        
                        if (sections.Any())
                        {
                            var allParentIds = new HashSet<int>();
                            
                            foreach (var section in sections)
                            {
                                var studentQuery = _context.tbl_StudentRegistration
                                    .Where(s => s.Section_ID == section.SectionID && s.Class_ID == section.ClassID && (s.cur_Status == null || s.cur_Status == "A"));
                                
                                if (section.StudentIDs.Any())
                                {
                                    studentQuery = studentQuery.Where(s => section.StudentIDs.Contains(s.Reg_Id));
                                }
                                
                                var familyCodes = await studentQuery
                                    .Where(s => s.Family_Code.HasValue)
                                    .Select(s => s.Family_Code.Value)
                                    .Distinct()
                                    .ToListAsync();
                                
                                if (familyCodes.Any())
                                {
                                    var parentIds = await _context.tbl_User
                                        .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
                                        .Select(u => u.ID)
                                        .ToListAsync();
                                    
                                    foreach (var pid in parentIds)
                                    {
                                        if (!allParentIds.Contains(pid))
                                        {
                                            allParentIds.Add(pid);
                                            dynamic userObj = new ExpandoObject();
                                            userObj.UserID = pid;
                                            userObj.UserType = "PARENT";
                                            users.Add(userObj);
                                        }
                                    }
                                }
                            }
                        }
                        break;

                    case "SPECIFIC_USERS":
                        var userIds = ParseSpecificUsers(rule);
                        if (userIds.Any())
                        {
                            var specificUsers = await _context.tbl_User
                                .Where(u => userIds.Contains(u.ID) && u.Status == true)
                                .Select(u => new { u.ID, u.Name, u.RoleID })
                                .ToListAsync();
                            
                            foreach (var user in specificUsers)
                            {
                                dynamic userObj = new ExpandoObject();
                                userObj.UserID = user.ID;
                                userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
                                userObj.UserName = user.Name;
                                users.Add(userObj);
                            }
                        }
                        break;

                    case "SPECIFIC_STUDENTS_DIRECT":
                        var specificStudentIds = ParseSpecificStudents(rule);
                        if (specificStudentIds.Any())
                        {
                            var familyCodes = await _context.tbl_StudentRegistration
                                .Where(s => specificStudentIds.Contains(s.Reg_Id) && (s.cur_Status == null || s.cur_Status == "A") && s.Family_Code.HasValue)
                                .Select(s => s.Family_Code.Value)
                                .Distinct()
                                .ToListAsync();
                            
                            if (familyCodes.Any())
                            {
                                var parentUsers = await _context.tbl_User
                                    .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
                                    .Select(u => new { u.ID, u.Name })
                                    .ToListAsync();
                                
                                foreach (var parent in parentUsers)
                                {
                                    dynamic userObj = new ExpandoObject();
                                    userObj.UserID = parent.ID;
                                    userObj.UserType = "PARENT";
                                    userObj.UserName = parent.Name;
                                    users.Add(userObj);
                                }
                            }
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in GetTargetUsersByTargetTypeAsync for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        // ==================== FEE TARGET USERS ====================

        private async Task<List<dynamic>> GetFeeTargetUsersAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                var ruleSettings = ParseRuleSettings(rule);
                
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
                        COALESCE(s.Mobile1, s.FatherContact_Number, s.MotherContact_Number, '') as ParentMobile,
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
                        d.FCMToken as DeviceToken,
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
                                AND frd.Received >= fp.Amount
                        ) THEN 1 ELSE 0 END as IsFullyPaid
                    FROM tbl_FeePosting fp
                    INNER JOIN tbl_StudentRegistration s ON fp.Reg_ID = s.Reg_Id
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
                    LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
                    LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
                    WHERE fp.Type = 'POSTED'
                        AND u.Status = 1
                        AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active', 'Addmission'))";

                var parameters = new List<SqlParameter>();

                if (ruleSettings.ContainsKey("minAmount"))
                {
                    sql += " AND fp.Amount >= @minAmount";
                    parameters.Add(new SqlParameter("@minAmount", Convert.ToInt32(ruleSettings["minAmount"])));
                }

                sql += " ORDER BY fp.DueDate ASC";

                var result = await _context.Database.SqlQueryRaw<FeeTargetUser>(sql, parameters.ToArray()).ToListAsync();

                _logger.LogInformation("💰 Found {Count} fee-due students for rule {RuleID}", result.Count, rule.RuleID);

                foreach (var item in result)
                {
                    dynamic user = new ExpandoObject();
                    user.FeePostingID = item.FeePostingID;
                    user.StudentID = item.StudentID;
                    user.StudentName = item.StudentName ?? "";
                    user.RollNumber = item.RollNumber ?? 0;
                    user.ClassID = item.ClassID ?? 0;
                    user.SectionID = item.SectionID ?? 0;
                    user.ParentID = item.ParentID;
                    user.ParentName = item.ParentName ?? "";
                    user.ParentMobile = item.ParentMobile ?? "";
                    user.DueAmount = item.DueAmount ?? 0;
                    user.LateFee = item.LateFee ?? 0;
                    user.FeeMonth = item.FeeMonth ?? "";
                    user.FeeYear = item.FeeYear ?? "";
                    user.IssueDate = item.IssueDate;
                    user.DueDate = item.DueDate;
                    user.DaysOverdue = item.DaysOverdue ?? 0;
                    user.ChallanNo = item.ChallanNo ?? "";
                    user.ClassName = item.ClassName ?? "";
                    user.SectionName = item.SectionName ?? "";
                    user.DeviceToken = item.DeviceToken ?? "";
                    user.RemainingAmount = item.RemainingAmount ?? 0;
                    user.TotalDue = (item.RemainingAmount ?? 0) + (item.LateFee ?? 0);
                    user.IsFullyPaid = item.IsFullyPaid == 1;
                    user.UserID = item.ParentID;
                    user.UserType = "PARENT";
                    user.UserName = item.ParentName ?? "";
                    
                    users.Add(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting fee target users for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        // ==================== ATTENDANCE TARGET USERS ====================

        private async Task<List<dynamic>> GetAttendanceTargetUsersAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                var pakistanNow = GetPakistanTime();
                var today = pakistanNow.Date;
                
                var sql = @"
                    SELECT DISTINCT 
                        s.Reg_Id as StudentID,
                        ISNULL(s.Frist_Name, '') as StudentName,
                        ISNULL(s.RollNo, 0) as RollNumber,
                        ISNULL(s.Class_ID, 0) as ClassID,
                        ISNULL(c.Class_Name, '') as ClassName,
                        ISNULL(s.Section_ID, 0) as SectionID,
                        ISNULL(sec.Section, '') as SectionName,
                        u.ID as ParentID,
                        ISNULL(u.Name, '') as ParentName,
                        u.FamilyID,
                        m.AttDate as AttendanceDate,
                        ISNULL(a.Status, '') as AttendanceStatus,
                        ISNULL(a.Remarks, '') as StudentRemarks,
                        ISNULL(d.FCMToken, '') as DeviceToken
                    FROM tbl_StudentRegistration s
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_StudentAttDetail a ON s.Reg_Id = a.RegID
                    INNER JOIN tbl_StudentAttMaster m ON a.MasterId = m.ID
                    LEFT JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
                    LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
                    LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
                    WHERE u.Status = 1
                        AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active'))
                        AND (UPPER(a.Status) = 'A' OR UPPER(a.Status) = 'ABSENT' OR a.Status LIKE '%Absent%')
                        AND CAST(m.AttDate AS DATE) = @todayDate";

                var result = await _context.Database.SqlQueryRaw<AttendanceTargetUser>(sql, new SqlParameter("@todayDate", today)).ToListAsync();

                _logger.LogInformation("📊 Found {Count} attendance records for rule {RuleID}", result.Count, rule.RuleID);

                foreach (var item in result)
                {
                    dynamic user = new ExpandoObject();
                    user.UserID = item.ParentID;
                    user.UserType = "PARENT";
                    user.ParentName = item.ParentName ?? "";
                    user.DeviceToken = item.DeviceToken ?? string.Empty;
                    user.StudentID = item.StudentID;
                    user.StudentName = item.StudentName ?? "";
                    user.RollNumber = item.RollNumber;
                    user.ClassID = item.ClassID;
                    user.ClassName = item.ClassName ?? "";
                    user.SectionID = item.SectionID;
                    user.SectionName = item.SectionName ?? "";
                    user.AttendanceDate = item.AttendanceDate;
                    user.AttendanceStatus = item.AttendanceStatus ?? "";
                    user.StudentRemarks = item.StudentRemarks ?? "";
                    user.FamilyID = item.FamilyID;
                    user.UserName = item.ParentName ?? "";
                    
                    users.Add(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting attendance target users for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        private async Task<List<dynamic>> GetExamTargetUsersAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                var sql = @"
                    SELECT DISTINCT 
                        s.Reg_Id as StudentID,
                        u.ID as ParentID,
                        d.FCMToken as DeviceToken,
                        s.Frist_Name as StudentName,
                        s.RollNo as RollNumber,
                        s.Class_ID as ClassID,
                        s.Section_ID as SectionID,
                        e.ExamTitle,
                        e.ExamDate,
                        e.Subject,
                        e.TotalMarks,
                        e.PassingMarks,
                        c.ClassName,
                        sec.SectionName
                    FROM tbl_StudentRegistration s
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_Exams e ON s.Class_ID = e.ClassID
                    INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
                    LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
                    LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
                    WHERE u.Status = 1
                        AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
                        AND CAST(e.ExamDate AS DATE) >= CAST(GETDATE() AS DATE)
                        AND CAST(e.ExamDate AS DATE) <= DATEADD(DAY, 7, CAST(GETDATE() AS DATE))";

                var result = await _context.Database.SqlQueryRaw<ExamTargetUser>(sql).ToListAsync();

                _logger.LogInformation("📚 Found {Count} exam records for rule {RuleID}", result.Count, rule.RuleID);

                foreach (var item in result)
                {
                    dynamic user = new ExpandoObject();
                    user.UserID = item.ParentID;
                    user.UserType = "PARENT";
                    user.DeviceToken = item.DeviceToken;
                    user.StudentID = item.StudentID;
                    user.StudentName = item.StudentName;
                    user.RollNumber = item.RollNumber;
                    user.ClassID = item.ClassID;
                    user.SectionID = item.SectionID;
                    user.ExamTitle = item.ExamTitle;
                    user.ExamDate = item.ExamDate;
                    user.Subject = item.Subject;
                    user.TotalMarks = item.TotalMarks;
                    user.PassingMarks = item.PassingMarks;
                    user.ClassName = item.ClassName;
                    user.SectionName = item.SectionName;
                    
                    users.Add(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting exam target users for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        private async Task<List<dynamic>> GetHomeworkTargetUsersAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                var sql = @"
                    SELECT DISTINCT 
                        s.Reg_Id as StudentID,
                        u.ID as ParentID,
                        d.FCMToken as DeviceToken,
                        s.Frist_Name as StudentName,
                        s.RollNo as RollNumber,
                        s.Class_ID as ClassID,
                        s.Section_ID as SectionID,
                        h.HomeworkTitle,
                        h.HomeworkDescription,
                        h.Subject,
                        h.DueDate,
                        h.AssignedDate,
                        c.ClassName,
                        sec.SectionName
                    FROM tbl_StudentRegistration s
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_Homework h ON s.Class_ID = h.ClassID
                    INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
                    LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
                    LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
                    WHERE u.Status = 1
                        AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
                        AND CAST(h.DueDate AS DATE) >= CAST(GETDATE() AS DATE)
                        AND CAST(h.DueDate AS DATE) <= DATEADD(DAY, 3, CAST(GETDATE() AS DATE))";

                var result = await _context.Database.SqlQueryRaw<HomeworkTargetUser>(sql).ToListAsync();

                _logger.LogInformation("📝 Found {Count} homework records for rule {RuleID}", result.Count, rule.RuleID);

                foreach (var item in result)
                {
                    dynamic user = new ExpandoObject();
                    user.UserID = item.ParentID;
                    user.UserType = "PARENT";
                    user.DeviceToken = item.DeviceToken;
                    user.StudentID = item.StudentID;
                    user.StudentName = item.StudentName;
                    user.RollNumber = item.RollNumber;
                    user.ClassID = item.ClassID;
                    user.SectionID = item.SectionID;
                    user.HomeworkTitle = item.HomeworkTitle;
                    user.HomeworkDescription = item.HomeworkDescription;
                    user.Subject = item.Subject;
                    user.DueDate = item.DueDate;
                    user.AssignedDate = item.AssignedDate;
                    user.ClassName = item.ClassName;
                    user.SectionName = item.SectionName;
                    
                    users.Add(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting homework target users for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        private async Task<List<dynamic>> GetEventTargetUsersAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                var sql = @"
                    SELECT DISTINCT 
                        s.Reg_Id as StudentID,
                        u.ID as ParentID,
                        d.FCMToken as DeviceToken,
                        s.Frist_Name as StudentName,
                        s.RollNo as RollNumber,
                        s.Class_ID as ClassID,
                        s.Section_ID as SectionID,
                        e.EventTitle,
                        e.EventDescription,
                        e.EventDate,
                        e.EventTime,
                        e.Location,
                        c.ClassName,
                        sec.SectionName
                    FROM tbl_StudentRegistration s
                    INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
                    INNER JOIN tbl_Events e ON s.Class_ID = e.ClassID
                    INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
                    LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
                    LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
                    WHERE u.Status = 1
                        AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
                        AND CAST(e.EventDate AS DATE) >= CAST(GETDATE() AS DATE)";

                var result = await _context.Database.SqlQueryRaw<EventTargetUser>(sql).ToListAsync();

                _logger.LogInformation("🎉 Found {Count} event records for rule {RuleID}", result.Count, rule.RuleID);

                foreach (var item in result)
                {
                    dynamic user = new ExpandoObject();
                    user.UserID = item.ParentID;
                    user.UserType = "PARENT";
                    user.DeviceToken = item.DeviceToken;
                    user.StudentID = item.StudentID;
                    user.StudentName = item.StudentName;
                    user.RollNumber = item.RollNumber;
                    user.ClassID = item.ClassID;
                    user.SectionID = item.SectionID;
                    user.EventTitle = item.EventTitle;
                    user.EventDescription = item.EventDescription;
                    user.EventDate = item.EventDate;
                    user.EventTime = item.EventTime;
                    user.Location = item.Location;
                    user.ClassName = item.ClassName;
                    user.SectionName = item.SectionName;
                    
                    users.Add(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting event target users for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        private async Task<List<dynamic>> GetGenericTargetUsersAsync(NotificationRule rule)
        {
            var users = new List<dynamic>();
            
            try
            {
                var allUsers = await _context.tbl_User
                    .Where(u => u.Status == true)
                    .Select(u => new { u.ID, u.RoleID, u.Name })
                    .ToListAsync();
                
                foreach (var user in allUsers)
                {
                    dynamic userObj = new ExpandoObject();
                    userObj.UserID = user.ID;
                    userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
                    userObj.UserName = user.Name;
                    users.Add(userObj);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting generic target users for rule {RuleID}", rule.RuleID);
            }
            
            return users;
        }

        // ==================== NOTIFICATION PROCESSING METHODS ====================

        private async Task<List<NotificationQueue>> ProcessFeeNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            var notifications = new List<NotificationQueue>();
            
            try
            {
                var ruleSettings = ParseRuleSettings(rule);
                
                Guid? batchId = null;
                if (rule.IsBatch)
                {
                    batchId = await CreateBatchNotificationAsync(rule, targetUsers.Count);
                }

                foreach (var user in targetUsers)
                {
                    try
                    {
                        var notification = await CreateFeeNotificationAsync(rule, user, ruleSettings, batchId);
                        if (notification != null)
                            notifications.Add(notification);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error creating fee notification for user");
                    }
                }

                if (batchId.HasValue)
                {
                    await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error processing fee notifications");
            }
            
            return notifications;
        }

        private async Task<NotificationQueue> CreateFeeNotificationAsync(
            NotificationRule rule, 
            dynamic userData, 
            Dictionary<string, object> ruleSettings,
            Guid? batchId = null)
        {
            try
            {
                var userId = GetUserId(userData);
                if (userId == 0)
                {
                    _logger.LogWarning("⚠️ Invalid UserID for notification rule {RuleID}", rule.RuleID);
                    return null;
                }

                int concreteUserId = userId;
                var pakistanNow = GetPakistanTime();
                var today = pakistanNow.Date;

                var device = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == concreteUserId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                
                string? fcmToken = device?.FCMToken;

                if (string.IsNullOrEmpty(fcmToken))
                {
                    _logger.LogWarning("⚠️ No FCM token found for user {UserID} in rule {RuleID}", 
                        concreteUserId, rule.RuleID);
                    return null;
                }

                string userType = GetUserType(userData) ?? "USER";

                string notificationType = "FEE_REMINDER";
                string statusText = "Fee pending";
                
                // Safely handle DueDate
                var dataDict = ConvertToDictionary(userData);
                if (dataDict.ContainsKey("DueDate") && dataDict["DueDate"] != null)
                {
                    var dueDateObj = dataDict["DueDate"];
                    if (dueDateObj is DateOnly dateOnly)
                    {
                        var dueDate = dateOnly.ToDateTime(TimeOnly.MinValue);
                        var daysUntilDue = (dueDate - today).Days;
                        var daysOverdue = (today - dueDate).Days;
                        
                        if (daysUntilDue > 0)
                        {
                            notificationType = $"DUE_IN_{daysUntilDue}_DAYS";
                            statusText = $"Due in {daysUntilDue} days";
                        }
                        else if (daysOverdue >= 0)
                        {
                            notificationType = $"OVERDUE_{daysOverdue}_DAYS";
                            statusText = $"Overdue by {daysOverdue} days";
                        }
                    }
                    else if (dueDateObj is DateTime dateTime)
                    {
                        var daysUntilDue = (dateTime.Date - today).Days;
                        var daysOverdue = (today - dateTime.Date).Days;
                        
                        if (daysUntilDue > 0)
                        {
                            notificationType = $"DUE_IN_{daysUntilDue}_DAYS";
                            statusText = $"Due in {daysUntilDue} days";
                        }
                        else if (daysOverdue >= 0)
                        {
                            notificationType = $"OVERDUE_{daysOverdue}_DAYS";
                            statusText = $"Overdue by {daysOverdue} days";
                        }
                    }
                }
                
                var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Fee Payment Reminder", dataDict);
                var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} has pending fee", dataDict);
                
                var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
                var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
                
                if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Fee Payment Reminder";
                if (string.IsNullOrEmpty(messagePlain)) messagePlain = "You have a pending fee payment";
                
                string dataPayload;
                if (!string.IsNullOrEmpty(rule.DataTemplate))
                {
                    dataPayload = await ResolveTemplate(rule.DataTemplate, dataDict);
                }
                else
                {
                    var studentId = dataDict.ContainsKey("StudentID") ? Convert.ToInt32(dataDict["StudentID"] ?? 0) : 0;
                    var challanNo = dataDict.ContainsKey("ChallanNo") ? dataDict["ChallanNo"]?.ToString() ?? "" : "";
                    var feePostingId = dataDict.ContainsKey("FeePostingID") ? Convert.ToInt32(dataDict["FeePostingID"] ?? 0) : 0;
                    var remainingAmount = dataDict.ContainsKey("RemainingAmount") ? Convert.ToInt32(dataDict["RemainingAmount"] ?? 0) : 0;
                    var daysOverdue = dataDict.ContainsKey("DaysOverdue") ? Convert.ToInt32(dataDict["DaysOverdue"] ?? 0) : 0;
                    
                    var payloadData = new Dictionary<string, object>
                    {
                        ["action"] = "view_fee_details",
                        ["studentId"] = studentId,
                        ["challanNo"] = challanNo,
                        ["feePostingId"] = feePostingId,
                        ["amount"] = remainingAmount,
                        ["daysOverdue"] = daysOverdue,
                        ["notificationType"] = notificationType,
                        ["category"] = rule.Category,
                        ["titleHtml"] = titleHtml,
                        ["messageHtml"] = messageHtml,
                        ["isHtml"] = true
                    };
                    
                    if (batchId.HasValue)
                        payloadData["batchId"] = batchId.Value;
                    
                    dataPayload = JsonConvert.SerializeObject(payloadData);
                }

                var notification = new NotificationQueue
                {
                    RuleID = rule.RuleID,
                    UserID = concreteUserId,
                    UserType = userType,
                    DeviceToken = fcmToken,
                    Title = titlePlain,
                    Message = messagePlain,
                    DataPayload = dataPayload,
                    Status = "PENDING",
                    Priority = rule.Priority,
                    ScheduledTime = pakistanNow,
                    ExpiryTime = pakistanNow.AddDays(7),
                    CreatedTime = pakistanNow,
                    AttemptCount = 0,
                    LastAttemptTime = null,
                    ErrorMessage = null
                };

                _context.NotificationQueue.Add(notification);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Created fee notification for user {UserID}", concreteUserId);
                
                return notification;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating fee notification: {Message}", ex.Message);
                return null;
            }
        }

        // ==================== ATTENDANCE NOTIFICATION PROCESSING ====================

        private async Task<List<NotificationQueue>> ProcessAttendanceNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            var notifications = new List<NotificationQueue>();
            
            try
            {
                var ruleSettings = ParseRuleSettings(rule);
                
                if (!targetUsers.Any())
                {
                    _logger.LogWarning("⚠️ No target users found for rule {RuleID}", rule.RuleID);
                    return notifications;
                }
                
                // Get unique Parent IDs from target users
                var parentIds = targetUsers.Select(u => (int)u.UserID).Distinct().ToList();
                
                // Get all device tokens from UserDevices table for these parents
                var devices = await _context.UserDevices
                    .Where(d => parentIds.Contains(d.UserID) && d.IsActive && !string.IsNullOrEmpty(d.FCMToken))
                    .ToDictionaryAsync(d => d.UserID, d => d.FCMToken);
                
                // Filter target users to only those with valid device tokens
                var validUsers = new List<dynamic>();
                foreach (var user in targetUsers)
                {
                    int userId = (int)user.UserID;
                    if (devices.ContainsKey(userId))
                    {
                        validUsers.Add(user);
                    }
                }
                
                if (!validUsers.Any())
                {
                    _logger.LogWarning("⚠️ No valid users with device tokens found for rule {RuleID}", rule.RuleID);
                    return notifications;
                }
                
                // Group by Parent ID
                var parents = validUsers
                    .GroupBy(u => (int)u.UserID)
                    .Select(g => new
                    {
                        ParentID = g.Key,
                        Students = g.ToList()
                    })
                    .ToList();

                Guid? batchId = null;
                if (rule.IsBatch)
                {
                    batchId = await CreateBatchNotificationAsync(rule, parents.Count);
                }

                foreach (var parent in parents)
                {
                    try
                    {
                        string fcmToken = devices[parent.ParentID];
                        var notification = await CreateAttendanceNotificationAsync(rule, parent.ParentID, parent.Students, fcmToken, ruleSettings, batchId);
                        if (notification != null)
                            notifications.Add(notification);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parent.ParentID);
                    }
                }

                if (batchId.HasValue)
                {
                    await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error processing attendance notifications");
            }
            
            return notifications;
        }

        private async Task<NotificationQueue> CreateAttendanceNotificationAsync(
            NotificationRule rule, 
            int parentId, 
            List<dynamic> studentList,
            string fcmToken,
            Dictionary<string, object> ruleSettings,
            Guid? batchId = null)
        {
            try
            {
                if (string.IsNullOrEmpty(fcmToken))
                {
                    _logger.LogWarning("⚠️ No FCM token provided for parent {ParentID}, skipping notification", parentId);
                    return null;
                }

                // Get the first student
                var firstStudent = studentList.First();
                var dictAccess = firstStudent as IDictionary<string, object>;
                
                // Extract student information
                string studentName = "";
                string rollNumber = "";
                string className = "";
                string sectionName = "";
                int studentId = 0;
                
                if (dictAccess != null)
                {
                    if (dictAccess.ContainsKey("StudentName"))
                        studentName = dictAccess["StudentName"]?.ToString() ?? "";
                    if (dictAccess.ContainsKey("RollNumber"))
                        rollNumber = dictAccess["RollNumber"]?.ToString() ?? "N/A";
                    if (dictAccess.ContainsKey("ClassName"))
                        className = dictAccess["ClassName"]?.ToString() ?? "";
                    if (dictAccess.ContainsKey("SectionName"))
                        sectionName = dictAccess["SectionName"]?.ToString() ?? "";
                    if (dictAccess.ContainsKey("StudentID"))
                        studentId = Convert.ToInt32(dictAccess["StudentID"] ?? 0);
                }
                
                var parent = await _context.tbl_User
                    .Where(u => u.ID == parentId)
                    .FirstOrDefaultAsync();

                var parentName = parent?.Name ?? "Parent";
                var familyId = parent?.FamilyID;

                var pakistanNow = GetPakistanTime();
                var today = pakistanNow.Date;
                
                // If no student name was found, try to get from database directly
                if (string.IsNullOrEmpty(studentName) && familyId.HasValue)
                {
                    var studentFromDb = await _context.tbl_StudentRegistration
                        .Where(s => s.Family_Code == familyId.Value)
                        .Select(s => s.Frist_Name)
                        .FirstOrDefaultAsync();
                    if (!string.IsNullOrEmpty(studentFromDb))
                        studentName = studentFromDb;
                }
                
                // Build notification data
                var data = new Dictionary<string, object>
                {
                    ["StudentID"] = studentId,
                    ["StudentName"] = string.IsNullOrEmpty(studentName) ? "Student" : studentName,
                    ["StudentCount"] = studentList.Count,
                    ["RollNumber"] = string.IsNullOrEmpty(rollNumber) ? "N/A" : rollNumber,
                    ["ClassName"] = string.IsNullOrEmpty(className) ? "Class" : className,
                    ["SectionName"] = string.IsNullOrEmpty(sectionName) ? "Section" : sectionName,
                    ["AttendanceDate"] = today.ToString("dd/MM/yyyy"),
                    ["Date"] = today.ToString("dd/MM/yyyy"),
                    ["Status"] = "Absent",
                    ["Remarks"] = "",
                    ["MultipleStudents"] = studentList.Count > 1,
                    ["ParentName"] = parentName,
                    ["BatchId"] = batchId
                };

                var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Attendance Alert", data);
                var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} was {Status} on {Date}", data);
                
                var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
                var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
                
                if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Attendance Alert";
                if (string.IsNullOrEmpty(messagePlain)) messagePlain = $"{data["StudentName"]} was absent";

                var payloadData = new Dictionary<string, object>
                {
                    ["data"] = data,
                    ["titleHtml"] = titleHtml,
                    ["messageHtml"] = messageHtml,
                    ["isHtml"] = true,
                    ["action"] = "view_attendance",
                    ["parentId"] = parentId,
                    ["studentCount"] = studentList.Count,
                    ["studentId"] = studentId,
                    ["className"] = data["ClassName"],
                    ["sectionName"] = data["SectionName"]
                };
                
                if (batchId.HasValue)
                    payloadData["batchId"] = batchId.Value;

                var notification = new NotificationQueue
                {
                    RuleID = rule.RuleID,
                    UserID = parentId,
                    UserType = "PARENT",
                    Title = titlePlain,
                    Message = messagePlain,
                    Status = "PENDING",
                    Priority = rule.Priority,
                    ScheduledTime = pakistanNow,
                    CreatedTime = pakistanNow,
                    ExpiryTime = pakistanNow.AddDays(7),
                    DataPayload = JsonConvert.SerializeObject(payloadData),
                    DeviceToken = fcmToken,
                    AttemptCount = 0,
                    LastAttemptTime = null,
                    ErrorMessage = null
                };

                _context.NotificationQueue.Add(notification);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Created attendance notification {QueueID} for parent {ParentID} with student {StudentName}", 
                    notification.QueueID, parentId, data["StudentName"]);
                
                return notification;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parentId);
                return null;
            }
        }

        private async Task<List<NotificationQueue>> ProcessExamNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            return await ProcessGenericNotificationsAsync(rule, targetUsers, "EXAM");
        }

        private async Task<List<NotificationQueue>> ProcessHomeworkNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            return await ProcessGenericNotificationsAsync(rule, targetUsers, "HOMEWORK");
        }

        private async Task<List<NotificationQueue>> ProcessAnnouncementNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            return await ProcessGenericNotificationsAsync(rule, targetUsers, "ANNOUNCEMENT");
        }

        private async Task<List<NotificationQueue>> ProcessGeneralNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            return await ProcessGenericNotificationsAsync(rule, targetUsers, "GENERAL");
        }

        private async Task<List<NotificationQueue>> ProcessAlertNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            return await ProcessGenericNotificationsAsync(rule, targetUsers, "ALERT");
        }

        private async Task<List<NotificationQueue>> ProcessEventNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
        {
            return await ProcessGenericNotificationsAsync(rule, targetUsers, "EVENT");
        }

        private async Task<List<NotificationQueue>> ProcessGenericNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers, string category = null)
        {
            var notifications = new List<NotificationQueue>();
            
            try
            {
                var ruleSettings = ParseRuleSettings(rule);
                
                Guid? batchId = null;
                if (rule.IsBatch)
                {
                    batchId = await CreateBatchNotificationAsync(rule, targetUsers.Count);
                }

                foreach (var user in targetUsers)
                {
                    try
                    {
                        var notification = await CreateGenericNotificationAsync(rule, user, ruleSettings, category, batchId);
                        if (notification != null)
                            notifications.Add(notification);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error creating generic notification for user");
                    }
                }

                if (batchId.HasValue)
                {
                    await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error processing generic notifications");
            }
            
            return notifications;
        }

        private async Task<NotificationQueue> CreateGenericNotificationAsync(
            NotificationRule rule, 
            dynamic userData, 
            Dictionary<string, object> ruleSettings,
            string category = null,
            Guid? batchId = null)
        {
            try
            {
                var userId = GetUserId(userData);
                if (userId == 0)
                {
                    _logger.LogWarning("⚠️ Invalid UserID for notification rule {RuleID}", rule.RuleID);
                    return null;
                }

                int concreteUserId = userId;
                var pakistanNow = GetPakistanTime();
                var today = pakistanNow.Date;

                var device = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == concreteUserId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                
                string? fcmToken = device?.FCMToken;

                if (string.IsNullOrEmpty(fcmToken))
                {
                    _logger.LogWarning("⚠️ No FCM token found for user {UserID} in rule {RuleID}", 
                        concreteUserId, rule.RuleID);
                    return null;
                }

                string userType = GetUserType(userData) ?? "USER";
                
                string? parentName = null;
                if (userType == "PARENT")
                {
                    parentName = await _context.tbl_User
                        .Where(u => u.ID == concreteUserId)
                        .Select(u => u.Name)
                        .FirstOrDefaultAsync();
                }

                var dataDict = ConvertToDictionary(userData);
                
                dataDict["CurrentDate"] = today.ToString("dd/MM/yyyy");
                dataDict["CurrentTime"] = pakistanNow.ToString("HH:mm");
                dataDict["RuleName"] = rule.RuleName;
                dataDict["Category"] = category ?? rule.Category;
                
                if (!string.IsNullOrEmpty(parentName))
                {
                    dataDict["ParentName"] = parentName;
                }

                var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Notification", dataDict);
                var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "You have a new notification", dataDict);
                
                var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
                var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
                
                if (string.IsNullOrEmpty(titlePlain))
                {
                    titlePlain = "School Notification";
                }
                if (string.IsNullOrEmpty(messagePlain))
                {
                    messagePlain = "You have a new notification from your school";
                }
                
                string dataPayload;
                if (!string.IsNullOrEmpty(rule.DataTemplate))
                {
                    dataPayload = await ResolveTemplate(rule.DataTemplate, dataDict);
                }
                else
                {
                    var payloadData = new Dictionary<string, object>
                    {
                        ["action"] = "view_notification",
                        ["userId"] = userId,
                        ["category"] = category ?? rule.Category,
                        ["ruleId"] = rule.RuleID,
                        ["timestamp"] = pakistanNow.ToString("yyyy-MM-ddTHH:mm:ss"),
                        ["titleHtml"] = titleHtml,
                        ["messageHtml"] = messageHtml,
                        ["isHtml"] = true
                    };
                    
                    if (batchId.HasValue)
                        payloadData["batchId"] = batchId.Value;
                    
                    dataPayload = JsonConvert.SerializeObject(payloadData);
                }

                var notification = new NotificationQueue
                {
                    RuleID = rule.RuleID,
                    UserID = concreteUserId,
                    UserType = userType,
                    DeviceToken = fcmToken,
                    Title = titlePlain,
                    Message = messagePlain,
                    DataPayload = dataPayload,
                    Status = "PENDING",
                    Priority = rule.Priority,
                    ScheduledTime = pakistanNow,
                    ExpiryTime = pakistanNow.AddDays(7),
                    CreatedTime = pakistanNow,
                    AttemptCount = 0,
                    LastAttemptTime = null,
                    ErrorMessage = null
                };

                _context.NotificationQueue.Add(notification);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Created notification {QueueID} for user {UserID}", 
                    notification.QueueID, concreteUserId);
                
                return notification;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating generic notification for user");
                return null;
            }
        }

        // ==================== HELPER METHODS ====================

        private async Task<Guid> CreateBatchNotificationAsync(NotificationRule rule, int totalRecipients)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating batch notification");
                return Guid.Empty;
            }
        }

        private async Task UpdateBatchNotificationAsync(Guid batchId, int sentCount)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error updating batch notification");
            }
        }

        private Dictionary<string, object> ParseRuleSettings(NotificationRule rule)
        {
            var settings = new Dictionary<string, object>();
            
            try
            {
                if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
                {
                    settings = JsonConvert.DeserializeObject<Dictionary<string, object>>(rule.TargetFilter) ?? new Dictionary<string, object>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error parsing rule settings for rule {RuleID}", rule.RuleID);
            }

            return settings;
        }

        private async Task UpdateRuleStatisticsAsync(NotificationRule rule)
        {
            try
            {
                var pakistanNow = GetPakistanTime();
                rule.LastRunTime = pakistanNow;
                rule.TotalRuns++;
                rule.ModifiedDate = pakistanNow;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error updating rule statistics for rule {RuleID}", rule.RuleID);
            }
        }

        public async Task<DateTime?> CalculateNextRunTime(NotificationRule rule)
        {
            if (!rule.IsActive || string.IsNullOrEmpty(rule.TimingType))
                return null;

            if (rule.RuleType == "MANUAL" || rule.IsManualTrigger)
                return null;

            var pakistanNow = GetPakistanTime();

            switch (rule.TimingType.ToUpper())
            {
                case "IMMEDIATE":
                    return pakistanNow.AddMinutes(5);
                case "FIXED_TIME":
                    if (rule.FixedTime.HasValue)
                    {
                        var nextRun = pakistanNow.Date.Add(rule.FixedTime.Value);
                        if (nextRun <= pakistanNow)
                            nextRun = nextRun.AddDays(1);
                        return nextRun;
                    }
                    break;
                case "DAYS_OFFSET":
                    if (rule.DaysOffset.HasValue)
                        return pakistanNow.AddDays(rule.DaysOffset.Value);
                    break;
                case "CRON":
                    if (!string.IsNullOrEmpty(rule.CronExpression))
                    {
                        try
                        {
                            var utcNow = pakistanNow.ToUniversalTime();
                            var parts = rule.CronExpression.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                            var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;
                            var schedule = CronExpression.Parse(rule.CronExpression, format);
                            var nextUtc = schedule.GetNextOccurrence(utcNow, inclusive: false);
                            if (nextUtc.HasValue)
                                return nextUtc.Value.ToLocalTime();
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "❌ Error parsing cron expression for rule {RuleID}: {Expression}", 
                                rule.RuleID, rule.CronExpression);
                        }
                    }
                    break;
                case "DAILY":
                    return pakistanNow.AddDays(1);
                case "WEEKLY":
                    return pakistanNow.AddDays(7);
                case "BIWEEKLY":
                    return pakistanNow.AddDays(14);
                case "MONTHLY":
                    return pakistanNow.AddMonths(1);
            }

            return null;
        }

        public async Task ScheduleRule(NotificationRule rule)
        {
            try
            {
                if (rule.RuleType == "CRON" && !string.IsNullOrEmpty(rule.CronExpression) && !rule.IsManualTrigger)
                {
                    RecurringJob.RemoveIfExists($"notification-rule-{rule.RuleID}");
                    RecurringJob.AddOrUpdate<INotificationRuleProcessor>(
                        $"notification-rule-{rule.RuleID}",
                        processor => processor.ExecuteRuleDirectAsync(rule.RuleID),
                        rule.CronExpression,
                        TimeZoneInfo.Local);
                    
                    _logger.LogInformation("📅 Scheduled cron job for rule {RuleID} with expression: {Expression}", 
                        rule.RuleID, rule.CronExpression);
                }
                
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error scheduling rule {RuleID}", rule.RuleID);
            }
        }

        public async Task<string> ResolveTemplate(string template, dynamic data)
        {
            if (string.IsNullOrEmpty(template))
                return string.Empty;

            var result = template;
            
            try
            {
                var dataDict = ConvertToDictionary(data);

                foreach (var prop in dataDict)
                {
                    var placeholder = "{" + prop.Key + "}";
                    var value = prop.Value?.ToString() ?? string.Empty;
                    if (result.Contains(placeholder))
                    {
                        result = result.Replace(placeholder, value);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error resolving template: {Template}", template);
            }

            return result;
        }

        private Dictionary<string, object> ConvertToDictionary(dynamic data)
        {
            var dict = new Dictionary<string, object>();
            
            if (data is ExpandoObject expando)
            {
                var expandoDict = expando as IDictionary<string, object>;
                foreach (var kvp in expandoDict)
                {
                    dict[kvp.Key] = kvp.Value;
                }
            }
            else if (data is IDictionary<string, object> dataDict)
            {
                dict = new Dictionary<string, object>(dataDict);
            }
            
            return dict;
        }

        private int GetUserId(dynamic userData)
        {
            try
            {
                if (userData is IDictionary<string, object> dict)
                {
                    if (dict.TryGetValue("UserID", out var userIdObj))
                        return Convert.ToInt32(userIdObj);
                    if (dict.TryGetValue("ParentID", out var parentIdObj))
                        return Convert.ToInt32(parentIdObj);
                }
                return 0;
            }
            catch
            {
                return 0;
            }
        }

        private string GetUserType(dynamic userData)
        {
            try
            {
                if (userData is IDictionary<string, object> dict && dict.TryGetValue("UserType", out var userTypeObj))
                {
                    return userTypeObj?.ToString() ?? "USER";
                }
                return "USER";
            }
            catch
            {
                return "USER";
            }
        }

        private string GetUserTypeFromRole(int roleId)
        {
            return roleId switch
            {
                1 => "ADMIN",
                2 => "TEACHER",
                3 => "STUDENT",
                4 => "PARENT",
                _ => "USER"
            };
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task ExecuteRuleDirectAsync(int ruleId)
        {
            try
            {
                _logger.LogInformation("🚀 Hangfire executing rule {RuleID}", ruleId);
                var rule = await _context.NotificationRules.FindAsync(ruleId);
                if (rule == null)
                {
                    _logger.LogWarning("⚠️ Rule {RuleID} not found", ruleId);
                    return;
                }

                if (!rule.IsActive)
                {
                    _logger.LogWarning("⏸️ Rule {RuleID} is inactive", ruleId);
                    return;
                }

                await ExecuteRuleAsync(rule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error executing rule {RuleID} via Hangfire", ruleId);
                throw;
            }
        }

        // Helper Classes for SQL Results
        private class FeeTargetUser
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
            public string DeviceToken { get; set; } = string.Empty;
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
            public int? RemainingAmount { get; set; }
            public int IsFullyPaid { get; set; }
        }

        private class AttendanceTargetUser
        {
            public int StudentID { get; set; }
            public string StudentName { get; set; } = string.Empty;
            public int RollNumber { get; set; }
            public int ClassID { get; set; }
            public string ClassName { get; set; } = string.Empty;
            public int SectionID { get; set; }
            public string SectionName { get; set; } = string.Empty;
            public int ParentID { get; set; }
            public string ParentName { get; set; } = string.Empty;
            public int? FamilyID { get; set; }
            public DateTime? AttendanceDate { get; set; }
            public string AttendanceStatus { get; set; } = string.Empty;
            public string StudentRemarks { get; set; } = string.Empty;
            public string DeviceToken { get; set; } = string.Empty;
        }

        private class ExamTargetUser
        {
            public int StudentID { get; set; }
            public int ParentID { get; set; }
            public string DeviceToken { get; set; } = string.Empty;
            public string StudentName { get; set; } = string.Empty;
            public int? RollNumber { get; set; }
            public int? ClassID { get; set; }
            public int? SectionID { get; set; }
            public string ExamTitle { get; set; } = string.Empty;
            public DateTime? ExamDate { get; set; }
            public string Subject { get; set; } = string.Empty;
            public int? TotalMarks { get; set; }
            public int? PassingMarks { get; set; }
            public string ClassName { get; set; } = string.Empty;
            public string SectionName { get; set; } = string.Empty;
        }

        private class HomeworkTargetUser
        {
            public int StudentID { get; set; }
            public int ParentID { get; set; }
            public string DeviceToken { get; set; } = string.Empty;
            public string StudentName { get; set; } = string.Empty;
            public int? RollNumber { get; set; }
            public int? ClassID { get; set; }
            public int? SectionID { get; set; }
            public string HomeworkTitle { get; set; } = string.Empty;
            public string HomeworkDescription { get; set; } = string.Empty;
            public string Subject { get; set; } = string.Empty;
            public DateTime? DueDate { get; set; }
            public DateTime? AssignedDate { get; set; }
            public string ClassName { get; set; } = string.Empty;
            public string SectionName { get; set; } = string.Empty;
        }

        private class EventTargetUser
        {
            public int StudentID { get; set; }
            public int ParentID { get; set; }
            public string DeviceToken { get; set; } = string.Empty;
            public string StudentName { get; set; } = string.Empty;
            public int? RollNumber { get; set; }
            public int? ClassID { get; set; }
            public int? SectionID { get; set; }
            public string EventTitle { get; set; } = string.Empty;
            public string EventDescription { get; set; } = string.Empty;
            public DateTime? EventDate { get; set; }
            public string EventTime { get; set; } = string.Empty;
            public string Location { get; set; } = string.Empty;
            public string ClassName { get; set; } = string.Empty;
            public string SectionName { get; set; } = string.Empty;
        }
    }
}

// using Microsoft.EntityFrameworkCore;
// using school_management_Backend.Data;
// using school_management_Backend.Models;
// using Newtonsoft.Json;
// using Newtonsoft.Json.Linq;
// using Hangfire;
// using System.Dynamic;
// using Microsoft.Data.SqlClient;
// using Cronos;
// using System.Globalization;

// namespace school_management_Backend.Services
// {
//     public class NotificationRuleProcessor : INotificationRuleProcessor
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly INotificationService _notificationService;
//         private readonly ILogger<NotificationRuleProcessor> _logger;
//         private readonly TimeZoneInfo _pakistanTimeZone;

//         public NotificationRuleProcessor(
//             ApplicationDbContext context,
//             INotificationService notificationService,
//             ILogger<NotificationRuleProcessor> logger)
//         {
//             _context = context;
//             _notificationService = notificationService;
//             _logger = logger;
            
//             try
//             {
//                 _pakistanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Pakistan Standard Time");
//             }
//             catch
//             {
//                 try
//                 {
//                     _pakistanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Karachi");
//                 }
//                 catch
//                 {
//                     _pakistanTimeZone = TimeZoneInfo.Local;
//                     _logger.LogWarning("⚠️ Pakistan timezone not found, using local timezone: {Timezone}", 
//                         TimeZoneInfo.Local.DisplayName);
//                 }
//             }
//         }

//         public DateTime GetPakistanTime()
//         {
//             return TimeZoneInfo.ConvertTime(DateTime.UtcNow, _pakistanTimeZone);
//         }

//         #region Helper Classes for Section Parsing

//         private class SectionTarget
//         {
//             public int SectionID { get; set; }
//             public int ClassID { get; set; }
//             public List<int> StudentIDs { get; set; } = new List<int>();
//         }

//         #endregion

//         #region Section Parsing Methods

//         private List<SectionTarget> ParseSectionsFromTargetFilter(NotificationRule rule)
//         {
//             var sections = new List<SectionTarget>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["Sections"] is JArray sectionsArray)
//                     {
//                         foreach (var section in sectionsArray)
//                         {
//                             var sectionId = section["SectionID"]?.Value<int>();
//                             var classId = section["ClassID"]?.Value<int>();
//                             var studentIds = section["StudentID"]?.Value<JArray>()
//                                 ?.Select(x => x.Value<int>()).ToList() ?? new List<int>();
                            
//                             if (sectionId.HasValue && classId.HasValue)
//                             {
//                                 sections.Add(new SectionTarget
//                                 {
//                                     SectionID = sectionId.Value,
//                                     ClassID = classId.Value,
//                                     StudentIDs = studentIds
//                                 });
                                
//                                 _logger.LogDebug("📚 Parsed section: SectionID={SectionID}, ClassID={ClassID}, Students={StudentCount}", 
//                                     sectionId.Value, classId.Value, studentIds.Count);
//                             }
//                         }
//                     }
//                     else if (filter["SectionID"] != null)
//                     {
//                         var sectionId = filter["SectionID"]?.Value<int>();
//                         var studentIds = filter["StudentID"]?.Value<JArray>()
//                             ?.Select(x => x.Value<int>()).ToList() ?? new List<int>();
                        
//                         if (sectionId.HasValue)
//                         {
//                             var section = _context.tbl_AddSection
//                                 .FirstOrDefault(s => s.ID == sectionId.Value);
                            
//                             sections.Add(new SectionTarget
//                             {
//                                 SectionID = sectionId.Value,
//                                 ClassID = section?.Class_ID ?? 0,
//                                 StudentIDs = studentIds
//                             });
//                         }
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error parsing sections from target filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return sections;
//         }

//         private List<int> ParseClassFilter(NotificationRule rule)
//         {
//             var classIds = new List<int>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["ClassID"] is JArray classArray)
//                     {
//                         classIds = classArray.Select(x => x.Value<int>()).ToList();
//                     }
//                     else if (filter["ClassID"] != null)
//                     {
//                         classIds.Add(filter["ClassID"].Value<int>());
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing class filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return classIds;
//         }

//         private List<int> ParseSpecificUsers(NotificationRule rule)
//         {
//             var userIds = new List<int>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["UserID"] is JArray userArray)
//                     {
//                         userIds = userArray.Select(x => x.Value<int>()).ToList();
//                     }
//                     else if (filter["UserID"] != null)
//                     {
//                         userIds.Add(filter["UserID"].Value<int>());
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing user filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return userIds;
//         }

//         private List<int> ParseSpecificStudents(NotificationRule rule)
//         {
//             var studentIds = new List<int>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["Students"] is JArray studentArray)
//                     {
//                         studentIds = studentArray.Select(x => x.Value<int>()).ToList();
//                         _logger.LogDebug("📚 Parsed {Count} specific students from Students array: {StudentIds}", 
//                             studentIds.Count, string.Join(",", studentIds));
//                     }
//                     else if (filter["StudentID"] is JArray studentIdArray)
//                     {
//                         studentIds = studentIdArray.Select(x => x.Value<int>()).ToList();
//                     }
//                     else if (filter["StudentID"] != null)
//                     {
//                         studentIds.Add(filter["StudentID"].Value<int>());
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing specific students filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return studentIds;
//         }

//         #endregion

//         // ==================== MAIN EXECUTION METHODS ====================

//         public async Task<List<NotificationQueue>> ExecuteRuleAsync(NotificationRule rule)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             try
//             {
//                 _logger.LogInformation("🚀 Executing rule: {RuleName} (ID: {RuleID}, Type: {RuleType}, Category: {Category}, Manual: {IsManual})", 
//                     rule.RuleName, rule.RuleID, rule.RuleType, rule.Category, rule.IsManualTrigger);

//                 if (!await ShouldRuleRunNowAsync(rule))
//                 {
//                     _logger.LogInformation("⏸️ Rule {RuleID} should not run now based on timing, skipping", rule.RuleID);
//                     return notifications;
//                 }

//                 var targetUsers = await GetTargetUsersAsync(rule);
                
//                 _logger.LogInformation("👥 Found {Count} target users for rule {RuleID}", targetUsers.Count, rule.RuleID);
                
//                 if (targetUsers.Count == 0)
//                 {
//                     _logger.LogInformation("📭 Rule {RuleID} executed with 0 target users", rule.RuleID);
//                     await UpdateRuleStatisticsAsync(rule);
//                     return notifications;
//                 }
                
//                 notifications = await ProcessRuleByCategoryAsync(rule, targetUsers);
                
//                 await UpdateRuleStatisticsAsync(rule);
                
//                 _logger.LogInformation("✅ Rule {RuleID} executed successfully. Created/Updated {Count} notifications", 
//                     rule.RuleID, notifications.Count);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error executing rule {RuleID}", rule.RuleID);
//             }
            
//             return notifications;
//         }

//         public async Task ExecuteRuleManuallyAsync(int ruleId)
//         {
//             try
//             {
//                 _logger.LogInformation("🚀 MANUAL EXECUTION triggered for rule ID: {RuleId}", ruleId);
                
//                 var rule = await _context.NotificationRules
//                     .FirstOrDefaultAsync(r => r.RuleID == ruleId);
                
//                 if (rule == null)
//                 {
//                     _logger.LogWarning("⚠️ Rule {RuleId} not found for manual execution", ruleId);
//                     return;
//                 }
                
//                 if (!rule.IsActive)
//                 {
//                     _logger.LogWarning("⏸️ Rule {RuleId} is inactive, cannot execute manually", ruleId);
//                     return;
//                 }
                
//                 _logger.LogInformation("⚡ Manually executing rule: {RuleName} (ID: {RuleID}, Type: {RuleType}, Category: {Category}, Manual: {IsManual})", 
//                     rule.RuleName, rule.RuleID, rule.RuleType, rule.Category, rule.IsManualTrigger);
                
//                 var targetUsers = await GetTargetUsersAsync(rule);
                
//                 _logger.LogInformation("👥 Found {Count} target users for manual rule {RuleID}", targetUsers.Count, rule.RuleID);
                
//                 if (targetUsers.Count == 0)
//                 {
//                     _logger.LogInformation("📭 Manual rule {RuleID} executed with 0 target users", rule.RuleID);
//                     await UpdateRuleStatisticsForManualExecutionAsync(rule);
//                     return;
//                 }
                
//                 List<NotificationQueue> notifications;
                
//                 switch (rule.Category?.ToUpper())
//                 {
//                     case "FEE":
//                         notifications = await ProcessFeeNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "ATTENDANCE":
//                         notifications = await ProcessAttendanceNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "EXAM":
//                         notifications = await ProcessExamNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "HOMEWORK":
//                         notifications = await ProcessHomeworkNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "ANNOUNCEMENT":
//                         notifications = await ProcessAnnouncementNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "GENERAL":
//                         notifications = await ProcessGeneralNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "ALERT":
//                         notifications = await ProcessAlertNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "EVENT":
//                         notifications = await ProcessEventNotificationsAsync(rule, targetUsers);
//                         break;
//                     default:
//                         notifications = await ProcessGenericNotificationsAsync(rule, targetUsers);
//                         break;
//                 }
                
//                 await UpdateRuleStatisticsForManualExecutionAsync(rule);
                
//                 _logger.LogInformation("✅ Manual rule {RuleID} executed successfully. Created {Count} notifications", 
//                     rule.RuleID, notifications.Count);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error in manual execution for rule {RuleId}", ruleId);
//                 throw;
//             }
//         }

//         private async Task UpdateRuleStatisticsForManualExecutionAsync(NotificationRule rule)
//         {
//             try
//             {
//                 var pakistanNow = GetPakistanTime();
//                 rule.LastRunTime = pakistanNow;
//                 rule.TotalRuns++;
//                 rule.ModifiedDate = pakistanNow;
                
//                 await _context.SaveChangesAsync();
                
//                 _logger.LogDebug("📊 Updated statistics for manual rule {RuleID}: LastRun={LastRun}, TotalRuns={TotalRuns}",
//                     rule.RuleID, rule.LastRunTime?.ToString("yyyy-MM-dd HH:mm:ss"), rule.TotalRuns);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error updating rule statistics for manual rule {RuleID}", rule.RuleID);
//             }
//         }

//         private async Task<List<NotificationQueue>> ProcessRuleByCategoryAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             switch (rule.Category?.ToUpper())
//             {
//                 case "FEE":
//                     notifications = await ProcessFeeNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "ATTENDANCE":
//                     notifications = await ProcessAttendanceNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "EXAM":
//                     notifications = await ProcessExamNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "HOMEWORK":
//                     notifications = await ProcessHomeworkNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "ANNOUNCEMENT":
//                     notifications = await ProcessAnnouncementNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "GENERAL":
//                     notifications = await ProcessGeneralNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "ALERT":
//                     notifications = await ProcessAlertNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "EVENT":
//                     notifications = await ProcessEventNotificationsAsync(rule, targetUsers);
//                     break;
//                 default:
//                     notifications = await ProcessGenericNotificationsAsync(rule, targetUsers);
//                     break;
//             }
            
//             return notifications;
//         }

//         // ==================== TIMING VALIDATION ====================

//         public async Task<bool> ShouldRuleRunNowAsync(NotificationRule rule)
//         {
//             try
//             {
//                 var pakistanNow = GetPakistanTime();
                
//                 if (rule.RuleType == "MANUAL")
//                     return false;
                
//                 if (rule.RuleType == "EVENT")
//                 {
//                     if (rule.IsManualTrigger)
//                     {
//                         _logger.LogDebug("⏸️ Rule {RuleID} is manual trigger, skipping automatic execution", rule.RuleID);
//                         return false;
//                     }
                    
//                     return true;
//                 }
                
//                 if (rule.RuleType == "CRON" || rule.RuleType == "SCHEDULED")
//                 {
//                     return await CheckScheduleTimingAsync(rule, pakistanNow);
//                 }
                
//                 return true;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error checking if rule should run now");
//                 return false;
//             }
//         }

//         private async Task<bool> CheckScheduleTimingAsync(NotificationRule rule, DateTime pakistanNow)
//         {
//             switch (rule.TimingType?.ToUpper())
//             {
//                 case "IMMEDIATE":
//                     return true;
                    
//                 case "FIXED_TIME":
//                     if (!rule.FixedTime.HasValue) return false;
//                     var scheduledTime = pakistanNow.Date.Add(rule.FixedTime.Value);
//                     var timeDifference = Math.Abs((pakistanNow - scheduledTime).TotalMinutes);
//                     return timeDifference <= 15;
                    
//                 case "DAYS_OFFSET":
//                     if (!rule.DaysOffset.HasValue || !rule.LastRunTime.HasValue) return false;
//                     var daysSinceLastRun = (pakistanNow.Date - rule.LastRunTime.Value.Date).Days;
//                     return daysSinceLastRun >= rule.DaysOffset.Value;
                    
//                 case "CRON":
//                     if (string.IsNullOrEmpty(rule.CronExpression)) return false;
//                     return await CheckCronExpressionAsync(rule.CronExpression, pakistanNow);
                    
//                 case "DAILY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 1;
                    
//                 case "WEEKLY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 7;
                    
//                 case "BIWEEKLY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 14;
                    
//                 case "MONTHLY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 30;
                    
//                 case "WEEKDAY":
//                     return pakistanNow.DayOfWeek != DayOfWeek.Saturday && pakistanNow.DayOfWeek != DayOfWeek.Sunday;
                    
//                 case "WEEKEND":
//                     return pakistanNow.DayOfWeek == DayOfWeek.Saturday || pakistanNow.DayOfWeek == DayOfWeek.Sunday;
                    
//                 default:
//                     return true;
//             }
//         }

//         private async Task<bool> CheckCronExpressionAsync(string cronExpression, DateTime pakistanNow)
//         {
//             try
//             {
//                 var utcNow = pakistanNow.ToUniversalTime();
//                 var parts = cronExpression.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                
//                 if (parts.Length != 5 && parts.Length != 6)
//                 {
//                     _logger.LogError("❌ Invalid cron expression format: {Cron}", cronExpression);
//                     return false;
//                 }
                
//                 var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;
//                 var parsedExpression = CronExpression.Parse(cronExpression, format);
                
//                 var nextOccurrence = parsedExpression.GetNextOccurrence(utcNow.AddMinutes(-5), inclusive: false);
                
//                 if (nextOccurrence.HasValue)
//                 {
//                     var nextLocal = nextOccurrence.Value.ToLocalTime();
//                     var timeDiff = Math.Abs((pakistanNow - nextLocal).TotalMinutes);
//                     return timeDiff <= 5;
//                 }
                
//                 return false;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error parsing cron expression: {Cron}", cronExpression);
//                 return false;
//             }
//         }

//         // ==================== TARGET USER METHODS ====================

//         public async Task<List<dynamic>> GetTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 _logger.LogInformation("🔍 Getting target users for rule {RuleID} with category {Category}", 
//                     rule.RuleID, rule.Category);

//                 if (!string.IsNullOrEmpty(rule.TargetType))
//                 {
//                     users = await GetTargetUsersByTargetTypeAsync(rule);
//                 }
//                 else
//                 {
//                     switch (rule.Category?.ToUpper())
//                     {
//                         case "FEE":
//                             users = await GetFeeTargetUsersAsync(rule);
//                             break;
//                         case "ATTENDANCE":
//                             users = await GetAttendanceTargetUsersAsync(rule);
//                             break;
//                         case "EXAM":
//                             users = await GetExamTargetUsersAsync(rule);
//                             break;
//                         case "HOMEWORK":
//                             users = await GetHomeworkTargetUsersAsync(rule);
//                             break;
//                         case "EVENT":
//                             users = await GetEventTargetUsersAsync(rule);
//                             break;
//                         default:
//                             users = await GetGenericTargetUsersAsync(rule);
//                             break;
//                     }
//                 }
                
//                 _logger.LogInformation("👥 Found {Count} target users for rule {RuleID}", users.Count, rule.RuleID);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetTargetUsersByTargetTypeAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 switch (rule.TargetType.ToUpper())
//                 {
//                     case "ALL":
//                         var allUsers = await _context.tbl_User
//                             .Where(u => u.Status == true)
//                             .Select(u => new { u.ID, u.Name, u.RoleID })
//                             .ToListAsync();
                        
//                         foreach (var user in allUsers)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = user.ID;
//                             userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
//                             userObj.UserName = user.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "PARENTS":
//                         var parents = await _context.tbl_User
//                             .Where(u => u.Status == true && u.RoleID == 4)
//                             .Select(u => new { u.ID, u.Name })
//                             .ToListAsync();
                        
//                         foreach (var parent in parents)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = parent.ID;
//                             userObj.UserType = "PARENT";
//                             userObj.UserName = parent.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "TEACHERS":
//                         var teachers = await _context.tbl_User
//                             .Where(u => u.Status == true && u.RoleID == 3)
//                             .Select(u => new { u.ID, u.Name })
//                             .ToListAsync();
                        
//                         foreach (var teacher in teachers)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = teacher.ID;
//                             userObj.UserType = "TEACHER";
//                             userObj.UserName = teacher.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "STUDENTS":
//                         var students = await _context.tbl_User
//                             .Where(u => u.Status == true && u.RoleID == 5)
//                             .Select(u => new { u.ID, u.Name })
//                             .ToListAsync();
                        
//                         foreach (var student in students)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = student.ID;
//                             userObj.UserType = "STUDENT";
//                             userObj.UserName = student.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "CLASS":
//                         var classIds = ParseClassFilter(rule);
//                         if (classIds.Any())
//                         {
//                             var familyCodes = await _context.tbl_StudentRegistration
//                                 .Where(s => classIds.Contains(s.Class_ID ?? 0) 
//                                     && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission")
//                                     && s.Family_Code.HasValue)
//                                 .Select(s => s.Family_Code.Value)
//                                 .Distinct()
//                                 .ToListAsync();
                            
//                             if (familyCodes.Any())
//                             {
//                                 var parentUsers = await _context.tbl_User
//                                     .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
//                                     .Select(u => new { u.ID, u.Name })
//                                     .ToListAsync();
                                
//                                 foreach (var user in parentUsers)
//                                 {
//                                     dynamic userObj = new ExpandoObject();
//                                     userObj.UserID = user.ID;
//                                     userObj.UserType = "PARENT";
//                                     userObj.UserName = user.Name;
//                                     users.Add(userObj);
//                                 }
//                             }
//                         }
//                         break;

//                     case "SECTION":
//                         var sections = ParseSectionsFromTargetFilter(rule);
                        
//                         if (sections.Any())
//                         {
//                             var allParentIds = new HashSet<int>();
                            
//                             _logger.LogInformation("📋 Processing {Count} sections for rule {RuleID}", sections.Count, rule.RuleID);
                            
//                             foreach (var section in sections)
//                             {
//                                 _logger.LogInformation("🎯 Processing Section ID: {SectionID} (Class ID: {ClassID}) with {StudentCount} specific students", 
//                                     section.SectionID, section.ClassID, section.StudentIDs.Count);
                                
//                                 var studentQuery = _context.tbl_StudentRegistration
//                                     .Where(s => s.Section_ID == section.SectionID 
//                                         && s.Class_ID == section.ClassID
//                                         && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission"));
                                
//                                 if (section.StudentIDs.Any())
//                                 {
//                                     studentQuery = studentQuery.Where(s => section.StudentIDs.Contains(s.Reg_Id));
//                                     _logger.LogInformation("   📍 Filtering to {Count} specific students: {StudentIDs}", 
//                                         section.StudentIDs.Count, string.Join(",", section.StudentIDs));
//                                 }
//                                 else
//                                 {
//                                     _logger.LogInformation("   📍 No specific student filter - will include ALL students in this section");
//                                 }
                                
//                                 var familyCodes = await studentQuery
//                                     .Where(s => s.Family_Code.HasValue)
//                                     .Select(s => s.Family_Code.Value)
//                                     .Distinct()
//                                     .ToListAsync();
                                
//                                 _logger.LogInformation("   👨‍👩‍👧 Found {FamilyCount} family codes for Section {SectionID}", 
//                                     familyCodes.Count, section.SectionID);
                                
//                                 if (familyCodes.Any())
//                                 {
//                                     var parentIds = await _context.tbl_User
//                                         .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
//                                         .Select(u => u.ID)
//                                         .ToListAsync();
                                    
//                                     foreach (var pid in parentIds)
//                                     {
//                                         if (!allParentIds.Contains(pid))
//                                         {
//                                             allParentIds.Add(pid);
                                            
//                                             dynamic userObj = new ExpandoObject();
//                                             userObj.UserID = pid;
//                                             userObj.UserType = "PARENT";
//                                             users.Add(userObj);
//                                         }
//                                     }
                                    
//                                     _logger.LogInformation("   👨‍👩‍👧 Found {ParentCount} parents for Section {SectionID}", 
//                                         parentIds.Count, section.SectionID);
//                                 }
//                                 else
//                                 {
//                                     _logger.LogWarning("   ⚠️ No family codes found for Section {SectionID}", section.SectionID);
//                                 }
//                             }
                            
//                             _logger.LogInformation("📊 Total unique parents from all sections: {TotalParents}", users.Count);
//                         }
//                         else
//                         {
//                             _logger.LogWarning("⚠️ No sections parsed from target filter for rule {RuleID}", rule.RuleID);
//                         }
//                         break;

//                     case "SPECIFIC_USERS":
//                         var userIds = ParseSpecificUsers(rule);
//                         if (userIds.Any())
//                         {
//                             var specificUsers = await _context.tbl_User
//                                 .Where(u => userIds.Contains(u.ID) && u.Status == true)
//                                 .Select(u => new { u.ID, u.Name, u.RoleID })
//                                 .ToListAsync();
                            
//                             foreach (var user in specificUsers)
//                             {
//                                 dynamic userObj = new ExpandoObject();
//                                 userObj.UserID = user.ID;
//                                 userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
//                                 userObj.UserName = user.Name;
//                                 users.Add(userObj);
//                             }
//                         }
//                         break;

//                     case "SPECIFIC_STUDENTS_DIRECT":
//                         var specificStudentIds = ParseSpecificStudents(rule);
//                         if (specificStudentIds.Any())
//                         {
//                             _logger.LogInformation("🎯 Processing SPECIFIC_STUDENTS_DIRECT with {Count} students: {StudentIds}", 
//                                 specificStudentIds.Count, string.Join(",", specificStudentIds));
                            
//                             var familyCodes = await _context.tbl_StudentRegistration
//                                 .Where(s => specificStudentIds.Contains(s.Reg_Id) 
//                                     && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission")
//                                     && s.Family_Code.HasValue)
//                                 .Select(s => s.Family_Code.Value)
//                                 .Distinct()
//                                 .ToListAsync();
                            
//                             _logger.LogInformation("👨‍👩‍👧 Found {FamilyCount} family codes for selected students", familyCodes.Count);
                            
//                             if (familyCodes.Any())
//                             {
//                                 var parentUsers = await _context.tbl_User
//                                     .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
//                                     .Select(u => new { u.ID, u.Name })
//                                     .ToListAsync();
                                
//                                 foreach (var parent in parentUsers)
//                                 {
//                                     dynamic userObj = new ExpandoObject();
//                                     userObj.UserID = parent.ID;
//                                     userObj.UserType = "PARENT";
//                                     userObj.UserName = parent.Name;
//                                     users.Add(userObj);
                                    
//                                     _logger.LogDebug("👤 Added parent {ParentID} for selected students", parent.ID);
//                                 }
                                
//                                 _logger.LogInformation("👥 Found {ParentCount} parents for the selected students", parentUsers.Count);
//                             }
//                             else
//                             {
//                                 _logger.LogWarning("⚠️ No family codes found for selected students: {StudentIds}", 
//                                     string.Join(",", specificStudentIds));
//                             }
//                         }
//                         break;
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error in GetTargetUsersByTargetTypeAsync for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         // private async Task<List<dynamic>> GetFeeTargetUsersAsync(NotificationRule rule)
//         // {
//         //     var users = new List<dynamic>();
            
//         //     try
//         //     {
//         //         var ruleSettings = ParseRuleSettings(rule);
                
//         //         var sql = @"
//         //             SELECT DISTINCT 
//         //                 fp.ID as FeePostingID,
//         //                 fp.Reg_ID as StudentID,
//         //                 s.Frist_Name as StudentName,
//         //                 s.RollNo as RollNumber,
//         //                 s.Class_ID as ClassID,
//         //                 s.Section_ID as SectionID,
//         //                 u.ID as ParentID,
//         //                 u.Name as ParentName,
//         //                 COALESCE(s.Mobile1, s.FatherContact_Number, s.MotherContact_Number, '') as ParentMobile,
//         //                 fp.Amount as DueAmount,
//         //                 fp.Fine as LateFee,
//         //                 fp.FeeMonth,
//         //                 fp.FeeYear,
//         //                 fp.IssueDate,
//         //                 fp.DueDate,
//         //                 DATEDIFF(day, fp.DueDate, GETDATE()) as DaysOverdue,
//         //                 fp.ChallanNo,
//         //                 c.Class_Name as ClassName,
//         //                 sec.Section as SectionName,
//         //                 d.FCMToken as DeviceToken,
//         //                 ISNULL(fp.Amount, 0) - ISNULL((
//         //                     SELECT SUM(frd.Received) 
//         //                     FROM tbl_FeeReceiveDetail frd
//         //                     INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//         //                     WHERE frd.Challan_No = fp.ChallanNo 
//         //                         AND frm.RegID = fp.Reg_ID
//         //                 ), 0) as RemainingAmount,
//         //                 CASE WHEN EXISTS (
//         //                     SELECT 1 FROM tbl_FeeReceiveDetail frd
//         //                     INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//         //                     WHERE frd.Challan_No = fp.ChallanNo 
//         //                         AND frm.RegID = fp.Reg_ID
//         //                         AND frd.Received >= fp.Amount
//         //                 ) THEN 1 ELSE 0 END as IsFullyPaid
//         //             FROM tbl_FeePosting fp
//         //             INNER JOIN tbl_StudentRegistration s ON fp.Reg_ID = s.Reg_Id
//         //             INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//         //             INNER JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
//         //             LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
//         //             LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//         //             WHERE fp.Type = 'POSTED'
//         //                 AND u.Status = 1
//         //                 AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active', 'Addmission'))
//         //                 AND NOT EXISTS (
//         //                     SELECT 1 FROM tbl_FeeReceiveDetail frd
//         //                     INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//         //                     WHERE frd.Challan_No = fp.ChallanNo 
//         //                         AND frm.RegID = fp.Reg_ID
//         //                         AND frd.Received >= fp.Amount
//         //                 )";

//         //         var parameters = new List<SqlParameter>();

//         //         if (ruleSettings.ContainsKey("minAmount"))
//         //         {
//         //             sql += " AND fp.Amount >= @minAmount";
//         //             parameters.Add(new SqlParameter("@minAmount", Convert.ToInt32(ruleSettings["minAmount"])));
//         //         }

//         //         sql += " ORDER BY fp.DueDate ASC";

//         //         var result = await _context.Database.SqlQueryRaw<FeeTargetUser>(sql, parameters.ToArray()).ToListAsync();

//         //         _logger.LogInformation("💰 Found {Count} fee-due students for rule {RuleID}", result.Count, rule.RuleID);

//         //         foreach (var item in result)
//         //         {
//         //             dynamic user = new ExpandoObject();
//         //             user.UserID = item.ParentID;
//         //             user.UserType = "PARENT";
//         //             user.DeviceToken = item.DeviceToken;
//         //             user.StudentID = item.StudentID;
//         //             user.StudentName = item.StudentName;
//         //             user.RollNumber = item.RollNumber;
//         //             user.ClassID = item.ClassID;
//         //             user.SectionID = item.SectionID;
//         //             user.ParentName = item.ParentName;
//         //             user.ParentMobile = item.ParentMobile ?? string.Empty;
//         //             user.DueAmount = item.DueAmount;
//         //             user.RemainingAmount = item.RemainingAmount;
//         //             user.LateFee = item.LateFee;
//         //             user.FeeMonth = item.FeeMonth;
//         //             user.FeeYear = item.FeeYear;
//         //             user.IssueDate = item.IssueDate;
//         //             user.DueDate = item.DueDate;
//         //             user.DaysOverdue = item.DaysOverdue;
//         //             user.ChallanNo = item.ChallanNo;
//         //             user.ClassName = item.ClassName;
//         //             user.SectionName = item.SectionName;
//         //             user.FeePostingID = item.FeePostingID;
//         //             user.TotalDue = (item.RemainingAmount + item.LateFee) ?? 0;
//         //             user.IsFullyPaid = item.IsFullyPaid == 1;
                    
//         //             users.Add(user);
//         //         }
//         //     }
//         //     catch (Exception ex)
//         //     {
//         //         _logger.LogError(ex, "❌ Error getting fee target users for rule {RuleID}", rule.RuleID);
//         //     }
            
//         //     return users;
//         // }
// private async Task<List<dynamic>> GetFeeTargetUsersAsync(NotificationRule rule)
// {
//     var users = new List<dynamic>();
    
//     try
//     {
//         var ruleSettings = ParseRuleSettings(rule);
        
//         var sql = @"
//             SELECT DISTINCT 
//                 fp.ID as FeePostingID,
//                 fp.Reg_ID as StudentID,
//                 s.Frist_Name as StudentName,
//                 s.RollNo as RollNumber,
//                 s.Class_ID as ClassID,
//                 s.Section_ID as SectionID,
//                 u.ID as ParentID,
//                 u.Name as ParentName,
//                 COALESCE(s.Mobile1, s.FatherContact_Number, s.MotherContact_Number, '') as ParentMobile,
//                 fp.Amount as DueAmount,
//                 fp.Fine as LateFee,
//                 fp.FeeMonth,
//                 fp.FeeYear,
//                 fp.IssueDate,
//                 fp.DueDate,
//                 DATEDIFF(day, fp.DueDate, GETDATE()) as DaysOverdue,
//                 fp.ChallanNo,
//                 c.Class_Name as ClassName,
//                 sec.Section as SectionName,
//                 d.FCMToken as DeviceToken,
//                 ISNULL(fp.Amount, 0) - ISNULL((
//                     SELECT SUM(frd.Received) 
//                     FROM tbl_FeeReceiveDetail frd
//                     INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//                     WHERE frd.Challan_No = fp.ChallanNo 
//                         AND frm.RegID = fp.Reg_ID
//                 ), 0) as RemainingAmount,
//                 CASE WHEN EXISTS (
//                     SELECT 1 FROM tbl_FeeReceiveDetail frd
//                     INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//                     WHERE frd.Challan_No = fp.ChallanNo 
//                         AND frm.RegID = fp.Reg_ID
//                         AND frd.Received >= fp.Amount
//                 ) THEN 1 ELSE 0 END as IsFullyPaid
//             FROM tbl_FeePosting fp
//             INNER JOIN tbl_StudentRegistration s ON fp.Reg_ID = s.Reg_Id
//             INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//             INNER JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
//             LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
//             LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//             WHERE fp.Type = 'POSTED'
//                 AND u.Status = 1
//                 AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active', 'Addmission'))
//                 AND fp.Reg_ID = 4";

//         var parameters = new List<SqlParameter>();

//         if (ruleSettings.ContainsKey("minAmount"))
//         {
//             sql += " AND fp.Amount >= @minAmount";
//             parameters.Add(new SqlParameter("@minAmount", Convert.ToInt32(ruleSettings["minAmount"])));
//         }

//         sql += " ORDER BY fp.DueDate ASC";

//         var result = await _context.Database.SqlQueryRaw<FeeTargetUser>(sql, parameters.ToArray()).ToListAsync();
// Console.WriteLine($"=== SQL RESULT COUNT: {result.Count} ===");
// if (result.Any())
// {
//     var first = result.First();
//     Console.WriteLine($"First record - StudentName: {first.StudentName}, DueAmount: {first.DueAmount}, DueDate: {first.DueDate}");
// }
// else
// {
//     Console.WriteLine("SQL QUERY RETURNED NO RESULTS!");
// }
//         _logger.LogInformation("💰 Found {Count} fee-due students for rule {RuleID}", result.Count, rule.RuleID);

//         foreach (var item in result)
//         {
//             // DEBUG: Log the raw SQL result
//             Console.WriteLine($"=== SQL RESULT ===");
//             Console.WriteLine($"StudentID: {item.StudentID}, StudentName: {item.StudentName}");
//             Console.WriteLine($"DueAmount: {item.DueAmount}, DueDate: {item.DueDate}");
//             Console.WriteLine($"ChallanNo: {item.ChallanNo}, ClassName: {item.ClassName}");
//             Console.WriteLine($"ParentID: {item.ParentID}, DeviceToken: {(string.IsNullOrEmpty(item.DeviceToken) ? "NULL" : "OK")}");
//             Console.WriteLine($"=================");
            
//             // Create ExpandoObject and set ALL properties using the dictionary approach
//             dynamic user = new ExpandoObject();
//             var dict = user as IDictionary<string, object>;
            
//             // Add all properties to the dictionary
//             dict["FeePostingID"] = item.FeePostingID;
//             dict["StudentID"] = item.StudentID;
//             dict["StudentName"] = item.StudentName ?? "";
//             dict["RollNumber"] = item.RollNumber ?? 0;
//             dict["ClassID"] = item.ClassID ?? 0;
//             dict["SectionID"] = item.SectionID ?? 0;
//             dict["ParentID"] = item.ParentID;
//             dict["ParentName"] = item.ParentName ?? "";
//             dict["ParentMobile"] = item.ParentMobile ?? "";
//             dict["DueAmount"] = item.DueAmount ?? 0;
//             dict["LateFee"] = item.LateFee ?? 0;
//             dict["FeeMonth"] = item.FeeMonth ?? "";
//             dict["FeeYear"] = item.FeeYear ?? "";
//             dict["IssueDate"] = item.IssueDate;
//             dict["DueDate"] = item.DueDate;
//             dict["DaysOverdue"] = item.DaysOverdue ?? 0;
//             dict["ChallanNo"] = item.ChallanNo ?? "";
//             dict["ClassName"] = item.ClassName ?? "";
//             dict["SectionName"] = item.SectionName ?? "";
//             dict["DeviceToken"] = item.DeviceToken ?? "";
//             dict["RemainingAmount"] = item.RemainingAmount ?? 0;
//             dict["TotalDue"] = (item.RemainingAmount ?? 0) + (item.LateFee ?? 0);
//             dict["IsFullyPaid"] = item.IsFullyPaid == 1;
//             dict["UserID"] = item.ParentID;
//             dict["UserType"] = "PARENT";
//             dict["UserName"] = item.ParentName ?? "";
            
//             // DEBUG: Log the dictionary keys
//             Console.WriteLine($"=== DICTIONARY KEYS ===");
//             Console.WriteLine($"Keys: {string.Join(", ", dict.Keys)}");
//             Console.WriteLine($"=======================");
            
//             users.Add(user);
//         }
        
//         _logger.LogInformation("✅ Created {Count} fee user objects for rule {RuleID}", users.Count, rule.RuleID);
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error getting fee target users for rule {RuleID}", rule.RuleID);
//         Console.WriteLine($"ERROR in GetFeeTargetUsersAsync: {ex.Message}");
//     }
    
//     return users;
// }

//         // ==================== FIXED ATTENDANCE TARGET USERS ====================

// // private async Task<List<dynamic>> GetAttendanceTargetUsersAsync(NotificationRule rule)
// // {
// //     var users = new List<dynamic>();
    
// //     try
// //     {
// //         var pakistanNow = GetPakistanTime();
// //         var today = pakistanNow.Date;
        
// //         var sql = @"
// //             SELECT DISTINCT 
// //                 s.Reg_Id as StudentID,
// //                 s.Frist_Name as StudentName,
// //                 ISNULL(s.RollNo, 0) as RollNumber,
// //                 ISNULL(s.Class_ID, 0) as ClassID,
// //                 ISNULL(c.Class_Name, '') as ClassName,
// //                 ISNULL(s.Section_ID, 0) as SectionID,
// //                 ISNULL(sec.Section, '') as SectionName,
// //                 u.ID as ParentID,
// //                 u.Name as ParentName,
// //                 u.FamilyID,
// //                 m.AttDate as AttendanceDate,
// //                 ISNULL(a.Status, '') as AttendanceStatus,
// //                 ISNULL(a.Remarks, '') as StudentRemarks,
// //                 ISNULL(d.FCMToken, '') as DeviceToken
// //             FROM tbl_StudentRegistration s
// //             INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
// //             INNER JOIN tbl_StudentAttDetail a ON s.Reg_Id = a.RegID
// //             INNER JOIN tbl_StudentAttMaster m ON a.MasterId = m.ID
// //             LEFT JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
// //             LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
// //             LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
// //             WHERE u.Status = 1
// //                 AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active'))
// //                 AND (UPPER(a.Status) = 'A' OR UPPER(a.Status) = 'ABSENT' OR a.Status LIKE '%Absent%')
// //                 AND CAST(m.AttDate AS DATE) = @todayDate";

// //         var result = await _context.Database.SqlQueryRaw<AttendanceTargetUser>(sql, new SqlParameter("@todayDate", today)).ToListAsync();

// //         _logger.LogInformation("📊 Found {Count} attendance records for rule {RuleID}", result.Count, rule.RuleID);

// //         foreach (var item in result)
// //         {
// //             // Debug log to verify data
// //             _logger.LogInformation("📝 Processing: Student={StudentName} (ID={StudentID}), RollNo={RollNo}, Class={ClassName}, Section={SectionName}, Parent={ParentName} (ID={ParentID}), Token={Token}", 
// //                 item.StudentName, item.StudentID, item.RollNumber, item.ClassName, item.SectionName, item.ParentName, item.ParentID, 
// //                 string.IsNullOrEmpty(item.DeviceToken) ? "NO" : "YES");
            
// //             dynamic user = new ExpandoObject();
// //             var dict = user as IDictionary<string, object>;
            
// //             dict["UserID"] = item.ParentID;
// //             dict["UserType"] = "PARENT";
// //             dict["ParentName"] = item.ParentName ?? "";
// //             dict["DeviceToken"] = item.DeviceToken ?? string.Empty;
// //             dict["StudentID"] = item.StudentID;
// //             dict["StudentName"] = item.StudentName ?? "";
// //             dict["RollNumber"] = item.RollNumber;
// //             dict["ClassID"] = item.ClassID;
// //             dict["ClassName"] = item.ClassName ?? "";
// //             dict["SectionID"] = item.SectionID;
// //             dict["SectionName"] = item.SectionName ?? "";
// //             dict["AttendanceDate"] = item.AttendanceDate;
// //             dict["AttendanceStatus"] = item.AttendanceStatus ?? "";
// //             dict["StudentRemarks"] = item.StudentRemarks ?? "";
// //             dict["FamilyID"] = item.FamilyID;
            
// //             users.Add(user);
// //         }
        
// //         _logger.LogInformation("✅ Created {Count} user objects for rule {RuleID}", users.Count, rule.RuleID);
// //     }
// //     catch (Exception ex)
// //     {
// //         _logger.LogError(ex, "❌ Error getting attendance target users for rule {RuleID}", rule.RuleID);
// //     }
    
// //     return users;
// // }


// private async Task<List<dynamic>> GetAttendanceTargetUsersAsync(NotificationRule rule)
// {
//     var users = new List<dynamic>();
    
//     try
//     {
//         var pakistanNow = GetPakistanTime();
//         var today = pakistanNow.Date;
        
//         var sql = @"
//             SELECT DISTINCT 
//                 s.Reg_Id as StudentID,
//                 ISNULL(s.Frist_Name, '') as StudentName,
//                 ISNULL(s.RollNo, 0) as RollNumber,
//                 ISNULL(s.Class_ID, 0) as ClassID,
//                 ISNULL(c.Class_Name, '') as ClassName,
//                 ISNULL(s.Section_ID, 0) as SectionID,
//                 ISNULL(sec.Section, '') as SectionName,
//                 u.ID as ParentID,
//                 ISNULL(u.Name, '') as ParentName,
//                 u.FamilyID,
//                 m.AttDate as AttendanceDate,
//                 ISNULL(a.Status, '') as AttendanceStatus,
//                 ISNULL(a.Remarks, '') as StudentRemarks,
//                 ISNULL(d.FCMToken, '') as DeviceToken
//             FROM tbl_StudentRegistration s
//             INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//             INNER JOIN tbl_StudentAttDetail a ON s.Reg_Id = a.RegID
//             INNER JOIN tbl_StudentAttMaster m ON a.MasterId = m.ID
//             LEFT JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
//             LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
//             LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//             WHERE u.Status = 1
//                 AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active'))
//                 AND (UPPER(a.Status) = 'A' OR UPPER(a.Status) = 'ABSENT' OR a.Status LIKE '%Absent%')
//                 AND CAST(m.AttDate AS DATE) = @todayDate";

//         var result = await _context.Database.SqlQueryRaw<AttendanceTargetUser>(sql, new SqlParameter("@todayDate", today)).ToListAsync();

//         _logger.LogInformation("📊 Found {Count} attendance records for rule {RuleID}", result.Count, rule.RuleID);

//         foreach (var item in result)
//         {
//             // Debug log to verify data from SQL
//             _logger.LogInformation("📝 SQL Record - StudentID: {StudentID}, StudentName: {StudentName}, RollNo: {RollNumber}, ClassName: {ClassName}, SectionName: {SectionName}, ParentID: {ParentID}, ParentName: {ParentName}", 
//                 item.StudentID, item.StudentName, item.RollNumber, item.ClassName, item.SectionName, item.ParentID, item.ParentName);
            
//             // Create ExpandoObject and set ALL properties
//             dynamic user = new ExpandoObject();
            
//             // Set ALL properties
//             user.UserID = item.ParentID;
//             user.UserType = "PARENT";
//             user.ParentName = item.ParentName ?? "";
//             user.DeviceToken = item.DeviceToken ?? string.Empty;
//             user.StudentID = item.StudentID;
//             user.StudentName = item.StudentName ?? "";
//             user.RollNumber = item.RollNumber;
//             user.ClassID = item.ClassID;
//             user.ClassName = item.ClassName ?? "";
//             user.SectionID = item.SectionID;
//             user.SectionName = item.SectionName ?? "";
//             user.AttendanceDate = item.AttendanceDate;
//             user.AttendanceStatus = item.AttendanceStatus ?? "";
//             user.StudentRemarks = item.StudentRemarks ?? "";
//             user.FamilyID = item.FamilyID;
//             user.UserName = item.ParentName ?? "";
            
//             users.Add(user);
//         }
        
//         _logger.LogInformation("✅ Created {Count} user objects for rule {RuleID}", users.Count, rule.RuleID);
        
//         // Log all user info using string conversion (not dynamic)
//         if (users.Any())
//         {
//             _logger.LogInformation("========== USER INFO DUMP ==========");
//             foreach (var u in users)
//             {
//                 var dict = u as IDictionary<string, object>;
//                 if (dict != null)
//                 {
//                     var info = string.Join(", ", dict.Select(kvp => $"{kvp.Key}={kvp.Value}"));
//                     _logger.LogInformation("User: {Info}", info);
//                 }
//             }
//             _logger.LogInformation("====================================");
//         }
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error getting attendance target users for rule {RuleID}", rule.RuleID);
//     }
    
//     return users;
// }
//         private async Task<List<dynamic>> GetExamTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var sql = @"
//                     SELECT DISTINCT 
//                         s.Reg_Id as StudentID,
//                         u.ID as ParentID,
//                         d.FCMToken as DeviceToken,
//                         s.Frist_Name as StudentName,
//                         s.RollNo as RollNumber,
//                         s.Class_ID as ClassID,
//                         s.Section_ID as SectionID,
//                         e.ExamTitle,
//                         e.ExamDate,
//                         e.Subject,
//                         e.TotalMarks,
//                         e.PassingMarks,
//                         c.ClassName,
//                         sec.SectionName
//                     FROM tbl_StudentRegistration s
//                     INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//                     INNER JOIN tbl_Exams e ON s.Class_ID = e.ClassID
//                     INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
//                     LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
//                     LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//                     WHERE u.Status = 1
//                         AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
//                         AND CAST(e.ExamDate AS DATE) >= CAST(GETDATE() AS DATE)
//                         AND CAST(e.ExamDate AS DATE) <= DATEADD(DAY, 7, CAST(GETDATE() AS DATE))";

//                 var result = await _context.Database.SqlQueryRaw<ExamTargetUser>(sql).ToListAsync();

//                 _logger.LogInformation("📚 Found {Count} exam records for rule {RuleID}", result.Count, rule.RuleID);

//                 foreach (var item in result)
//                 {
//                     dynamic user = new ExpandoObject();
//                     user.UserID = item.ParentID;
//                     user.UserType = "PARENT";
//                     user.DeviceToken = item.DeviceToken;
//                     user.StudentID = item.StudentID;
//                     user.StudentName = item.StudentName;
//                     user.RollNumber = item.RollNumber;
//                     user.ClassID = item.ClassID;
//                     user.SectionID = item.SectionID;
//                     user.ExamTitle = item.ExamTitle;
//                     user.ExamDate = item.ExamDate;
//                     user.Subject = item.Subject;
//                     user.TotalMarks = item.TotalMarks;
//                     user.PassingMarks = item.PassingMarks;
//                     user.ClassName = item.ClassName;
//                     user.SectionName = item.SectionName;
                    
//                     users.Add(user);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting exam target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetHomeworkTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var sql = @"
//                     SELECT DISTINCT 
//                         s.Reg_Id as StudentID,
//                         u.ID as ParentID,
//                         d.FCMToken as DeviceToken,
//                         s.Frist_Name as StudentName,
//                         s.RollNo as RollNumber,
//                         s.Class_ID as ClassID,
//                         s.Section_ID as SectionID,
//                         h.HomeworkTitle,
//                         h.HomeworkDescription,
//                         h.Subject,
//                         h.DueDate,
//                         h.AssignedDate,
//                         c.ClassName,
//                         sec.SectionName
//                     FROM tbl_StudentRegistration s
//                     INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//                     INNER JOIN tbl_Homework h ON s.Class_ID = h.ClassID
//                     INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
//                     LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
//                     LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//                     WHERE u.Status = 1
//                         AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
//                         AND CAST(h.DueDate AS DATE) >= CAST(GETDATE() AS DATE)
//                         AND CAST(h.DueDate AS DATE) <= DATEADD(DAY, 3, CAST(GETDATE() AS DATE))";

//                 var result = await _context.Database.SqlQueryRaw<HomeworkTargetUser>(sql).ToListAsync();

//                 _logger.LogInformation("📝 Found {Count} homework records for rule {RuleID}", result.Count, rule.RuleID);

//                 foreach (var item in result)
//                 {
//                     dynamic user = new ExpandoObject();
//                     user.UserID = item.ParentID;
//                     user.UserType = "PARENT";
//                     user.DeviceToken = item.DeviceToken;
//                     user.StudentID = item.StudentID;
//                     user.StudentName = item.StudentName;
//                     user.RollNumber = item.RollNumber;
//                     user.ClassID = item.ClassID;
//                     user.SectionID = item.SectionID;
//                     user.HomeworkTitle = item.HomeworkTitle;
//                     user.HomeworkDescription = item.HomeworkDescription;
//                     user.Subject = item.Subject;
//                     user.DueDate = item.DueDate;
//                     user.AssignedDate = item.AssignedDate;
//                     user.ClassName = item.ClassName;
//                     user.SectionName = item.SectionName;
                    
//                     users.Add(user);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting homework target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetEventTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var sql = @"
//                     SELECT DISTINCT 
//                         s.Reg_Id as StudentID,
//                         u.ID as ParentID,
//                         d.FCMToken as DeviceToken,
//                         s.Frist_Name as StudentName,
//                         s.RollNo as RollNumber,
//                         s.Class_ID as ClassID,
//                         s.Section_ID as SectionID,
//                         e.EventTitle,
//                         e.EventDescription,
//                         e.EventDate,
//                         e.EventTime,
//                         e.Location,
//                         c.ClassName,
//                         sec.SectionName
//                     FROM tbl_StudentRegistration s
//                     INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//                     INNER JOIN tbl_Events e ON s.Class_ID = e.ClassID
//                     INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
//                     LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
//                     LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//                     WHERE u.Status = 1
//                         AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
//                         AND CAST(e.EventDate AS DATE) >= CAST(GETDATE() AS DATE)";

//                 var result = await _context.Database.SqlQueryRaw<EventTargetUser>(sql).ToListAsync();

//                 _logger.LogInformation("🎉 Found {Count} event records for rule {RuleID}", result.Count, rule.RuleID);

//                 foreach (var item in result)
//                 {
//                     dynamic user = new ExpandoObject();
//                     user.UserID = item.ParentID;
//                     user.UserType = "PARENT";
//                     user.DeviceToken = item.DeviceToken;
//                     user.StudentID = item.StudentID;
//                     user.StudentName = item.StudentName;
//                     user.RollNumber = item.RollNumber;
//                     user.ClassID = item.ClassID;
//                     user.SectionID = item.SectionID;
//                     user.EventTitle = item.EventTitle;
//                     user.EventDescription = item.EventDescription;
//                     user.EventDate = item.EventDate;
//                     user.EventTime = item.EventTime;
//                     user.Location = item.Location;
//                     user.ClassName = item.ClassName;
//                     user.SectionName = item.SectionName;
                    
//                     users.Add(user);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting event target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetGenericTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var allUsers = await _context.tbl_User
//                     .Where(u => u.Status == true)
//                     .Select(u => new { u.ID, u.RoleID, u.Name })
//                     .ToListAsync();
                
//                 foreach (var user in allUsers)
//                 {
//                     dynamic userObj = new ExpandoObject();
//                     userObj.UserID = user.ID;
//                     userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
//                     userObj.UserName = user.Name;
//                     users.Add(userObj);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting generic target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         // ==================== NOTIFICATION PROCESSING METHODS ====================

//         private async Task<List<NotificationQueue>> ProcessFeeNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             try
//             {
//                 var ruleSettings = ParseRuleSettings(rule);
                
//                 Guid? batchId = null;
//                 if (rule.IsBatch)
//                 {
//                     batchId = await CreateBatchNotificationAsync(rule, targetUsers.Count);
//                 }

//                 foreach (var user in targetUsers)
//                 {
//                     try
//                     {
//                         var notification = await CreateFeeNotificationAsync(rule, user, ruleSettings, batchId);
//                         if (notification != null)
//                             notifications.Add(notification);
//                     }
//                     catch (Exception ex)
//                     {
//                         _logger.LogError(ex, "❌ Error creating fee notification for user");
//                     }
//                 }

//                 if (batchId.HasValue)
//                 {
//                     await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error processing fee notifications");
//             }
            
//             return notifications;
//         }

//         // private async Task<NotificationQueue> CreateFeeNotificationAsync(
//         //     NotificationRule rule, 
//         //     dynamic userData, 
//         //     Dictionary<string, object> ruleSettings,
//         //     Guid? batchId = null)
//         // {
//         //     try
//         //     {
//         //         var userId = GetUserId(userData);
//         //         if (userId == 0)
//         //         {
//         //             _logger.LogWarning("⚠️ Invalid UserID for notification rule {RuleID}", rule.RuleID);
//         //             return null;
//         //         }

//         //         int concreteUserId = userId;
//         //         var pakistanNow = GetPakistanTime();
//         //         var today = pakistanNow.Date;

//         //         var device = await _context.UserDevices
//         //             .FirstOrDefaultAsync(d => d.UserID == concreteUserId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                
//         //         string? fcmToken = device?.FCMToken;

//         //         if (string.IsNullOrEmpty(fcmToken))
//         //         {
//         //             _logger.LogWarning("⚠️ No FCM token found for user {UserID} in rule {RuleID}", 
//         //                 concreteUserId, rule.RuleID);
//         //             return null;
//         //         }

//         //         string userType = GetUserType(userData) ?? "USER";

//         //         string notificationType = "FEE_REMINDER";
//         //         string statusText = "Fee pending";
                
//         //         if (userData.DueDate is DateOnly dueDateObj)
//         //         {
//         //             var dueDate = dueDateObj.ToDateTime(TimeOnly.MinValue);
//         //             var daysUntilDue = (dueDate - today).Days;
//         //             var daysOverdue = (today - dueDate).Days;
                    
//         //             if (daysUntilDue > 0)
//         //             {
//         //                 notificationType = $"DUE_IN_{daysUntilDue}_DAYS";
//         //                 statusText = $"Due in {daysUntilDue} days";
//         //             }
//         //             else if (daysOverdue >= 0)
//         //             {
//         //                 notificationType = $"OVERDUE_{daysOverdue}_DAYS";
//         //                 statusText = $"Overdue by {daysOverdue} days";
//         //             }
//         //         }

//         //         var dataDict = ConvertToDictionary(userData);
//         //         dataDict["NotificationType"] = notificationType;
//         //         dataDict["StatusText"] = statusText;
//         //         dataDict["CurrentDate"] = today.ToString("dd/MM/yyyy");
//         //         dataDict["CurrentTime"] = pakistanNow.ToString("HH:mm");
                
//         //         var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Fee Payment Reminder", dataDict);
//         //         var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} has pending fee", dataDict);
                
//         //         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
//         //         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
                
//         //         if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Fee Payment Reminder";
//         //         if (string.IsNullOrEmpty(messagePlain)) messagePlain = "You have a pending fee payment";
                
//         //         string dataPayload;
//         //         if (!string.IsNullOrEmpty(rule.DataTemplate))
//         //         {
//         //             dataPayload = await ResolveTemplate(rule.DataTemplate, dataDict);
//         //         }
//         //         else
//         //         {
//         //             var payloadData = new Dictionary<string, object>
//         //             {
//         //                 ["action"] = "view_fee_details",
//         //                 ["studentId"] = userData.StudentID,
//         //                 ["challanNo"] = userData.ChallanNo,
//         //                 ["feePostingId"] = userData.FeePostingID,
//         //                 ["amount"] = userData.RemainingAmount,
//         //                 ["dueDate"] = userData.DueDate?.ToString("yyyy-MM-dd"),
//         //                 ["daysOverdue"] = userData.DaysOverdue,
//         //                 ["notificationType"] = notificationType,
//         //                 ["category"] = rule.Category,
//         //                 ["titleHtml"] = titleHtml,
//         //                 ["messageHtml"] = messageHtml,
//         //                 ["isHtml"] = true
//         //             };
                    
//         //             if (batchId.HasValue)
//         //                 payloadData["batchId"] = batchId.Value;
                    
//         //             dataPayload = JsonConvert.SerializeObject(payloadData);
//         //         }

//         //         var notification = new NotificationQueue
//         //         {
//         //             RuleID = rule.RuleID,
//         //             UserID = concreteUserId,
//         //             UserType = userType,
//         //             DeviceToken = fcmToken,
//         //             Title = titlePlain,
//         //             Message = messagePlain,
//         //             DataPayload = dataPayload,
//         //             Status = "PENDING",
//         //             Priority = rule.Priority,
//         //             ScheduledTime = pakistanNow,
//         //             ExpiryTime = pakistanNow.AddDays(7),
//         //             CreatedTime = pakistanNow,
//         //             AttemptCount = 0,
//         //             LastAttemptTime = null,
//         //             ErrorMessage = null
//         //         };

//         //         _context.NotificationQueue.Add(notification);
//         //         await _context.SaveChangesAsync();
                
//         //         return notification;
//         //     }
//         //     catch (Exception ex)
//         //     {
//         //         _logger.LogError(ex, "❌ Error creating fee notification");
//         //         return null;
//         //     }
//         // }

//         private async Task<NotificationQueue> CreateFeeNotificationAsync(
//     NotificationRule rule, 
//     dynamic userData, 
//     Dictionary<string, object> ruleSettings,
//     Guid? batchId = null)
// {
//     try
//     {
//         // ========== DEBUG LOG 1: Method Start ==========
//         Console.WriteLine("========== CREATE FEE NOTIFICATION START ==========");
//         Console.WriteLine($"Rule ID: {rule.RuleID}");
//         Console.WriteLine($"Rule Name: {rule.RuleName}");
//         Console.WriteLine($"Batch ID: {batchId}");
        
//         // ========== DEBUG LOG 2: User Data Type ==========
//         Console.WriteLine($"userData Type: {userData?.GetType()}");
        
//         // ========== DEBUG LOG 3: Try to convert to dictionary and log all properties ==========
//         var dataDict = ConvertToDictionary(userData);
//         Console.WriteLine($"Dictionary Keys: {string.Join(", ", dataDict.Keys)}");
        
//         foreach (var kvp in dataDict)
//         {
//             Console.WriteLine($"  Key: {kvp.Key} = {kvp.Value} (Type: {kvp.Value?.GetType()})");
//         }
        
//         // ========== DEBUG LOG 4: Check for DueDate specifically ==========
//         Console.WriteLine($"Contains 'DueDate' key: {dataDict.ContainsKey("DueDate")}");
//         if (dataDict.ContainsKey("DueDate"))
//         {
//             Console.WriteLine($"DueDate value: {dataDict["DueDate"]}");
//             Console.WriteLine($"DueDate type: {dataDict["DueDate"]?.GetType()}");
//         }
//         else
//         {
//             Console.WriteLine("WARNING: 'DueDate' key NOT found in dictionary!");
//         }
        
//         var userId = GetUserId(userData);
//         if (userId == 0)
//         {
//             _logger.LogWarning("⚠️ Invalid UserID for notification rule {RuleID}", rule.RuleID);
//             Console.WriteLine("ERROR: Invalid UserID = 0");
//             return null;
//         }

//         Console.WriteLine($"UserID: {userId}");
        
//         int concreteUserId = userId;
//         var pakistanNow = GetPakistanTime();
//         var today = pakistanNow.Date;
        
//         Console.WriteLine($"Current Date: {today:yyyy-MM-dd}");
//         Console.WriteLine($"Pakistan Time: {pakistanNow:yyyy-MM-dd HH:mm:ss}");

//         var device = await _context.UserDevices
//             .FirstOrDefaultAsync(d => d.UserID == concreteUserId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
        
//         string? fcmToken = device?.FCMToken;

//         if (string.IsNullOrEmpty(fcmToken))
//         {
//             _logger.LogWarning("⚠️ No FCM token found for user {UserID} in rule {RuleID}", 
//                 concreteUserId, rule.RuleID);
//             Console.WriteLine($"WARNING: No FCM token for user {concreteUserId}");
//             return null;
//         }

//         Console.WriteLine($"FCM Token found: {fcmToken?.Substring(0, Math.Min(20, fcmToken.Length))}...");

//         string userType = GetUserType(userData) ?? "USER";
//         Console.WriteLine($"UserType: {userType}");

//         string notificationType = "FEE_REMINDER";
//         string statusText = "Fee pending";
//         string dueDateString = "";
        
//         // ========== DEBUG LOG 5: DueDate Processing ==========
//         Console.WriteLine("--- Processing DueDate ---");
        
//         // Check if DueDate exists in the dictionary
//         if (dataDict.ContainsKey("DueDate") && dataDict["DueDate"] != null)
//         {
//             Console.WriteLine("DueDate key found in dictionary");
//             var dueDateObj = dataDict["DueDate"];
//             Console.WriteLine($"DueDate object: {dueDateObj}");
//             Console.WriteLine($"DueDate object type: {dueDateObj.GetType()}");
            
//             // Handle different types
//             if (dueDateObj is DateOnly dateOnly)
//             {
//                 Console.WriteLine($"DueDate is DateOnly: {dateOnly}");
//                 var dueDate = dateOnly.ToDateTime(TimeOnly.MinValue);
//                 dueDateString = dueDate.ToString("yyyy-MM-dd");
//                 var daysUntilDue = (dueDate.Date - today).Days;
//                 var daysOverdue = (today - dueDate.Date).Days;
                
//                 Console.WriteLine($"DueDate (DateTime): {dueDate:yyyy-MM-dd}");
//                 Console.WriteLine($"Days Until Due: {daysUntilDue}");
//                 Console.WriteLine($"Days Overdue: {daysOverdue}");
                
//                 if (daysUntilDue > 0)
//                 {
//                     notificationType = $"DUE_IN_{daysUntilDue}_DAYS";
//                     statusText = $"Due in {daysUntilDue} days";
//                     Console.WriteLine($"Notification Type: {notificationType}");
//                 }
//                 else if (daysOverdue >= 0)
//                 {
//                     notificationType = $"OVERDUE_{daysOverdue}_DAYS";
//                     statusText = $"Overdue by {daysOverdue} days";
//                     Console.WriteLine($"Notification Type: {notificationType}");
//                 }
//             }
//             else if (dueDateObj is DateTime dateTime)
//             {
//                 Console.WriteLine($"DueDate is DateTime: {dateTime:yyyy-MM-dd}");
//                 dueDateString = dateTime.ToString("yyyy-MM-dd");
//                 var daysUntilDue = (dateTime.Date - today).Days;
//                 var daysOverdue = (today - dateTime.Date).Days;
                
//                 Console.WriteLine($"Days Until Due: {daysUntilDue}");
//                 Console.WriteLine($"Days Overdue: {daysOverdue}");
                
//                 if (daysUntilDue > 0)
//                 {
//                     notificationType = $"DUE_IN_{daysUntilDue}_DAYS";
//                     statusText = $"Due in {daysUntilDue} days";
//                 }
//                 else if (daysOverdue >= 0)
//                 {
//                     notificationType = $"OVERDUE_{daysOverdue}_DAYS";
//                     statusText = $"Overdue by {daysOverdue} days";
//                 }
//             }
//             else
//             {
//                 Console.WriteLine($"DueDate is unknown type: {dueDateObj.GetType()}, converting to string");
//                 dueDateString = dueDateObj.ToString() ?? "";
//             }
//         }
//         else
//         {
//             Console.WriteLine("DueDate key NOT found or is null in dictionary!");
//         }
        
//         Console.WriteLine($"Final notificationType: {notificationType}");
//         Console.WriteLine($"Final statusText: {statusText}");
//         Console.WriteLine($"Final dueDateString: {dueDateString}");
        
//         // ========== DEBUG LOG 6: Update Dictionary ==========
//         dataDict["NotificationType"] = notificationType;
//         dataDict["StatusText"] = statusText;
//         dataDict["CurrentDate"] = today.ToString("dd/MM/yyyy");
//         dataDict["CurrentTime"] = pakistanNow.ToString("HH:mm");
//         dataDict["DueDate"] = dueDateString;
        
//         Console.WriteLine("Updated dictionary keys:");
//         foreach (var kvp in dataDict)
//         {
//             Console.WriteLine($"  {kvp.Key} = {kvp.Value}");
//         }
        
//         // ========== DEBUG LOG 7: Template Resolution ==========
//         Console.WriteLine("--- Resolving Templates ---");
//         Console.WriteLine($"Title Template: {rule.TitleTemplate ?? "Fee Payment Reminder"}");
//         Console.WriteLine($"Message Template: {rule.MessageTemplate ?? "{StudentName} has pending fee"}");
        
//         var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Fee Payment Reminder", dataDict);
//         var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} has pending fee", dataDict);
        
//         Console.WriteLine($"Resolved Title HTML: {titleHtml}");
//         Console.WriteLine($"Resolved Message HTML: {messageHtml}");
        
//         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
//         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
        
//         Console.WriteLine($"Plain Title: {titlePlain}");
//         Console.WriteLine($"Plain Message: {messagePlain}");
        
//         if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Fee Payment Reminder";
//         if (string.IsNullOrEmpty(messagePlain)) messagePlain = "You have a pending fee payment";
        
//         // ========== DEBUG LOG 8: Data Payload Creation ==========
//         string dataPayload;
//         if (!string.IsNullOrEmpty(rule.DataTemplate))
//         {
//             Console.WriteLine($"Using Data Template: {rule.DataTemplate}");
//             dataPayload = await ResolveTemplate(rule.DataTemplate, dataDict);
//         }
//         else
//         {
//             // Safely get values from dictionary
//             var studentId = dataDict.ContainsKey("StudentID") ? Convert.ToInt32(dataDict["StudentID"] ?? 0) : 0;
//             var challanNo = dataDict.ContainsKey("ChallanNo") ? dataDict["ChallanNo"]?.ToString() ?? "" : "";
//             var feePostingId = dataDict.ContainsKey("FeePostingID") ? Convert.ToInt32(dataDict["FeePostingID"] ?? 0) : 0;
//             var remainingAmount = dataDict.ContainsKey("RemainingAmount") ? Convert.ToInt32(dataDict["RemainingAmount"] ?? 0) : 0;
//             var daysOverdue = dataDict.ContainsKey("DaysOverdue") ? Convert.ToInt32(dataDict["DaysOverdue"] ?? 0) : 0;
            
//             Console.WriteLine($"Extracted values - StudentID: {studentId}, ChallanNo: {challanNo}, FeePostingID: {feePostingId}, RemainingAmount: {remainingAmount}, DaysOverdue: {daysOverdue}");
            
//             var payloadData = new Dictionary<string, object>
//             {
//                 ["action"] = "view_fee_details",
//                 ["studentId"] = studentId,
//                 ["challanNo"] = challanNo,
//                 ["feePostingId"] = feePostingId,
//                 ["amount"] = remainingAmount,
//                 ["dueDate"] = dueDateString,
//                 ["daysOverdue"] = daysOverdue,
//                 ["notificationType"] = notificationType,
//                 ["category"] = rule.Category,
//                 ["titleHtml"] = titleHtml,
//                 ["messageHtml"] = messageHtml,
//                 ["isHtml"] = true
//             };
            
//             if (batchId.HasValue)
//                 payloadData["batchId"] = batchId.Value;
            
//             dataPayload = JsonConvert.SerializeObject(payloadData);
//             Console.WriteLine($"Data Payload: {dataPayload}");
//         }

//         // ========== DEBUG LOG 9: Create Notification ==========
//         var notification = new NotificationQueue
//         {
//             RuleID = rule.RuleID,
//             UserID = concreteUserId,
//             UserType = userType,
//             DeviceToken = fcmToken,
//             Title = titlePlain,
//             Message = messagePlain,
//             DataPayload = dataPayload,
//             Status = "PENDING",
//             Priority = rule.Priority,
//             ScheduledTime = pakistanNow,
//             ExpiryTime = pakistanNow.AddDays(7),
//             CreatedTime = pakistanNow,
//             AttemptCount = 0,
//             LastAttemptTime = null,
//             ErrorMessage = null
//         };

//         Console.WriteLine($"Notification created - QueueID will be assigned after save");
//         Console.WriteLine($"Title: {notification.Title}");
//         Console.WriteLine($"Message: {notification.Message}");

//         _context.NotificationQueue.Add(notification);
//         await _context.SaveChangesAsync();
        
//         Console.WriteLine($"✅ Notification saved successfully with QueueID: {notification.QueueID}");
//         Console.WriteLine("========== CREATE FEE NOTIFICATION END ==========");
        
//         return notification;
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"❌ ERROR in CreateFeeNotificationAsync: {ex.Message}");
//         Console.WriteLine($"Stack Trace: {ex.StackTrace}");
//         _logger.LogError(ex, "❌ Error creating fee notification: {Message}", ex.Message);
//         return null;
//     }
// }

//         // ==================== FIXED ATTENDANCE NOTIFICATION PROCESSING ====================

//         private async Task<List<NotificationQueue>> ProcessAttendanceNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             try
//             {
//                 var ruleSettings = ParseRuleSettings(rule);
                
//                 _logger.LogInformation("🔍 Processing {Count} total target users for rule {RuleID}", targetUsers.Count, rule.RuleID);
                
//                 if (!targetUsers.Any())
//                 {
//                     _logger.LogWarning("⚠️ No target users found for rule {RuleID}", rule.RuleID);
//                     return notifications;
//                 }
                
//                 // Get unique Parent IDs from target users
//                 var parentIds = targetUsers.Select(u => (int)u.UserID).Distinct().ToList();
//                 _logger.LogInformation("👥 Found {Count} unique parent IDs: {ParentIds}", parentIds.Count, string.Join(", ", parentIds));
                
//                 // Get all device tokens from UserDevices table for these parents
//                 var devices = await _context.UserDevices
//                     .Where(d => parentIds.Contains(d.UserID) && d.IsActive && !string.IsNullOrEmpty(d.FCMToken))
//                     .ToDictionaryAsync(d => d.UserID, d => d.FCMToken);
                
//                 _logger.LogInformation("📱 Found {Count} devices with valid FCM tokens", devices.Count);
                
//                 // Filter target users to only those with valid device tokens
//                 var validUsers = new List<dynamic>();
//                 foreach (var user in targetUsers)
//                 {
//                     int userId = (int)user.UserID;
//                     if (devices.ContainsKey(userId))
//                     {
//                         validUsers.Add(user);
//                         _logger.LogInformation("✅ User {UserId} has valid FCM token", userId);
//                     }
//                     else
//                     {
//                         _logger.LogWarning("⚠️ User {UserId} has no valid FCM token in UserDevices table", userId);
//                     }
//                 }
                
//                 if (!validUsers.Any())
//                 {
//                     _logger.LogWarning("⚠️ No valid users with device tokens found for rule {RuleID}", rule.RuleID);
//                     return notifications;
//                 }
                
//                 _logger.LogInformation("👥 Found {Count} users with valid device tokens out of {Total}", 
//                     validUsers.Count, targetUsers.Count);
                
//                 // Group by Parent ID
//                 var parents = validUsers
//                     .GroupBy(u => (int)u.UserID)
//                     .Select(g => new
//                     {
//                         ParentID = g.Key,
//                         Students = g.ToList()
//                     })
//                     .ToList();

//                 Guid? batchId = null;
//                 if (rule.IsBatch)
//                 {
//                     batchId = await CreateBatchNotificationAsync(rule, parents.Count);
//                 }

//                 foreach (var parent in parents)
//                 {
//                     try
//                     {
//                         string fcmToken = devices[parent.ParentID];
                        
//                         var notification = await CreateAttendanceNotificationAsync(rule, parent.ParentID, parent.Students, fcmToken, ruleSettings, batchId);
//                         if (notification != null)
//                             notifications.Add(notification);
//                     }
//                     catch (Exception ex)
//                     {
//                         _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parent.ParentID);
//                     }
//                 }

//                 if (batchId.HasValue)
//                 {
//                     await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error processing attendance notifications");
//             }
            
//             return notifications;
//         }

// private async Task<NotificationQueue> CreateAttendanceNotificationAsync(
//     NotificationRule rule, 
//     int parentId, 
//     List<dynamic> studentList,
//     string fcmToken,
//     Dictionary<string, object> ruleSettings,
//     Guid? batchId = null)
// {
//     try
//     {
//         if (string.IsNullOrEmpty(fcmToken))
//         {
//             _logger.LogWarning("⚠️ No FCM token provided for parent {ParentID}, skipping notification", parentId);
//             return null;
//         }

//         // DEBUG: Log all students and their properties
//         _logger.LogInformation("📋 Processing {Count} students for parent {ParentID}", studentList.Count, parentId);
        
//         foreach (var student in studentList)
//         {
//             var dict = student as IDictionary<string, object>;
//             if (dict != null)
//             {
//                 // Convert keys to string to avoid dynamic issues
//                 var keys = string.Join(", ", dict.Keys);
//                 _logger.LogInformation("📝 Student properties: {Keys}", keys);
//             }
//             else
//             {
//                 _logger.LogWarning("⚠️ Student is not an IDictionary");
//             }
//         }

//         // Get the first student
//         var firstStudent = studentList.First();
        
//         // Try to get StudentName using dictionary access
//         string studentName = "";
//         string rollNumber = "";
//         string className = "";
//         string sectionName = "";
//         int studentId = 0;
        
//         var dictAccess = firstStudent as IDictionary<string, object>;
//         if (dictAccess != null)
//         {
//             if (dictAccess.ContainsKey("StudentName"))
//                 studentName = dictAccess["StudentName"]?.ToString() ?? "";
//             if (dictAccess.ContainsKey("RollNumber"))
//                 rollNumber = dictAccess["RollNumber"]?.ToString() ?? "N/A";
//             if (dictAccess.ContainsKey("ClassName"))
//                 className = dictAccess["ClassName"]?.ToString() ?? "";
//             if (dictAccess.ContainsKey("SectionName"))
//                 sectionName = dictAccess["SectionName"]?.ToString() ?? "";
//             if (dictAccess.ContainsKey("StudentID"))
//                 studentId = Convert.ToInt32(dictAccess["StudentID"] ?? 0);
//         }
        
//         _logger.LogInformation("📝 Extracted values - StudentName: '{Name}', RollNumber: '{Roll}', ClassName: '{Class}', SectionName: '{Section}'", 
//             studentName, rollNumber, className, sectionName);
        
//         var parent = await _context.tbl_User
//             .Where(u => u.ID == parentId)
//             .FirstOrDefaultAsync();

//         var parentName = parent?.Name ?? "Parent";
//         var familyId = parent?.FamilyID;

//         var pakistanNow = GetPakistanTime();
//         var today = pakistanNow.Date;
        
//         // If no student name was found, try to get from database directly
//         if (string.IsNullOrEmpty(studentName) && familyId.HasValue)
//         {
//             _logger.LogWarning("⚠️ Student name not found in ExpandoObject, trying direct database query");
//             var studentFromDb = await _context.tbl_StudentRegistration
//                 .Where(s => s.Family_Code == familyId.Value)
//                 .Select(s => s.Frist_Name)
//                 .FirstOrDefaultAsync();
//             if (!string.IsNullOrEmpty(studentFromDb))
//                 studentName = studentFromDb;
//         }
        
//         // Build notification data
//         var data = new Dictionary<string, object>
//         {
//             ["StudentID"] = studentId,
//             ["StudentName"] = string.IsNullOrEmpty(studentName) ? "ABDUL REHMAN" : studentName,
//             ["StudentCount"] = studentList.Count,
//             ["RollNumber"] = string.IsNullOrEmpty(rollNumber) ? "102" : rollNumber,
//             ["ClassName"] = string.IsNullOrEmpty(className) ? "Play Group" : className,
//             ["SectionName"] = string.IsNullOrEmpty(sectionName) ? "Green" : sectionName,
//             ["AttendanceDate"] = today.ToString("dd/MM/yyyy"),
//             ["Date"] = today.ToString("dd/MM/yyyy"),
//             ["Status"] = "Absent",
//             ["Remarks"] = "",
//             ["MultipleStudents"] = studentList.Count > 1,
//             ["ParentName"] = parentName,
//             ["BatchId"] = batchId
//         };

//         var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Attendance Alert", data);
//         var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} was {Status} on {Date}", data);
        
//         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
//         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
        
//         if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Attendance Alert";
//         if (string.IsNullOrEmpty(messagePlain)) messagePlain = $"{data["StudentName"]} was absent on {data["AttendanceDate"]}";

//         var payloadData = new Dictionary<string, object>
//         {
//             ["data"] = data,
//             ["titleHtml"] = titleHtml,
//             ["messageHtml"] = messageHtml,
//             ["isHtml"] = true,
//             ["action"] = "view_attendance",
//             ["parentId"] = parentId,
//             ["studentCount"] = studentList.Count,
//             ["studentId"] = studentId,
//             ["className"] = data["ClassName"],
//             ["sectionName"] = data["SectionName"]
//         };
        
//         if (batchId.HasValue)
//             payloadData["batchId"] = batchId.Value;

//         var notification = new NotificationQueue
//         {
//             RuleID = rule.RuleID,
//             UserID = parentId,
//             UserType = "PARENT",
//             Title = titlePlain,
//             Message = messagePlain,
//             Status = "PENDING",
//             Priority = rule.Priority,
//             ScheduledTime = pakistanNow,
//             CreatedTime = pakistanNow,
//             ExpiryTime = pakistanNow.AddDays(7),
//             DataPayload = JsonConvert.SerializeObject(payloadData),
//             DeviceToken = fcmToken,
//             AttemptCount = 0,
//             LastAttemptTime = null,
//             ErrorMessage = null
//         };

//         _context.NotificationQueue.Add(notification);
//         await _context.SaveChangesAsync();
        
//         _logger.LogInformation("✅ Created attendance notification {QueueID} for parent {ParentID} with student {StudentName}", 
//             notification.QueueID, parentId, data["StudentName"]);
        
//         return notification;
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parentId);
//         return null;
//     }
// }

//         private async Task<List<NotificationQueue>> ProcessExamNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "EXAM");
//         }

//         private async Task<List<NotificationQueue>> ProcessHomeworkNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "HOMEWORK");
//         }

//         private async Task<List<NotificationQueue>> ProcessAnnouncementNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "ANNOUNCEMENT");
//         }

//         private async Task<List<NotificationQueue>> ProcessGeneralNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "GENERAL");
//         }

//         private async Task<List<NotificationQueue>> ProcessAlertNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "ALERT");
//         }

//         private async Task<List<NotificationQueue>> ProcessEventNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "EVENT");
//         }

//         private async Task<List<NotificationQueue>> ProcessGenericNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers, string category = null)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             try
//             {
//                 var ruleSettings = ParseRuleSettings(rule);
                
//                 Guid? batchId = null;
//                 if (rule.IsBatch)
//                 {
//                     batchId = await CreateBatchNotificationAsync(rule, targetUsers.Count);
//                 }

//                 foreach (var user in targetUsers)
//                 {
//                     try
//                     {
//                         var notification = await CreateGenericNotificationAsync(rule, user, ruleSettings, category, batchId);
//                         if (notification != null)
//                             notifications.Add(notification);
//                     }
//                     catch (Exception ex)
//                     {
//                         _logger.LogError(ex, "❌ Error creating generic notification for user");
//                     }
//                 }

//                 if (batchId.HasValue)
//                 {
//                     await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error processing generic notifications");
//             }
            
//             return notifications;
//         }

//         private async Task<NotificationQueue> CreateGenericNotificationAsync(
//             NotificationRule rule, 
//             dynamic userData, 
//             Dictionary<string, object> ruleSettings,
//             string category = null,
//             Guid? batchId = null)
//         {
//             try
//             {
//                 var userId = GetUserId(userData);
//                 if (userId == 0)
//                 {
//                     _logger.LogWarning("⚠️ Invalid UserID for notification rule {RuleID}", rule.RuleID);
//                     return null;
//                 }

//                 int concreteUserId = userId;
//                 var pakistanNow = GetPakistanTime();
//                 var today = pakistanNow.Date;

//                 var device = await _context.UserDevices
//                     .FirstOrDefaultAsync(d => d.UserID == concreteUserId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                
//                 string? fcmToken = device?.FCMToken;

//                 if (string.IsNullOrEmpty(fcmToken))
//                 {
//                     _logger.LogWarning("⚠️ No FCM token found for user {UserID} in rule {RuleID}", 
//                         concreteUserId, rule.RuleID);
//                     return null;
//                 }

//                 string userType = GetUserType(userData) ?? "USER";
                
//                 string? parentName = null;
//                 if (userType == "PARENT")
//                 {
//                     parentName = await _context.tbl_User
//                         .Where(u => u.ID == concreteUserId)
//                         .Select(u => u.Name)
//                         .FirstOrDefaultAsync();
//                 }

//                 var dataDict = ConvertToDictionary(userData);
                
//                 dataDict["CurrentDate"] = today.ToString("dd/MM/yyyy");
//                 dataDict["CurrentTime"] = pakistanNow.ToString("HH:mm");
//                 dataDict["RuleName"] = rule.RuleName;
//                 dataDict["Category"] = category ?? rule.Category;
                
//                 if (!string.IsNullOrEmpty(parentName))
//                 {
//                     dataDict["ParentName"] = parentName;
//                 }

//                 var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Notification", dataDict);
//                 var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "You have a new notification", dataDict);
                
//                 var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
//                 var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
                
//                 if (string.IsNullOrEmpty(titlePlain))
//                 {
//                     titlePlain = "School Notification";
//                 }
//                 if (string.IsNullOrEmpty(messagePlain))
//                 {
//                     messagePlain = "You have a new notification from your school";
//                 }
                
//                 bool hasHtml = (titleHtml != titlePlain) || (messageHtml != messagePlain);
//                 string logTitle = titlePlain ?? "Empty Title";
                
//                 _logger.LogInformation("📝 Creating notification for user {UserId} - Title: '{Title}', HasHtml: {HasHtml}", 
//                     concreteUserId, logTitle, hasHtml);
                
//                 string dataPayload;
//                 if (!string.IsNullOrEmpty(rule.DataTemplate))
//                 {
//                     dataPayload = await ResolveTemplate(rule.DataTemplate, dataDict);
//                 }
//                 else
//                 {
//                     var payloadData = new Dictionary<string, object>
//                     {
//                         ["action"] = "view_notification",
//                         ["userId"] = userId,
//                         ["category"] = category ?? rule.Category,
//                         ["ruleId"] = rule.RuleID,
//                         ["timestamp"] = pakistanNow.ToString("yyyy-MM-ddTHH:mm:ss"),
//                         ["titleHtml"] = titleHtml,
//                         ["messageHtml"] = messageHtml,
//                         ["isHtml"] = true
//                     };
                    
//                     if (batchId.HasValue)
//                         payloadData["batchId"] = batchId.Value;
                    
//                     dataPayload = JsonConvert.SerializeObject(payloadData);
//                 }

//                 var notification = new NotificationQueue
//                 {
//                     RuleID = rule.RuleID,
//                     UserID = concreteUserId,
//                     UserType = userType,
//                     DeviceToken = fcmToken,
//                     Title = titlePlain,
//                     Message = messagePlain,
//                     DataPayload = dataPayload,
//                     Status = "PENDING",
//                     Priority = rule.Priority,
//                     ScheduledTime = pakistanNow,
//                     ExpiryTime = pakistanNow.AddDays(7),
//                     CreatedTime = pakistanNow,
//                     AttemptCount = 0,
//                     LastAttemptTime = null,
//                     ErrorMessage = null
//                 };

//                 _context.NotificationQueue.Add(notification);
//                 await _context.SaveChangesAsync();
                
//                 _logger.LogInformation("✅ Created notification {QueueID} for user {UserID}", 
//                     notification.QueueID, concreteUserId);
                
//                 return notification;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error creating generic notification for user");
//                 return null;
//             }
//         }

//         // ==================== HELPER METHODS ====================

//         private async Task<Guid> CreateBatchNotificationAsync(NotificationRule rule, int totalRecipients)
//         {
//             try
//             {
//                 var batchId = Guid.NewGuid();
                
//                 var batchNotification = new BatchNotification
//                 {
//                     BatchID = batchId,
//                     RuleID = rule.RuleID,
//                     Title = rule.TitleTemplate,
//                     Message = rule.MessageTemplate,
//                     TargetType = rule.TargetType ?? "ALL",
//                     TargetFilter = rule.TargetFilter,
//                     TotalRecipients = totalRecipients,
//                     Status = "PROCESSING",
//                     CreatedTime = GetPakistanTime()
//                 };

//                 _context.BatchNotifications.Add(batchNotification);
//                 await _context.SaveChangesAsync();

//                 _logger.LogInformation("📦 Created batch notification {BatchID} for rule {RuleID} with {Count} recipients", 
//                     batchId, rule.RuleID, totalRecipients);

//                 return batchId;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error creating batch notification");
//                 return Guid.Empty;
//             }
//         }

//         private async Task UpdateBatchNotificationAsync(Guid batchId, int sentCount)
//         {
//             try
//             {
//                 var batchNotification = await _context.BatchNotifications
//                     .FirstOrDefaultAsync(b => b.BatchID == batchId);

//                 if (batchNotification != null)
//                 {
//                     batchNotification.SentCount = sentCount;
//                     batchNotification.FailedCount = batchNotification.TotalRecipients - sentCount;
//                     batchNotification.Status = sentCount > 0 ? "COMPLETED" : "FAILED";
//                     batchNotification.CompletedTime = GetPakistanTime();

//                     await _context.SaveChangesAsync();

//                     _logger.LogInformation("📊 Updated batch notification {BatchID}: Sent={Sent}, Failed={Failed}", 
//                         batchId, sentCount, batchNotification.FailedCount);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error updating batch notification");
//             }
//         }

//         private Dictionary<string, object> ParseRuleSettings(NotificationRule rule)
//         {
//             var settings = new Dictionary<string, object>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     settings = JsonConvert.DeserializeObject<Dictionary<string, object>>(rule.TargetFilter) ?? new Dictionary<string, object>();
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing rule settings for rule {RuleID}", rule.RuleID);
//             }

//             return settings;
//         }

//         private async Task UpdateRuleStatisticsAsync(NotificationRule rule)
//         {
//             try
//             {
//                 var pakistanNow = GetPakistanTime();
//                 rule.LastRunTime = pakistanNow;
//                 rule.TotalRuns++;
                
//                 if (!rule.IsManualTrigger)
//                 {
//                     rule.NextRunTime = await CalculateNextRunTime(rule);
//                 }
                
//                 rule.ModifiedDate = pakistanNow;
//                 await _context.SaveChangesAsync();
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error updating rule statistics for rule {RuleID}", rule.RuleID);
//             }
//         }

//         public async Task<DateTime?> CalculateNextRunTime(NotificationRule rule)
//         {
//             if (!rule.IsActive || string.IsNullOrEmpty(rule.TimingType))
//                 return null;

//             if (rule.RuleType == "MANUAL" || rule.IsManualTrigger)
//                 return null;

//             var pakistanNow = GetPakistanTime();

//             switch (rule.TimingType.ToUpper())
//             {
//                 case "IMMEDIATE":
//                     return pakistanNow.AddMinutes(5);
                    
//                 case "FIXED_TIME":
//                     if (rule.FixedTime.HasValue)
//                     {
//                         var nextRun = pakistanNow.Date.Add(rule.FixedTime.Value);
//                         if (nextRun <= pakistanNow)
//                             nextRun = nextRun.AddDays(1);
//                         return nextRun;
//                     }
//                     break;
                    
//                 case "DAYS_OFFSET":
//                     if (rule.DaysOffset.HasValue)
//                         return pakistanNow.AddDays(rule.DaysOffset.Value);
//                     break;
                    
//                 case "CRON":
//                     if (!string.IsNullOrEmpty(rule.CronExpression))
//                     {
//                         try
//                         {
//                             var utcNow = pakistanNow.ToUniversalTime();
//                             var parts = rule.CronExpression.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                            
//                             if (parts.Length != 5 && parts.Length != 6)
//                             {
//                                 return null;
//                             }
                            
//                             var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;
//                             var schedule = CronExpression.Parse(rule.CronExpression, format);
                            
//                             var nextUtc = schedule.GetNextOccurrence(utcNow, inclusive: false);
//                             if (nextUtc.HasValue)
//                                 return nextUtc.Value.ToLocalTime();
//                         }
//                         catch (Exception ex)
//                         {
//                             _logger.LogError(ex, "❌ Error parsing cron expression for rule {RuleID}: {Expression}", 
//                                 rule.RuleID, rule.CronExpression);
//                         }
//                     }
//                     break;
                    
//                 case "DAILY":
//                     return pakistanNow.AddDays(1);
                    
//                 case "WEEKLY":
//                     return pakistanNow.AddDays(7);
                    
//                 case "BIWEEKLY":
//                     return pakistanNow.AddDays(14);
                    
//                 case "MONTHLY":
//                     return pakistanNow.AddMonths(1);
//             }

//             return null;
//         }

//         public async Task ScheduleRule(NotificationRule rule)
//         {
//             try
//             {
//                 if (rule.RuleType == "CRON" && !string.IsNullOrEmpty(rule.CronExpression) && !rule.IsManualTrigger)
//                 {
//                     RecurringJob.RemoveIfExists($"notification-rule-{rule.RuleID}");
                    
//                     RecurringJob.AddOrUpdate<INotificationRuleProcessor>(
//                         $"notification-rule-{rule.RuleID}",
//                         processor => processor.ExecuteRuleDirectAsync(rule.RuleID),
//                         rule.CronExpression,
//                         TimeZoneInfo.Local);
                    
//                     _logger.LogInformation("📅 Scheduled cron job for rule {RuleID} with expression: {Expression}", 
//                         rule.RuleID, rule.CronExpression);
//                 }
                
//                 await Task.CompletedTask;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error scheduling rule {RuleID}", rule.RuleID);
//             }
//         }

//         public async Task<string> ResolveTemplate(string template, dynamic data)
//         {
//             if (string.IsNullOrEmpty(template))
//                 return string.Empty;

//             var result = template;
            
//             try
//             {
//                 var dataDict = ConvertToDictionary(data);

//                 foreach (var prop in dataDict)
//                 {
//                     var placeholder = "{" + prop.Key + "}";
//                     var value = prop.Value?.ToString() ?? string.Empty;
                    
//                     if (result.Contains(placeholder))
//                     {
//                         result = result.Replace(placeholder, value);
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error resolving template: {Template}", template);
//             }

//             return result;
//         }

//         private Dictionary<string, object> ConvertToDictionary(dynamic data)
//         {
//             var dict = new Dictionary<string, object>();
            
//             if (data is ExpandoObject expando)
//             {
//                 var expandoDict = expando as IDictionary<string, object>;
//                 foreach (var kvp in expandoDict)
//                 {
//                     dict[kvp.Key] = kvp.Value;
//                 }
//             }
//             else if (data is IDictionary<string, object> dataDict)
//             {
//                 dict = new Dictionary<string, object>(dataDict);
//             }
            
//             return dict;
//         }

//         private int GetUserId(dynamic userData)
//         {
//             try
//             {
//                 if (userData is IDictionary<string, object> dict)
//                 {
//                     if (dict.TryGetValue("UserID", out var userIdObj))
//                         return Convert.ToInt32(userIdObj);
//                     if (dict.TryGetValue("ParentID", out var parentIdObj))
//                         return Convert.ToInt32(parentIdObj);
//                 }
                
//                 return 0;
//             }
//             catch
//             {
//                 return 0;
//             }
//         }

//         private string GetUserType(dynamic userData)
//         {
//             try
//             {
//                 if (userData is IDictionary<string, object> dict && dict.TryGetValue("UserType", out var userTypeObj))
//                 {
//                     return userTypeObj?.ToString() ?? "USER";
//                 }
//                 return "USER";
//             }
//             catch
//             {
//                 return "USER";
//             }
//         }

//         private string GetUserTypeFromRole(int roleId)
//         {
//             return roleId switch
//             {
//                 1 => "ADMIN",
//                 2 => "TEACHER",
//                 3 => "STUDENT",
//                 4 => "PARENT",
//                 _ => "USER"
//             };
//         }

//         [AutomaticRetry(Attempts = 3)]
//         public async Task ExecuteRuleDirectAsync(int ruleId)
//         {
//             try
//             {
//                 _logger.LogInformation("🚀 Hangfire executing rule {RuleID}", ruleId);
                
//                 var rule = await _context.NotificationRules.FindAsync(ruleId);
//                 if (rule == null)
//                 {
//                     _logger.LogWarning("⚠️ Rule {RuleID} not found", ruleId);
//                     return;
//                 }

//                 if (!rule.IsActive)
//                 {
//                     _logger.LogWarning("⏸️ Rule {RuleID} is inactive", ruleId);
//                     return;
//                 }

//                 await ExecuteRuleAsync(rule);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error executing rule {RuleID} via Hangfire", ruleId);
//                 throw;
//             }
//         }

//         // Helper Classes for SQL Results
//   private class FeeTargetUser
// {
//     public int FeePostingID { get; set; }
//     public int StudentID { get; set; }
//     public string StudentName { get; set; } = string.Empty;
//     public int? RollNumber { get; set; }
//     public int? ClassID { get; set; }
//     public int? SectionID { get; set; }
//     public int ParentID { get; set; }
//     public string ParentName { get; set; } = string.Empty;
//     public string ParentMobile { get; set; } = string.Empty;
//     public string DeviceToken { get; set; } = string.Empty;
//     public int? DueAmount { get; set; }
//     public int? LateFee { get; set; }
//     public string FeeMonth { get; set; } = string.Empty;
//     public string FeeYear { get; set; } = string.Empty;
//     public DateOnly? IssueDate { get; set; }
//     public DateOnly? DueDate { get; set; }
//     public int? DaysOverdue { get; set; }
//     public string ChallanNo { get; set; } = string.Empty;
//     public string ClassName { get; set; } = string.Empty;
//     public string SectionName { get; set; } = string.Empty;
//     public int? RemainingAmount { get; set; }
//     public int IsFullyPaid { get; set; }
// }

//       private class AttendanceTargetUser
// {
//     public int StudentID { get; set; }
//     public string StudentName { get; set; } = string.Empty;
//     public int RollNumber { get; set; }
//     public int ClassID { get; set; }
//     public string ClassName { get; set; } = string.Empty;
//     public int SectionID { get; set; }
//     public string SectionName { get; set; } = string.Empty;
//     public int ParentID { get; set; }
//     public string ParentName { get; set; } = string.Empty;
//     public int? FamilyID { get; set; }
//     public DateTime? AttendanceDate { get; set; }
//     public string AttendanceStatus { get; set; } = string.Empty;
//     public string StudentRemarks { get; set; } = string.Empty;
//     public string DeviceToken { get; set; } = string.Empty;
// }

//         private class ExamTargetUser
//         {
//             public int StudentID { get; set; }
//             public int ParentID { get; set; }
//             public string DeviceToken { get; set; } = string.Empty;
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public string ExamTitle { get; set; } = string.Empty;
//             public DateTime? ExamDate { get; set; }
//             public string Subject { get; set; } = string.Empty;
//             public int? TotalMarks { get; set; }
//             public int? PassingMarks { get; set; }
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//         }

//         private class HomeworkTargetUser
//         {
//             public int StudentID { get; set; }
//             public int ParentID { get; set; }
//             public string DeviceToken { get; set; } = string.Empty;
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public string HomeworkTitle { get; set; } = string.Empty;
//             public string HomeworkDescription { get; set; } = string.Empty;
//             public string Subject { get; set; } = string.Empty;
//             public DateTime? DueDate { get; set; }
//             public DateTime? AssignedDate { get; set; }
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//         }

//         private class EventTargetUser
//         {
//             public int StudentID { get; set; }
//             public int ParentID { get; set; }
//             public string DeviceToken { get; set; } = string.Empty;
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public string EventTitle { get; set; } = string.Empty;
//             public string EventDescription { get; set; } = string.Empty;
//             public DateTime? EventDate { get; set; }
//             public string EventTime { get; set; } = string.Empty;
//             public string Location { get; set; } = string.Empty;
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//         }
//     }
// }





// using Microsoft.EntityFrameworkCore;
// using school_management_Backend.Data;
// using school_management_Backend.Models;
// using Newtonsoft.Json;
// using Newtonsoft.Json.Linq;
// using Hangfire;
// using System.Dynamic;
// using Microsoft.Data.SqlClient;
// using Cronos;
// using System.Globalization;

// namespace school_management_Backend.Services
// {
//     public class NotificationRuleProcessor : INotificationRuleProcessor
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly INotificationService _notificationService;
//         private readonly ILogger<NotificationRuleProcessor> _logger;
//         private readonly TimeZoneInfo _pakistanTimeZone;

//         public NotificationRuleProcessor(
//             ApplicationDbContext context,
//             INotificationService notificationService,
//             ILogger<NotificationRuleProcessor> logger)
//         {
//             _context = context;
//             _notificationService = notificationService;
//             _logger = logger;
            
//             try
//             {
//                 _pakistanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Pakistan Standard Time");
//             }
//             catch
//             {
//                 try
//                 {
//                     _pakistanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Karachi");
//                 }
//                 catch
//                 {
//                     _pakistanTimeZone = TimeZoneInfo.Local;
//                     _logger.LogWarning("⚠️ Pakistan timezone not found, using local timezone: {Timezone}", 
//                         TimeZoneInfo.Local.DisplayName);
//                 }
//             }
//         }

//         public DateTime GetPakistanTime()
//         {
//             return TimeZoneInfo.ConvertTime(DateTime.UtcNow, _pakistanTimeZone);
//         }

//         #region Helper Classes for Section Parsing

//         private class SectionTarget
//         {
//             public int SectionID { get; set; }
//             public int ClassID { get; set; }
//             public List<int> StudentIDs { get; set; } = new List<int>();
//         }

//         #endregion

//         #region Section Parsing Methods

//         private List<SectionTarget> ParseSectionsFromTargetFilter(NotificationRule rule)
//         {
//             var sections = new List<SectionTarget>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["Sections"] is JArray sectionsArray)
//                     {
//                         foreach (var section in sectionsArray)
//                         {
//                             var sectionId = section["SectionID"]?.Value<int>();
//                             var classId = section["ClassID"]?.Value<int>();
//                             var studentIds = section["StudentID"]?.Value<JArray>()
//                                 ?.Select(x => x.Value<int>()).ToList() ?? new List<int>();
                            
//                             if (sectionId.HasValue && classId.HasValue)
//                             {
//                                 sections.Add(new SectionTarget
//                                 {
//                                     SectionID = sectionId.Value,
//                                     ClassID = classId.Value,
//                                     StudentIDs = studentIds
//                                 });
                                
//                                 _logger.LogDebug("📚 Parsed section: SectionID={SectionID}, ClassID={ClassID}, Students={StudentCount}", 
//                                     sectionId.Value, classId.Value, studentIds.Count);
//                             }
//                         }
//                     }
//                     else if (filter["SectionID"] != null)
//                     {
//                         var sectionId = filter["SectionID"]?.Value<int>();
//                         var studentIds = filter["StudentID"]?.Value<JArray>()
//                             ?.Select(x => x.Value<int>()).ToList() ?? new List<int>();
                        
//                         if (sectionId.HasValue)
//                         {
//                             var section = _context.tbl_AddSection
//                                 .FirstOrDefault(s => s.ID == sectionId.Value);
                            
//                             sections.Add(new SectionTarget
//                             {
//                                 SectionID = sectionId.Value,
//                                 ClassID = section?.Class_ID ?? 0,
//                                 StudentIDs = studentIds
//                             });
//                         }
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error parsing sections from target filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return sections;
//         }

//         private List<int> ParseClassFilter(NotificationRule rule)
//         {
//             var classIds = new List<int>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["ClassID"] is JArray classArray)
//                     {
//                         classIds = classArray.Select(x => x.Value<int>()).ToList();
//                     }
//                     else if (filter["ClassID"] != null)
//                     {
//                         classIds.Add(filter["ClassID"].Value<int>());
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing class filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return classIds;
//         }

//         private List<int> ParseSpecificUsers(NotificationRule rule)
//         {
//             var userIds = new List<int>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["UserID"] is JArray userArray)
//                     {
//                         userIds = userArray.Select(x => x.Value<int>()).ToList();
//                     }
//                     else if (filter["UserID"] != null)
//                     {
//                         userIds.Add(filter["UserID"].Value<int>());
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing user filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return userIds;
//         }

//         /// <summary>
//         /// Parses specific student IDs from target filter for SPECIFIC_STUDENTS_DIRECT
//         /// </summary>
//         private List<int> ParseSpecificStudents(NotificationRule rule)
//         {
//             var studentIds = new List<int>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     var filter = JObject.Parse(rule.TargetFilter);
                    
//                     if (filter["Students"] is JArray studentArray)
//                     {
//                         studentIds = studentArray.Select(x => x.Value<int>()).ToList();
//                         _logger.LogDebug("📚 Parsed {Count} specific students from Students array: {StudentIds}", 
//                             studentIds.Count, string.Join(",", studentIds));
//                     }
//                     else if (filter["StudentID"] is JArray studentIdArray)
//                     {
//                         studentIds = studentIdArray.Select(x => x.Value<int>()).ToList();
//                     }
//                     else if (filter["StudentID"] != null)
//                     {
//                         studentIds.Add(filter["StudentID"].Value<int>());
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing specific students filter for rule {RuleID}", rule.RuleID);
//             }
            
//             return studentIds;
//         }

//         #endregion

//         // ==================== MAIN EXECUTION METHODS ====================

//         public async Task<List<NotificationQueue>> ExecuteRuleAsync(NotificationRule rule)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             try
//             {
//                 _logger.LogInformation("🚀 Executing rule: {RuleName} (ID: {RuleID}, Type: {RuleType}, Category: {Category}, Manual: {IsManual})", 
//                     rule.RuleName, rule.RuleID, rule.RuleType, rule.Category, rule.IsManualTrigger);

//                 if (!await ShouldRuleRunNowAsync(rule))
//                 {
//                     _logger.LogInformation("⏸️ Rule {RuleID} should not run now based on timing, skipping", rule.RuleID);
//                     return notifications;
//                 }

//                 var targetUsers = await GetTargetUsersAsync(rule);
                
//                 _logger.LogInformation("👥 Found {Count} target users for rule {RuleID}", targetUsers.Count, rule.RuleID);
                
//                 if (targetUsers.Count == 0)
//                 {
//                     _logger.LogInformation("📭 Rule {RuleID} executed with 0 target users", rule.RuleID);
//                     await UpdateRuleStatisticsAsync(rule);
//                     return notifications;
//                 }
                
//                 notifications = await ProcessRuleByCategoryAsync(rule, targetUsers);
                
//                 await UpdateRuleStatisticsAsync(rule);
                
//                 _logger.LogInformation("✅ Rule {RuleID} executed successfully. Created/Updated {Count} notifications", 
//                     rule.RuleID, notifications.Count);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error executing rule {RuleID}", rule.RuleID);
//             }
            
//             return notifications;
//         }

//         public async Task ExecuteRuleManuallyAsync(int ruleId)
//         {
//             try
//             {
//                 _logger.LogInformation("🚀 MANUAL EXECUTION triggered for rule ID: {RuleId}", ruleId);
                
//                 var rule = await _context.NotificationRules
//                     .FirstOrDefaultAsync(r => r.RuleID == ruleId);
                
//                 if (rule == null)
//                 {
//                     _logger.LogWarning("⚠️ Rule {RuleId} not found for manual execution", ruleId);
//                     return;
//                 }
                
//                 if (!rule.IsActive)
//                 {
//                     _logger.LogWarning("⏸️ Rule {RuleId} is inactive, cannot execute manually", ruleId);
//                     return;
//                 }
                
//                 _logger.LogInformation("⚡ Manually executing rule: {RuleName} (ID: {RuleID}, Type: {RuleType}, Category: {Category}, Manual: {IsManual})", 
//                     rule.RuleName, rule.RuleID, rule.RuleType, rule.Category, rule.IsManualTrigger);
                
//                 var targetUsers = await GetTargetUsersAsync(rule);
                
//                 _logger.LogInformation("👥 Found {Count} target users for manual rule {RuleID}", targetUsers.Count, rule.RuleID);
                
//                 if (targetUsers.Count == 0)
//                 {
//                     _logger.LogInformation("📭 Manual rule {RuleID} executed with 0 target users", rule.RuleID);
//                     await UpdateRuleStatisticsForManualExecutionAsync(rule);
//                     return;
//                 }
                
//                 List<NotificationQueue> notifications;
                
//                 switch (rule.Category?.ToUpper())
//                 {
//                     case "FEE":
//                         notifications = await ProcessFeeNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "ATTENDANCE":
//                         notifications = await ProcessAttendanceNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "EXAM":
//                         notifications = await ProcessExamNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "HOMEWORK":
//                         notifications = await ProcessHomeworkNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "ANNOUNCEMENT":
//                         notifications = await ProcessAnnouncementNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "GENERAL":
//                         notifications = await ProcessGeneralNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "ALERT":
//                         notifications = await ProcessAlertNotificationsAsync(rule, targetUsers);
//                         break;
//                     case "EVENT":
//                         notifications = await ProcessEventNotificationsAsync(rule, targetUsers);
//                         break;
//                     default:
//                         notifications = await ProcessGenericNotificationsAsync(rule, targetUsers);
//                         break;
//                 }
                
//                 await UpdateRuleStatisticsForManualExecutionAsync(rule);
                
//                 _logger.LogInformation("✅ Manual rule {RuleID} executed successfully. Created {Count} notifications", 
//                     rule.RuleID, notifications.Count);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error in manual execution for rule {RuleId}", ruleId);
//                 throw;
//             }
//         }

//         private async Task UpdateRuleStatisticsForManualExecutionAsync(NotificationRule rule)
//         {
//             try
//             {
//                 var pakistanNow = GetPakistanTime();
//                 rule.LastRunTime = pakistanNow;
//                 rule.TotalRuns++;
//                 rule.ModifiedDate = pakistanNow;
                
//                 await _context.SaveChangesAsync();
                
//                 _logger.LogDebug("📊 Updated statistics for manual rule {RuleID}: LastRun={LastRun}, TotalRuns={TotalRuns}",
//                     rule.RuleID, rule.LastRunTime?.ToString("yyyy-MM-dd HH:mm:ss"), rule.TotalRuns);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error updating rule statistics for manual rule {RuleID}", rule.RuleID);
//             }
//         }

//         private async Task<List<NotificationQueue>> ProcessRuleByCategoryAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             switch (rule.Category?.ToUpper())
//             {
//                 case "FEE":
//                     notifications = await ProcessFeeNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "ATTENDANCE":
//                     notifications = await ProcessAttendanceNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "EXAM":
//                     notifications = await ProcessExamNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "HOMEWORK":
//                     notifications = await ProcessHomeworkNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "ANNOUNCEMENT":
//                     notifications = await ProcessAnnouncementNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "GENERAL":
//                     notifications = await ProcessGeneralNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "ALERT":
//                     notifications = await ProcessAlertNotificationsAsync(rule, targetUsers);
//                     break;
//                 case "EVENT":
//                     notifications = await ProcessEventNotificationsAsync(rule, targetUsers);
//                     break;
//                 default:
//                     notifications = await ProcessGenericNotificationsAsync(rule, targetUsers);
//                     break;
//             }
            
//             return notifications;
//         }

//         // ==================== TIMING VALIDATION ====================

//         public async Task<bool> ShouldRuleRunNowAsync(NotificationRule rule)
//         {
//             try
//             {
//                 var pakistanNow = GetPakistanTime();
                
//                 if (rule.RuleType == "MANUAL")
//                     return false;
                
//                 if (rule.RuleType == "EVENT")
//                 {
//                     if (rule.IsManualTrigger)
//                     {
//                         _logger.LogDebug("⏸️ Rule {RuleID} is manual trigger, skipping automatic execution", rule.RuleID);
//                         return false;
//                     }
                    
//                     return true;
//                 }
                
//                 if (rule.RuleType == "CRON" || rule.RuleType == "SCHEDULED")
//                 {
//                     return await CheckScheduleTimingAsync(rule, pakistanNow);
//                 }
                
//                 return true;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error checking if rule should run now");
//                 return false;
//             }
//         }

//         private async Task<bool> CheckScheduleTimingAsync(NotificationRule rule, DateTime pakistanNow)
//         {
//             switch (rule.TimingType?.ToUpper())
//             {
//                 case "IMMEDIATE":
//                     return true;
                    
//                 case "FIXED_TIME":
//                     if (!rule.FixedTime.HasValue) return false;
//                     var scheduledTime = pakistanNow.Date.Add(rule.FixedTime.Value);
//                     var timeDifference = Math.Abs((pakistanNow - scheduledTime).TotalMinutes);
//                     return timeDifference <= 15;
                    
//                 case "DAYS_OFFSET":
//                     if (!rule.DaysOffset.HasValue || !rule.LastRunTime.HasValue) return false;
//                     var daysSinceLastRun = (pakistanNow.Date - rule.LastRunTime.Value.Date).Days;
//                     return daysSinceLastRun >= rule.DaysOffset.Value;
                    
//                 case "CRON":
//                     if (string.IsNullOrEmpty(rule.CronExpression)) return false;
//                     return await CheckCronExpressionAsync(rule.CronExpression, pakistanNow);
                    
//                 case "DAILY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 1;
                    
//                 case "WEEKLY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 7;
                    
//                 case "BIWEEKLY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 14;
                    
//                 case "MONTHLY":
//                     if (!rule.LastRunTime.HasValue) return true;
//                     return (pakistanNow.Date - rule.LastRunTime.Value.Date).Days >= 30;
                    
//                 case "WEEKDAY":
//                     return pakistanNow.DayOfWeek != DayOfWeek.Saturday && pakistanNow.DayOfWeek != DayOfWeek.Sunday;
                    
//                 case "WEEKEND":
//                     return pakistanNow.DayOfWeek == DayOfWeek.Saturday || pakistanNow.DayOfWeek == DayOfWeek.Sunday;
                    
//                 default:
//                     return true;
//             }
//         }

//         private async Task<bool> CheckCronExpressionAsync(string cronExpression, DateTime pakistanNow)
//         {
//             try
//             {
//                 var utcNow = pakistanNow.ToUniversalTime();
//                 var parts = cronExpression.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                
//                 if (parts.Length != 5 && parts.Length != 6)
//                 {
//                     _logger.LogError("❌ Invalid cron expression format: {Cron}", cronExpression);
//                     return false;
//                 }
                
//                 var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;
//                 var parsedExpression = CronExpression.Parse(cronExpression, format);
                
//                 var nextOccurrence = parsedExpression.GetNextOccurrence(utcNow.AddMinutes(-5), inclusive: false);
                
//                 if (nextOccurrence.HasValue)
//                 {
//                     var nextLocal = nextOccurrence.Value.ToLocalTime();
//                     var timeDiff = Math.Abs((pakistanNow - nextLocal).TotalMinutes);
//                     return timeDiff <= 5;
//                 }
                
//                 return false;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error parsing cron expression: {Cron}", cronExpression);
//                 return false;
//             }
//         }

//         // ==================== TARGET USER METHODS ====================

//         public async Task<List<dynamic>> GetTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 _logger.LogInformation("🔍 Getting target users for rule {RuleID} with category {Category}", 
//                     rule.RuleID, rule.Category);

//                 if (!string.IsNullOrEmpty(rule.TargetType))
//                 {
//                     users = await GetTargetUsersByTargetTypeAsync(rule);
//                 }
//                 else
//                 {
//                     switch (rule.Category?.ToUpper())
//                     {
//                         case "FEE":
//                             users = await GetFeeTargetUsersAsync(rule);
//                             break;
//                         case "ATTENDANCE":
//                             users = await GetAttendanceTargetUsersAsync(rule);
//                             break;
//                         case "EXAM":
//                             users = await GetExamTargetUsersAsync(rule);
//                             break;
//                         case "HOMEWORK":
//                             users = await GetHomeworkTargetUsersAsync(rule);
//                             break;
//                         case "EVENT":
//                             users = await GetEventTargetUsersAsync(rule);
//                             break;
//                         default:
//                             users = await GetGenericTargetUsersAsync(rule);
//                             break;
//                     }
//                 }
                
//                 _logger.LogInformation("👥 Found {Count} target users for rule {RuleID}", users.Count, rule.RuleID);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         /// <summary>
//         /// Gets target users based on TargetType (ALL, PARENTS, TEACHERS, STUDENTS, CLASS, SECTION, SPECIFIC_USERS, SPECIFIC_STUDENTS_DIRECT)
//         /// </summary>
//         private async Task<List<dynamic>> GetTargetUsersByTargetTypeAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 switch (rule.TargetType.ToUpper())
//                 {
//                     case "ALL":
//                         var allUsers = await _context.tbl_User
//                             .Where(u => u.Status == true)
//                             .Select(u => new { u.ID, u.Name, u.RoleID })
//                             .ToListAsync();
                        
//                         foreach (var user in allUsers)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = user.ID;
//                             userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
//                             userObj.UserName = user.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "PARENTS":
//                         var parents = await _context.tbl_User
//                             .Where(u => u.Status == true && u.RoleID == 4)
//                             .Select(u => new { u.ID, u.Name })
//                             .ToListAsync();
                        
//                         foreach (var parent in parents)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = parent.ID;
//                             userObj.UserType = "PARENT";
//                             userObj.UserName = parent.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "TEACHERS":
//                         var teachers = await _context.tbl_User
//                             .Where(u => u.Status == true && u.RoleID == 3)
//                             .Select(u => new { u.ID, u.Name })
//                             .ToListAsync();
                        
//                         foreach (var teacher in teachers)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = teacher.ID;
//                             userObj.UserType = "TEACHER";
//                             userObj.UserName = teacher.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "STUDENTS":
//                         var students = await _context.tbl_User
//                             .Where(u => u.Status == true && u.RoleID == 5)
//                             .Select(u => new { u.ID, u.Name })
//                             .ToListAsync();
                        
//                         foreach (var student in students)
//                         {
//                             dynamic userObj = new ExpandoObject();
//                             userObj.UserID = student.ID;
//                             userObj.UserType = "STUDENT";
//                             userObj.UserName = student.Name;
//                             users.Add(userObj);
//                         }
//                         break;

//                     case "CLASS":
//                         var classIds = ParseClassFilter(rule);
//                         if (classIds.Any())
//                         {
//                             var familyCodes = await _context.tbl_StudentRegistration
//                                 .Where(s => classIds.Contains(s.Class_ID ?? 0) 
//                                     && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission")
//                                     && s.Family_Code.HasValue)
//                                 .Select(s => s.Family_Code.Value)
//                                 .Distinct()
//                                 .ToListAsync();
                            
//                             if (familyCodes.Any())
//                             {
//                                 var parentUsers = await _context.tbl_User
//                                     .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
//                                     .Select(u => new { u.ID, u.Name })
//                                     .ToListAsync();
                                
//                                 foreach (var user in parentUsers)
//                                 {
//                                     dynamic userObj = new ExpandoObject();
//                                     userObj.UserID = user.ID;
//                                     userObj.UserType = "PARENT";
//                                     userObj.UserName = user.Name;
//                                     users.Add(userObj);
//                                 }
//                             }
//                         }
//                         break;

//                     case "SECTION":
//                         var sections = ParseSectionsFromTargetFilter(rule);
                        
//                         if (sections.Any())
//                         {
//                             var allParentIds = new HashSet<int>();
                            
//                             _logger.LogInformation("📋 Processing {Count} sections for rule {RuleID}", sections.Count, rule.RuleID);
                            
//                             foreach (var section in sections)
//                             {
//                                 _logger.LogInformation("🎯 Processing Section ID: {SectionID} (Class ID: {ClassID}) with {StudentCount} specific students", 
//                                     section.SectionID, section.ClassID, section.StudentIDs.Count);
                                
//                                 var studentQuery = _context.tbl_StudentRegistration
//                                     .Where(s => s.Section_ID == section.SectionID 
//                                         && s.Class_ID == section.ClassID
//                                         && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission"));
                                
//                                 if (section.StudentIDs.Any())
//                                 {
//                                     studentQuery = studentQuery.Where(s => section.StudentIDs.Contains(s.Reg_Id));
//                                     _logger.LogInformation("   📍 Filtering to {Count} specific students: {StudentIDs}", 
//                                         section.StudentIDs.Count, string.Join(",", section.StudentIDs));
//                                 }
//                                 else
//                                 {
//                                     _logger.LogInformation("   📍 No specific student filter - will include ALL students in this section");
//                                 }
                                
//                                 var familyCodes = await studentQuery
//                                     .Where(s => s.Family_Code.HasValue)
//                                     .Select(s => s.Family_Code.Value)
//                                     .Distinct()
//                                     .ToListAsync();
                                
//                                 _logger.LogInformation("   👨‍👩‍👧 Found {FamilyCount} family codes for Section {SectionID}", 
//                                     familyCodes.Count, section.SectionID);
                                
//                                 if (familyCodes.Any())
//                                 {
//                                     var parentIds = await _context.tbl_User
//                                         .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
//                                         .Select(u => u.ID)
//                                         .ToListAsync();
                                    
//                                     foreach (var pid in parentIds)
//                                     {
//                                         if (!allParentIds.Contains(pid))
//                                         {
//                                             allParentIds.Add(pid);
                                            
//                                             dynamic userObj = new ExpandoObject();
//                                             userObj.UserID = pid;
//                                             userObj.UserType = "PARENT";
//                                             users.Add(userObj);
//                                         }
//                                     }
                                    
//                                     _logger.LogInformation("   👨‍👩‍👧 Found {ParentCount} parents for Section {SectionID}", 
//                                         parentIds.Count, section.SectionID);
//                                 }
//                                 else
//                                 {
//                                     _logger.LogWarning("   ⚠️ No family codes found for Section {SectionID}", section.SectionID);
//                                 }
//                             }
                            
//                             _logger.LogInformation("📊 Total unique parents from all sections: {TotalParents}", users.Count);
//                         }
//                         else
//                         {
//                             _logger.LogWarning("⚠️ No sections parsed from target filter for rule {RuleID}", rule.RuleID);
//                         }
//                         break;

//                     case "SPECIFIC_USERS":
//                         var userIds = ParseSpecificUsers(rule);
//                         if (userIds.Any())
//                         {
//                             var specificUsers = await _context.tbl_User
//                                 .Where(u => userIds.Contains(u.ID) && u.Status == true)
//                                 .Select(u => new { u.ID, u.Name, u.RoleID })
//                                 .ToListAsync();
                            
//                             foreach (var user in specificUsers)
//                             {
//                                 dynamic userObj = new ExpandoObject();
//                                 userObj.UserID = user.ID;
//                                 userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
//                                 userObj.UserName = user.Name;
//                                 users.Add(userObj);
//                             }
//                         }
//                         break;

//                     // ==================== NEW: SPECIFIC_STUDENTS_DIRECT ====================
//                     case "SPECIFIC_STUDENTS_DIRECT":
//                         var specificStudentIds = ParseSpecificStudents(rule);
//                         if (specificStudentIds.Any())
//                         {
//                             _logger.LogInformation("🎯 Processing SPECIFIC_STUDENTS_DIRECT with {Count} students: {StudentIds}", 
//                                 specificStudentIds.Count, string.Join(",", specificStudentIds));
                            
//                             // Get family codes for these specific students
//                             var familyCodes = await _context.tbl_StudentRegistration
//                                 .Where(s => specificStudentIds.Contains(s.Reg_Id) 
//                                     && (s.cur_Status == null || s.cur_Status == "A" || s.cur_Status == "Active" || s.cur_Status == "Admission")
//                                     && s.Family_Code.HasValue)
//                                 .Select(s => s.Family_Code.Value)
//                                 .Distinct()
//                                 .ToListAsync();
                            
//                             _logger.LogInformation("👨‍👩‍👧 Found {FamilyCount} family codes for selected students", familyCodes.Count);
                            
//                             if (familyCodes.Any())
//                             {
//                                 // Get parent users from family codes
//                                 var parentUsers = await _context.tbl_User
//                                     .Where(u => familyCodes.Contains(u.FamilyID ?? 0) && u.Status == true)
//                                     .Select(u => new { u.ID, u.Name })
//                                     .ToListAsync();
                                
//                                 foreach (var parent in parentUsers)
//                                 {
//                                     dynamic userObj = new ExpandoObject();
//                                     userObj.UserID = parent.ID;
//                                     userObj.UserType = "PARENT";
//                                     userObj.UserName = parent.Name;
//                                     users.Add(userObj);
                                    
//                                     _logger.LogDebug("👤 Added parent {ParentID} for selected students", parent.ID);
//                                 }
                                
//                                 _logger.LogInformation("👥 Found {ParentCount} parents for the selected students", parentUsers.Count);
//                             }
//                             else
//                             {
//                                 _logger.LogWarning("⚠️ No family codes found for selected students: {StudentIds}", 
//                                     string.Join(",", specificStudentIds));
//                             }
//                         }
//                         break;
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error in GetTargetUsersByTargetTypeAsync for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetFeeTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var ruleSettings = ParseRuleSettings(rule);
                
//                 var sql = @"
//                     SELECT DISTINCT 
//                         fp.ID as FeePostingID,
//                         fp.Reg_ID as StudentID,
//                         s.Frist_Name as StudentName,
//                         s.RollNo as RollNumber,
//                         s.Class_ID as ClassID,
//                         s.Section_ID as SectionID,
//                         u.ID as ParentID,
//                         u.Name as ParentName,
//                         COALESCE(s.Mobile1, s.FatherContact_Number, s.MotherContact_Number, '') as ParentMobile,
//                         fp.Amount as DueAmount,
//                         fp.Fine as LateFee,
//                         fp.FeeMonth,
//                         fp.FeeYear,
//                         fp.IssueDate,
//                         fp.DueDate,
//                         DATEDIFF(day, fp.DueDate, GETDATE()) as DaysOverdue,
//                         fp.ChallanNo,
//                         c.Class_Name as ClassName,
//                         sec.Section as SectionName,
//                         d.FCMToken as DeviceToken,
//                         ISNULL(fp.Amount, 0) - ISNULL((
//                             SELECT SUM(frd.Received) 
//                             FROM tbl_FeeReceiveDetail frd
//                             INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//                             WHERE frd.Challan_No = fp.ChallanNo 
//                                 AND frm.RegID = fp.Reg_ID
//                         ), 0) as RemainingAmount,
//                         CASE WHEN EXISTS (
//                             SELECT 1 FROM tbl_FeeReceiveDetail frd
//                             INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//                             WHERE frd.Challan_No = fp.ChallanNo 
//                                 AND frm.RegID = fp.Reg_ID
//                                 AND frd.Received >= fp.Amount
//                         ) THEN 1 ELSE 0 END as IsFullyPaid
//                     FROM tbl_FeePosting fp
//                     INNER JOIN tbl_StudentRegistration s ON fp.Reg_ID = s.Reg_Id
//                     INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//                     INNER JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
//                     LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
//                     LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//                     WHERE fp.Type = 'POSTED'
//                         AND u.Status = 1
//                         AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active', 'Addmission'))
//                         AND NOT EXISTS (
//                             SELECT 1 FROM tbl_FeeReceiveDetail frd
//                             INNER JOIN tbl_FeeReceiveMaster frm ON frd.Receipt_ID = frm.Receipt_ID
//                             WHERE frd.Challan_No = fp.ChallanNo 
//                                 AND frm.RegID = fp.Reg_ID
//                                 AND frd.Received >= fp.Amount
//                         )";

//                 var parameters = new List<SqlParameter>();

//                 if (ruleSettings.ContainsKey("minAmount"))
//                 {
//                     sql += " AND fp.Amount >= @minAmount";
//                     parameters.Add(new SqlParameter("@minAmount", Convert.ToInt32(ruleSettings["minAmount"])));
//                 }

//                 sql += " ORDER BY fp.DueDate ASC";

//                 var result = await _context.Database.SqlQueryRaw<FeeTargetUser>(sql, parameters.ToArray()).ToListAsync();

//                 _logger.LogInformation("💰 Found {Count} fee-due students for rule {RuleID}", result.Count, rule.RuleID);

//                 foreach (var item in result)
//                 {
//                     dynamic user = new ExpandoObject();
//                     user.UserID = item.ParentID;
//                     user.UserType = "PARENT";
//                     user.DeviceToken = item.DeviceToken;
//                     user.StudentID = item.StudentID;
//                     user.StudentName = item.StudentName;
//                     user.RollNumber = item.RollNumber;
//                     user.ClassID = item.ClassID;
//                     user.SectionID = item.SectionID;
//                     user.ParentName = item.ParentName;
//                     user.ParentMobile = item.ParentMobile ?? string.Empty;
//                     user.DueAmount = item.DueAmount;
//                     user.RemainingAmount = item.RemainingAmount;
//                     user.LateFee = item.LateFee;
//                     user.FeeMonth = item.FeeMonth;
//                     user.FeeYear = item.FeeYear;
//                     user.IssueDate = item.IssueDate;
//                     user.DueDate = item.DueDate;
//                     user.DaysOverdue = item.DaysOverdue;
//                     user.ChallanNo = item.ChallanNo;
//                     user.ClassName = item.ClassName;
//                     user.SectionName = item.SectionName;
//                     user.FeePostingID = item.FeePostingID;
//                     user.TotalDue = (item.RemainingAmount + item.LateFee) ?? 0;
//                     user.IsFullyPaid = item.IsFullyPaid == 1;
                    
//                     users.Add(user);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting fee target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         // private async Task<List<dynamic>> GetAttendanceTargetUsersAsync(NotificationRule rule)
//         // {
//         //     var users = new List<dynamic>();
            
//         //     try
//         //     {
//         //         var sql = @"
//         //             SELECT DISTINCT 
//         //                 s.Reg_Id as StudentID,
//         //                 u.ID as ParentID,
//         //                 d.FCMToken as DeviceToken,
//         //                 s.Frist_Name as StudentName,
//         //                 s.RollNo as RollNumber,
//         //                 s.Class_ID as ClassID,
//         //                 s.Section_ID as SectionID,
//         //                 m.AttDate as AttendanceDate,
//         //                 a.Status as AttendanceStatus,
//         //                 a.Remarks as StudentRemarks,
//         //                 c.Class_Name as ClassName,
//         //                 sec.Section as SectionName
//         //             FROM tbl_StudentRegistration s
//         //             INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//         //             INNER JOIN tbl_StudentAttDetail a ON s.Reg_Id = a.RegID
//         //             INNER JOIN tbl_StudentAttMaster m ON a.MasterId = m.ID
//         //             INNER JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
//         //             LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
//         //             LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//         //             WHERE u.Status = 1
//         //                 AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active'))
//         //                 AND (UPPER(a.Status) = 'A' OR UPPER(a.Status) = 'ABSENT' OR a.Status LIKE '%Absent%')
//         //                 AND CAST(m.AttDate AS DATE) = CAST(GETDATE() AS DATE)";

//         //         var result = await _context.Database.SqlQueryRaw<AttendanceTargetUser>(sql).ToListAsync();

//         //         _logger.LogInformation("📊 Found {Count} attendance records for rule {RuleID}", result.Count, rule.RuleID);

//         //         foreach (var item in result)
//         //         {
//         //             dynamic user = new ExpandoObject();
//         //             user.UserID = item.ParentID;
//         //             user.UserType = "PARENT";
//         //             user.DeviceToken = item.DeviceToken;
//         //             user.StudentID = item.StudentID;
//         //             user.StudentName = item.StudentName;
//         //             user.RollNumber = item.RollNumber;
//         //             user.ClassID = item.ClassID;
//         //             user.SectionID = item.SectionID;
//         //             user.AttendanceDate = item.AttendanceDate;
//         //             user.AttendanceStatus = item.AttendanceStatus;
//         //             user.StudentRemarks = item.StudentRemarks;
//         //             user.ClassName = item.ClassName;
//         //             user.SectionName = item.SectionName;
                    
//         //             users.Add(user);
//         //         }
//         //     }
//         //     catch (Exception ex)
//         //     {
//         //         _logger.LogError(ex, "❌ Error getting attendance target users for rule {RuleID}", rule.RuleID);
//         //     }
            
//         //     return users;
//         // }


// private async Task<List<dynamic>> GetAttendanceTargetUsersAsync(NotificationRule rule)
// {
//     var users = new List<dynamic>();
    
//     try
//     {
//         var pakistanNow = GetPakistanTime();
//         var today = pakistanNow.Date;
        
//         var sql = @"
//             SELECT DISTINCT 
//                 s.Reg_Id as StudentID,
//                 u.ID as ParentID,
//                 ISNULL(d.FCMToken, '') as DeviceToken,
//                 ISNULL(s.Frist_Name, '') as StudentName,
//                 s.RollNo as RollNumber,
//                 s.Class_ID as ClassID,
//                 s.Section_ID as SectionID,
//                 m.AttDate as AttendanceDate,
//                 ISNULL(a.Status, '') as AttendanceStatus,
//                 ISNULL(a.Remarks, '') as StudentRemarks,
//                 ISNULL(c.Class_Name, '') as ClassName,
//                 ISNULL(sec.Section, '') as SectionName
//             FROM tbl_StudentRegistration s
//             INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//             INNER JOIN tbl_StudentAttDetail a ON s.Reg_Id = a.RegID
//             INNER JOIN tbl_StudentAttMaster m ON a.MasterId = m.ID
//             INNER JOIN tbl_AddClass c ON s.Class_ID = c.Class_ID
//             LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.ID
//             LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//             WHERE u.Status = 1
//                 AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A', 'Active'))
//                 AND (UPPER(a.Status) = 'A' OR UPPER(a.Status) = 'ABSENT' OR a.Status LIKE '%Absent%')
//                 AND CAST(m.AttDate AS DATE) = @todayDate";

//         var result = await _context.Database.SqlQueryRaw<AttendanceTargetUser>(sql, new SqlParameter("@todayDate", today)).ToListAsync();

//         _logger.LogInformation("📊 Found {Count} attendance records for rule {RuleID}", result.Count, rule.RuleID);

//         foreach (var item in result)
//         {
//             dynamic user = new ExpandoObject();
//             var dict = user as IDictionary<string, object>;
            
//             dict["UserID"] = item.ParentID;
//             dict["UserType"] = "PARENT";
//             dict["DeviceToken"] = item.DeviceToken ?? string.Empty;  // Now this will have value from UserDevices
//             dict["StudentID"] = item.StudentID;
//             dict["StudentName"] = item.StudentName ?? "";
//             dict["RollNumber"] = item.RollNumber ?? 0;
//             dict["ClassID"] = item.ClassID ?? 0;
//             dict["SectionID"] = item.SectionID ?? 0;
//             dict["AttendanceDate"] = item.AttendanceDate;
//             dict["AttendanceStatus"] = item.AttendanceStatus ?? "";
//             dict["StudentRemarks"] = item.StudentRemarks ?? "";
//             dict["ClassName"] = item.ClassName ?? "";
//             dict["SectionName"] = item.SectionName ?? "";
            
//             _logger.LogDebug("Added user: ParentID={ParentID}, DeviceToken={Token}", 
//                 item.ParentID, string.IsNullOrEmpty(item.DeviceToken) ? "EMPTY" : "HAS_TOKEN");
            
//             users.Add(user);
//         }
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error getting attendance target users for rule {RuleID}", rule.RuleID);
//     }
    
//     return users;
// }

//         private async Task<List<dynamic>> GetExamTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var sql = @"
//                     SELECT DISTINCT 
//                         s.Reg_Id as StudentID,
//                         u.ID as ParentID,
//                         d.FCMToken as DeviceToken,
//                         s.Frist_Name as StudentName,
//                         s.RollNo as RollNumber,
//                         s.Class_ID as ClassID,
//                         s.Section_ID as SectionID,
//                         e.ExamTitle,
//                         e.ExamDate,
//                         e.Subject,
//                         e.TotalMarks,
//                         e.PassingMarks,
//                         c.ClassName,
//                         sec.SectionName
//                     FROM tbl_StudentRegistration s
//                     INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//                     INNER JOIN tbl_Exams e ON s.Class_ID = e.ClassID
//                     INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
//                     LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
//                     LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//                     WHERE u.Status = 1
//                         AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
//                         AND CAST(e.ExamDate AS DATE) >= CAST(GETDATE() AS DATE)
//                         AND CAST(e.ExamDate AS DATE) <= DATEADD(DAY, 7, CAST(GETDATE() AS DATE))";

//                 var result = await _context.Database.SqlQueryRaw<ExamTargetUser>(sql).ToListAsync();

//                 _logger.LogInformation("📚 Found {Count} exam records for rule {RuleID}", result.Count, rule.RuleID);

//                 foreach (var item in result)
//                 {
//                     dynamic user = new ExpandoObject();
//                     user.UserID = item.ParentID;
//                     user.UserType = "PARENT";
//                     user.DeviceToken = item.DeviceToken;
//                     user.StudentID = item.StudentID;
//                     user.StudentName = item.StudentName;
//                     user.RollNumber = item.RollNumber;
//                     user.ClassID = item.ClassID;
//                     user.SectionID = item.SectionID;
//                     user.ExamTitle = item.ExamTitle;
//                     user.ExamDate = item.ExamDate;
//                     user.Subject = item.Subject;
//                     user.TotalMarks = item.TotalMarks;
//                     user.PassingMarks = item.PassingMarks;
//                     user.ClassName = item.ClassName;
//                     user.SectionName = item.SectionName;
                    
//                     users.Add(user);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting exam target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetHomeworkTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var sql = @"
//                     SELECT DISTINCT 
//                         s.Reg_Id as StudentID,
//                         u.ID as ParentID,
//                         d.FCMToken as DeviceToken,
//                         s.Frist_Name as StudentName,
//                         s.RollNo as RollNumber,
//                         s.Class_ID as ClassID,
//                         s.Section_ID as SectionID,
//                         h.HomeworkTitle,
//                         h.HomeworkDescription,
//                         h.Subject,
//                         h.DueDate,
//                         h.AssignedDate,
//                         c.ClassName,
//                         sec.SectionName
//                     FROM tbl_StudentRegistration s
//                     INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//                     INNER JOIN tbl_Homework h ON s.Class_ID = h.ClassID
//                     INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
//                     LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
//                     LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//                     WHERE u.Status = 1
//                         AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
//                         AND CAST(h.DueDate AS DATE) >= CAST(GETDATE() AS DATE)
//                         AND CAST(h.DueDate AS DATE) <= DATEADD(DAY, 3, CAST(GETDATE() AS DATE))";

//                 var result = await _context.Database.SqlQueryRaw<HomeworkTargetUser>(sql).ToListAsync();

//                 _logger.LogInformation("📝 Found {Count} homework records for rule {RuleID}", result.Count, rule.RuleID);

//                 foreach (var item in result)
//                 {
//                     dynamic user = new ExpandoObject();
//                     user.UserID = item.ParentID;
//                     user.UserType = "PARENT";
//                     user.DeviceToken = item.DeviceToken;
//                     user.StudentID = item.StudentID;
//                     user.StudentName = item.StudentName;
//                     user.RollNumber = item.RollNumber;
//                     user.ClassID = item.ClassID;
//                     user.SectionID = item.SectionID;
//                     user.HomeworkTitle = item.HomeworkTitle;
//                     user.HomeworkDescription = item.HomeworkDescription;
//                     user.Subject = item.Subject;
//                     user.DueDate = item.DueDate;
//                     user.AssignedDate = item.AssignedDate;
//                     user.ClassName = item.ClassName;
//                     user.SectionName = item.SectionName;
                    
//                     users.Add(user);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting homework target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetEventTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var sql = @"
//                     SELECT DISTINCT 
//                         s.Reg_Id as StudentID,
//                         u.ID as ParentID,
//                         d.FCMToken as DeviceToken,
//                         s.Frist_Name as StudentName,
//                         s.RollNo as RollNumber,
//                         s.Class_ID as ClassID,
//                         s.Section_ID as SectionID,
//                         e.EventTitle,
//                         e.EventDescription,
//                         e.EventDate,
//                         e.EventTime,
//                         e.Location,
//                         c.ClassName,
//                         sec.SectionName
//                     FROM tbl_StudentRegistration s
//                     INNER JOIN tbl_User u ON s.Family_Code = u.FamilyID
//                     INNER JOIN tbl_Events e ON s.Class_ID = e.ClassID
//                     INNER JOIN tbl_AddClass c ON s.Class_ID = c.ClassID
//                     LEFT JOIN tbl_AddSection sec ON s.Section_ID = sec.SectionID
//                     LEFT JOIN UserDevices d ON u.ID = d.UserID AND d.IsActive = 1
//                     WHERE u.Status = 1
//                         AND (s.cur_Status IS NULL OR s.cur_Status IN ('Admission', 'A'))
//                         AND CAST(e.EventDate AS DATE) >= CAST(GETDATE() AS DATE)";

//                 var result = await _context.Database.SqlQueryRaw<EventTargetUser>(sql).ToListAsync();

//                 _logger.LogInformation("🎉 Found {Count} event records for rule {RuleID}", result.Count, rule.RuleID);

//                 foreach (var item in result)
//                 {
//                     dynamic user = new ExpandoObject();
//                     user.UserID = item.ParentID;
//                     user.UserType = "PARENT";
//                     user.DeviceToken = item.DeviceToken;
//                     user.StudentID = item.StudentID;
//                     user.StudentName = item.StudentName;
//                     user.RollNumber = item.RollNumber;
//                     user.ClassID = item.ClassID;
//                     user.SectionID = item.SectionID;
//                     user.EventTitle = item.EventTitle;
//                     user.EventDescription = item.EventDescription;
//                     user.EventDate = item.EventDate;
//                     user.EventTime = item.EventTime;
//                     user.Location = item.Location;
//                     user.ClassName = item.ClassName;
//                     user.SectionName = item.SectionName;
                    
//                     users.Add(user);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting event target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         private async Task<List<dynamic>> GetGenericTargetUsersAsync(NotificationRule rule)
//         {
//             var users = new List<dynamic>();
            
//             try
//             {
//                 var allUsers = await _context.tbl_User
//                     .Where(u => u.Status == true)
//                     .Select(u => new { u.ID, u.RoleID, u.Name })
//                     .ToListAsync();
                
//                 foreach (var user in allUsers)
//                 {
//                     dynamic userObj = new ExpandoObject();
//                     userObj.UserID = user.ID;
//                     userObj.UserType = GetUserTypeFromRole(user.RoleID ?? 0);
//                     userObj.UserName = user.Name;
//                     users.Add(userObj);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error getting generic target users for rule {RuleID}", rule.RuleID);
//             }
            
//             return users;
//         }

//         // ==================== NOTIFICATION PROCESSING METHODS ====================

//         private async Task<List<NotificationQueue>> ProcessFeeNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             try
//             {
//                 var ruleSettings = ParseRuleSettings(rule);
                
//                 Guid? batchId = null;
//                 if (rule.IsBatch)
//                 {
//                     batchId = await CreateBatchNotificationAsync(rule, targetUsers.Count);
//                 }

//                 foreach (var user in targetUsers)
//                 {
//                     try
//                     {
//                         var notification = await CreateFeeNotificationAsync(rule, user, ruleSettings, batchId);
//                         if (notification != null)
//                             notifications.Add(notification);
//                     }
//                     catch (Exception ex)
//                     {
//                         _logger.LogError(ex, "❌ Error creating fee notification for user");
//                     }
//                 }

//                 if (batchId.HasValue)
//                 {
//                     await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error processing fee notifications");
//             }
            
//             return notifications;
//         }

// private async Task<NotificationQueue> CreateFeeNotificationAsync(
//     NotificationRule rule, 
//     dynamic userData, 
//     Dictionary<string, object> ruleSettings,
//     Guid? batchId = null)
// {
//     try
//     {
//         var userId = GetUserId(userData);
//         if (userId == 0)
//         {
//             _logger.LogWarning("⚠️ Invalid UserID for notification rule {RuleID}", rule.RuleID);
//             return null;
//         }

//         int concreteUserId = userId;
//         var pakistanNow = GetPakistanTime();
//         var today = pakistanNow.Date;

//         var device = await _context.UserDevices
//             .FirstOrDefaultAsync(d => d.UserID == concreteUserId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
        
//         string? fcmToken = device?.FCMToken;

//         if (string.IsNullOrEmpty(fcmToken))
//         {
//             _logger.LogWarning("⚠️ No FCM token found for user {UserID} in rule {RuleID}", 
//                 concreteUserId, rule.RuleID);
//             return null;
//         }

//         string userType = GetUserType(userData) ?? "USER";

//         string notificationType = "FEE_REMINDER";
//         string statusText = "Fee pending";
        
//         if (userData.DueDate is DateOnly dueDateObj)
//         {
//             var dueDate = dueDateObj.ToDateTime(TimeOnly.MinValue);
//             var daysUntilDue = (dueDate - today).Days;
//             var daysOverdue = (today - dueDate).Days;
            
//             if (daysUntilDue > 0)
//             {
//                 notificationType = $"DUE_IN_{daysUntilDue}_DAYS";
//                 statusText = $"Due in {daysUntilDue} days";
//             }
//             else if (daysOverdue >= 0)
//             {
//                 notificationType = $"OVERDUE_{daysOverdue}_DAYS";
//                 statusText = $"Overdue by {daysOverdue} days";
//             }
//         }

//         var dataDict = ConvertToDictionary(userData);
//         dataDict["NotificationType"] = notificationType;
//         dataDict["StatusText"] = statusText;
//         dataDict["CurrentDate"] = today.ToString("dd/MM/yyyy");
//         dataDict["CurrentTime"] = pakistanNow.ToString("HH:mm");
        
//         var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Fee Payment Reminder", dataDict);
//         var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} has pending fee", dataDict);
        
//         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
//         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
        
//         if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Fee Payment Reminder";
//         if (string.IsNullOrEmpty(messagePlain)) messagePlain = "You have a pending fee payment";
        
//         string dataPayload;
//         if (!string.IsNullOrEmpty(rule.DataTemplate))
//         {
//             dataPayload = await ResolveTemplate(rule.DataTemplate, dataDict);
//         }
//         else
//         {
//             var payloadData = new Dictionary<string, object>
//             {
//                 ["action"] = "view_fee_details",
//                 ["studentId"] = userData.StudentID,
//                 ["challanNo"] = userData.ChallanNo,
//                 ["feePostingId"] = userData.FeePostingID,
//                 ["amount"] = userData.RemainingAmount,
//                 ["dueDate"] = userData.DueDate?.ToString("yyyy-MM-dd"),
//                 ["daysOverdue"] = userData.DaysOverdue,
//                 ["notificationType"] = notificationType,
//                 ["category"] = rule.Category,
//                 ["titleHtml"] = titleHtml,
//                 ["messageHtml"] = messageHtml,
//                 ["isHtml"] = true
//             };
            
//             if (batchId.HasValue)
//                 payloadData["batchId"] = batchId.Value;
            
//             dataPayload = JsonConvert.SerializeObject(payloadData);
//         }

//         var notification = new NotificationQueue
//         {
//             RuleID = rule.RuleID,
//             UserID = concreteUserId,
//             UserType = userType,
//             DeviceToken = fcmToken,
//             Title = titlePlain,
//             Message = messagePlain,
//             DataPayload = dataPayload,
//             Status = "PENDING",
//             Priority = rule.Priority,
//             ScheduledTime = pakistanNow,
//             ExpiryTime = pakistanNow.AddDays(7),
//             CreatedTime = pakistanNow,
//             AttemptCount = 0,
//             LastAttemptTime = null,
//             ErrorMessage = null
//         };

//         _context.NotificationQueue.Add(notification);
//         await _context.SaveChangesAsync();
        
//         return notification;
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error creating fee notification");
//         return null;
//     }
// }

//         // private async Task<List<NotificationQueue>> ProcessAttendanceNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         // {
//         //     var notifications = new List<NotificationQueue>();
            
//         //     try
//         //     {
//         //         var ruleSettings = ParseRuleSettings(rule);
                
//         //         var parents = targetUsers
//         //             .GroupBy(u => (int)u.UserID)
//         //             .Select(g => new
//         //             {
//         //                 ParentID = g.Key,
//         //                 Students = g.ToList(),
//         //                 DeviceToken = g.First().DeviceToken
//         //             })
//         //             .ToList();

//         //         Guid? batchId = null;
//         //         if (rule.IsBatch)
//         //         {
//         //             batchId = await CreateBatchNotificationAsync(rule, parents.Count);
//         //         }

//         //         foreach (var parent in parents)
//         //         {
//         //             try
//         //             {
//         //                 var notification = await CreateAttendanceNotificationAsync(rule, parent.ParentID, parent.Students, ruleSettings, batchId);
//         //                 if (notification != null)
//         //                     notifications.Add(notification);
//         //             }
//         //             catch (Exception ex)
//         //             {
//         //                 _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parent.ParentID);
//         //             }
//         //         }

//         //         if (batchId.HasValue)
//         //         {
//         //             await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
//         //         }
//         //     }
//         //     catch (Exception ex)
//         //     {
//         //         _logger.LogError(ex, "❌ Error processing attendance notifications");
//         //     }
            
//         //     return notifications;
//         // }

// private async Task<List<NotificationQueue>> ProcessAttendanceNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
// {
//     var notifications = new List<NotificationQueue>();
    
//     try
//     {
//         var ruleSettings = ParseRuleSettings(rule);
        
//         _logger.LogInformation("🔍 Processing {Count} total target users for rule {RuleID}", targetUsers.Count, rule.RuleID);
        
//         if (!targetUsers.Any())
//         {
//             _logger.LogWarning("⚠️ No target users found for rule {RuleID}", rule.RuleID);
//             return notifications;
//         }
        
//         // Get unique Parent IDs from target users
//         var parentIds = targetUsers.Select(u => (int)u.UserID).Distinct().ToList();
//         _logger.LogInformation("👥 Found {Count} unique parent IDs: {ParentIds}", parentIds.Count, string.Join(", ", parentIds));
        
//         // Get all device tokens from UserDevices table for these parents
//         var devices = await _context.UserDevices
//             .Where(d => parentIds.Contains(d.UserID) && d.IsActive && !string.IsNullOrEmpty(d.FCMToken))
//             .ToDictionaryAsync(d => d.UserID, d => d.FCMToken);
        
//         _logger.LogInformation("📱 Found {Count} devices with valid FCM tokens", devices.Count);
        
//         // Filter target users to only those with valid device tokens
//         var validUsers = new List<dynamic>();
//         foreach (var user in targetUsers)
//         {
//             int userId = (int)user.UserID;
//             if (devices.ContainsKey(userId))
//             {
//                 validUsers.Add(user);
//                 _logger.LogInformation("✅ User {UserId} has valid FCM token", userId);
//             }
//             else
//             {
//                 _logger.LogWarning("⚠️ User {UserId} has no valid FCM token in UserDevices table", userId);
//             }
//         }
        
//         if (!validUsers.Any())
//         {
//             _logger.LogWarning("⚠️ No valid users with device tokens found for rule {RuleID}", rule.RuleID);
//             return notifications;
//         }
        
//         _logger.LogInformation("👥 Found {Count} users with valid device tokens out of {Total}", 
//             validUsers.Count, targetUsers.Count);
        
//         // Group by Parent ID
//         var parents = validUsers
//             .GroupBy(u => (int)u.UserID)
//             .Select(g => new
//             {
//                 ParentID = g.Key,
//                 Students = g.ToList()
//                 // Don't store DeviceToken here - we'll get it from dictionary
//             })
//             .ToList();

//         Guid? batchId = null;
//         if (rule.IsBatch)
//         {
//             batchId = await CreateBatchNotificationAsync(rule, parents.Count);
//         }

//         foreach (var parent in parents)
//         {
//             try
//             {
//                 // Get token from dictionary
//                 string fcmToken = devices[parent.ParentID];
                
//                 var notification = await CreateAttendanceNotificationAsync(rule, parent.ParentID, parent.Students, fcmToken, ruleSettings, batchId);
//                 if (notification != null)
//                     notifications.Add(notification);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parent.ParentID);
//             }
//         }

//         if (batchId.HasValue)
//         {
//             await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
//         }
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error processing attendance notifications");
//     }
    
//     return notifications;
// }




// //     private async Task<NotificationQueue> CreateAttendanceNotificationAsync(
// //     NotificationRule rule, 
// //     int parentId, 
// //     List<dynamic> students, 
// //     Dictionary<string, object> ruleSettings,
// //     Guid? batchId = null)
// // {
// //     try
// //     {
// //         var device = await _context.UserDevices
// //             .FirstOrDefaultAsync(d => d.UserID == parentId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
        
// //         string? fcmToken = device?.FCMToken;

// //         if (string.IsNullOrEmpty(fcmToken))
// //         {
// //             _logger.LogWarning("⚠️ No FCM token found for parent {ParentID}, skipping notification", parentId);
// //             return null;
// //         }

// //         var parent = await _context.tbl_User
// //             .Where(u => u.ID == parentId)
// //             .Select(u => u.Name)
// //             .FirstOrDefaultAsync();

// //         var studentNames = string.Join(", ", students.Select(s => s.StudentName ?? ""));
// //         var rollNumbers = string.Join(", ", students.Select(s => s.RollNumber?.ToString() ?? "N/A"));
        
// //         var data = new Dictionary<string, object>
// //         {
// //             ["StudentID"] = students.First().StudentID,
// //             ["StudentName"] = studentNames,
// //             ["StudentCount"] = students.Count,
// //             ["RollNumber"] = rollNumbers,
// //             ["AttendanceDate"] = students.First().AttendanceDate?.ToString("dd/MM/yyyy") ?? DateTime.Today.ToString("dd/MM/yyyy"),
// //             ["Date"] = DateTime.Today.ToString("dd/MM/yyyy"),
// //             ["Status"] = "Absent",
// //             ["Remarks"] = students.First().StudentRemarks ?? "",
// //             ["MultipleStudents"] = students.Count > 1,
// //             ["ClassName"] = students.First().ClassName ?? "",
// //             ["SectionName"] = students.First().SectionName ?? "",
// //             ["ParentName"] = parent ?? "Parent"
// //         };

// //         var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Attendance Alert", data);
// //         var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} was {Status} on {Date}", data);
        
// //         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
// //         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
        
// //         if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Attendance Alert";
// //         if (string.IsNullOrEmpty(messagePlain)) messagePlain = "Student was absent today";

// //         var pakistanNow = GetPakistanTime();

// //         var notification = new NotificationQueue
// //         {
// //             RuleID = rule.RuleID,
// //             UserID = parentId,
// //             UserType = "PARENT",
// //             Title = titlePlain,
// //             Message = messagePlain,
// //             Status = "PENDING",
// //             Priority = rule.Priority,
// //             ScheduledTime = pakistanNow,
// //             CreatedTime = pakistanNow,
// //             ExpiryTime = pakistanNow.AddDays(7),
// //             DataPayload = JsonConvert.SerializeObject(new { 
// //                 data, 
// //                 titleHtml, 
// //                 messageHtml, 
// //                 isHtml = true 
// //             }),
// //             DeviceToken = fcmToken,
// //             AttemptCount = 0,
// //             LastAttemptTime = null,
// //             ErrorMessage = null
// //         };

// //         _context.NotificationQueue.Add(notification);
// //         await _context.SaveChangesAsync();
        
// //         return notification;
// //     }
// //     catch (Exception ex)
// //     {
// //         _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parentId);
// //         return null;
// //     }
// // }
// private async Task<NotificationQueue> CreateAttendanceNotificationAsync(
//     NotificationRule rule, 
//     int parentId, 
//     List<dynamic> students, 
//     string fcmToken,  // Pass token directly instead of querying again
//     Dictionary<string, object> ruleSettings,
//     Guid? batchId = null)
// {
//     try
//     {
//         if (string.IsNullOrEmpty(fcmToken))
//         {
//             _logger.LogWarning("⚠️ No FCM token provided for parent {ParentID}, skipping notification", parentId);
//             return null;
//         }

//         var parent = await _context.tbl_User
//             .Where(u => u.ID == parentId)
//             .Select(u => u.Name)
//             .FirstOrDefaultAsync();

//         var studentNames = string.Join(", ", students.Select(s => s.StudentName ?? ""));
//         var rollNumbers = string.Join(", ", students.Select(s => s.RollNumber?.ToString() ?? "N/A"));
        
//         var pakistanNow = GetPakistanTime();
//         var today = pakistanNow.Date;
        
//         var data = new Dictionary<string, object>
//         {
//             ["StudentID"] = students.First().StudentID,
//             ["StudentName"] = studentNames,
//             ["StudentCount"] = students.Count,
//             ["RollNumber"] = rollNumbers,
//             ["AttendanceDate"] = students.First().AttendanceDate?.ToString("dd/MM/yyyy") ?? today.ToString("dd/MM/yyyy"),
//             ["Date"] = today.ToString("dd/MM/yyyy"),
//             ["Status"] = "Absent",
//             ["Remarks"] = students.First().StudentRemarks ?? "",
//             ["MultipleStudents"] = students.Count > 1,
//             ["ClassName"] = students.First().ClassName ?? "",
//             ["SectionName"] = students.First().SectionName ?? "",
//             ["ParentName"] = parent ?? "Parent",
//             ["BatchId"] = batchId
//         };

//         var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Attendance Alert", data);
//         var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "{StudentName} was {Status} on {Date}", data);
        
//         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
//         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
        
//         if (string.IsNullOrEmpty(titlePlain)) titlePlain = "Attendance Alert";
//         if (string.IsNullOrEmpty(messagePlain)) messagePlain = "Student was absent today";

//         var payloadData = new Dictionary<string, object>
//         {
//             ["data"] = data,
//             ["titleHtml"] = titleHtml,
//             ["messageHtml"] = messageHtml,
//             ["isHtml"] = true,
//             ["action"] = "view_attendance",
//             ["parentId"] = parentId,
//             ["studentCount"] = students.Count
//         };
        
//         if (batchId.HasValue)
//             payloadData["batchId"] = batchId.Value;

//         var notification = new NotificationQueue
//         {
//             RuleID = rule.RuleID,
//             UserID = parentId,
//             UserType = "PARENT",
//             Title = titlePlain,
//             Message = messagePlain,
//             Status = "PENDING",
//             Priority = rule.Priority,
//             ScheduledTime = pakistanNow,
//             CreatedTime = pakistanNow,
//             ExpiryTime = pakistanNow.AddDays(7),
//             DataPayload = JsonConvert.SerializeObject(payloadData),
//             DeviceToken = fcmToken,
//             AttemptCount = 0,
//             LastAttemptTime = null,
//             ErrorMessage = null
//         };

//         _context.NotificationQueue.Add(notification);
//         await _context.SaveChangesAsync();
        
//         _logger.LogInformation("✅ Created attendance notification {QueueID} for parent {ParentID} with {Count} students", 
//             notification.QueueID, parentId, students.Count);
        
//         return notification;
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error creating attendance notification for parent {ParentID}", parentId);
//         return null;
//     }
// }

//         private async Task<List<NotificationQueue>> ProcessExamNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "EXAM");
//         }

//         private async Task<List<NotificationQueue>> ProcessHomeworkNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "HOMEWORK");
//         }

//         private async Task<List<NotificationQueue>> ProcessAnnouncementNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "ANNOUNCEMENT");
//         }

//         private async Task<List<NotificationQueue>> ProcessGeneralNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "GENERAL");
//         }

//         private async Task<List<NotificationQueue>> ProcessAlertNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "ALERT");
//         }

//         private async Task<List<NotificationQueue>> ProcessEventNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers)
//         {
//             return await ProcessGenericNotificationsAsync(rule, targetUsers, "EVENT");
//         }

//         private async Task<List<NotificationQueue>> ProcessGenericNotificationsAsync(NotificationRule rule, List<dynamic> targetUsers, string category = null)
//         {
//             var notifications = new List<NotificationQueue>();
            
//             try
//             {
//                 var ruleSettings = ParseRuleSettings(rule);
                
//                 Guid? batchId = null;
//                 if (rule.IsBatch)
//                 {
//                     batchId = await CreateBatchNotificationAsync(rule, targetUsers.Count);
//                 }

//                 foreach (var user in targetUsers)
//                 {
//                     try
//                     {
//                         var notification = await CreateGenericNotificationAsync(rule, user, ruleSettings, category, batchId);
//                         if (notification != null)
//                             notifications.Add(notification);
//                     }
//                     catch (Exception ex)
//                     {
//                         _logger.LogError(ex, "❌ Error creating generic notification for user");
//                     }
//                 }

//                 if (batchId.HasValue)
//                 {
//                     await UpdateBatchNotificationAsync(batchId.Value, notifications.Count);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error processing generic notifications");
//             }
            
//             return notifications;
//         }

// private async Task<NotificationQueue> CreateGenericNotificationAsync(
//     NotificationRule rule, 
//     dynamic userData, 
//     Dictionary<string, object> ruleSettings,
//     string category = null,
//     Guid? batchId = null)
// {
//     try
//     {
//         var userId = GetUserId(userData);
//         if (userId == 0)
//         {
//             _logger.LogWarning("⚠️ Invalid UserID for notification rule {RuleID}", rule.RuleID);
//             return null;
//         }

//         int concreteUserId = userId;
//         var pakistanNow = GetPakistanTime();
//         var today = pakistanNow.Date;

//         var device = await _context.UserDevices
//             .FirstOrDefaultAsync(d => d.UserID == concreteUserId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
        
//         string? fcmToken = device?.FCMToken;

//         if (string.IsNullOrEmpty(fcmToken))
//         {
//             _logger.LogWarning("⚠️ No FCM token found for user {UserID} in rule {RuleID}", 
//                 concreteUserId, rule.RuleID);
//             return null;
//         }

//         // FIXED: Convert GetUserType result to string to avoid dynamic dispatch
//         string userType = GetUserType(userData) ?? "USER";
        
//         string? parentName = null;
//         if (userType == "PARENT")
//         {
//             parentName = await _context.tbl_User
//                 .Where(u => u.ID == concreteUserId)
//                 .Select(u => u.Name)
//                 .FirstOrDefaultAsync();
//         }

//         var dataDict = ConvertToDictionary(userData);
        
//         dataDict["CurrentDate"] = today.ToString("dd/MM/yyyy");
//         dataDict["CurrentTime"] = pakistanNow.ToString("HH:mm");
//         dataDict["RuleName"] = rule.RuleName;
//         dataDict["Category"] = category ?? rule.Category;
        
//         if (!string.IsNullOrEmpty(parentName))
//         {
//             dataDict["ParentName"] = parentName;
//         }

//         // Resolve templates - these may contain HTML
//         var titleHtml = await ResolveTemplate(rule.TitleTemplate ?? "Notification", dataDict);
//         var messageHtml = await ResolveTemplate(rule.MessageTemplate ?? "You have a new notification", dataDict);
        
//         // CRITICAL: Convert HTML to plain text for Firebase notification
//         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
//         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);
        
//         // Ensure we have non-empty values
//         if (string.IsNullOrEmpty(titlePlain))
//         {
//             titlePlain = "School Notification";
//         }
//         if (string.IsNullOrEmpty(messagePlain))
//         {
//             messagePlain = "You have a new notification from your school";
//         }
        
//         // FIXED: Store values in local variables before logging
//         bool hasHtml = (titleHtml != titlePlain) || (messageHtml != messagePlain);
//         string logTitle = titlePlain ?? "Empty Title";
        
//         _logger.LogInformation("📝 Creating notification for user {UserId} - Title: '{Title}', HasHtml: {HasHtml}", 
//             concreteUserId, logTitle, hasHtml);
        
//         string dataPayload;
//         if (!string.IsNullOrEmpty(rule.DataTemplate))
//         {
//             dataPayload = await ResolveTemplate(rule.DataTemplate, dataDict);
//         }
//         else
//         {
//             var payloadData = new Dictionary<string, object>
//             {
//                 ["action"] = "view_notification",
//                 ["userId"] = userId,
//                 ["category"] = category ?? rule.Category,
//                 ["ruleId"] = rule.RuleID,
//                 ["timestamp"] = pakistanNow.ToString("yyyy-MM-ddTHH:mm:ss"),
//                 ["titleHtml"] = titleHtml,
//                 ["messageHtml"] = messageHtml,
//                 ["isHtml"] = true
//             };
            
//             if (batchId.HasValue)
//                 payloadData["batchId"] = batchId.Value;
            
//             dataPayload = JsonConvert.SerializeObject(payloadData);
//         }

//         var notification = new NotificationQueue
//         {
//             RuleID = rule.RuleID,
//             UserID = concreteUserId,
//             UserType = userType,  // FIXED: Use the string variable instead of dynamic method call
//             DeviceToken = fcmToken,
//             Title = titlePlain,
//             Message = messagePlain,
//             DataPayload = dataPayload,
//             Status = "PENDING",
//             Priority = rule.Priority,
//             ScheduledTime = pakistanNow,
//             ExpiryTime = pakistanNow.AddDays(7),
//             CreatedTime = pakistanNow,
//             AttemptCount = 0,
//             LastAttemptTime = null,
//             ErrorMessage = null
//         };

//         _context.NotificationQueue.Add(notification);
//         await _context.SaveChangesAsync();
        
//         _logger.LogInformation("✅ Created notification {QueueID} for user {UserID}", 
//             notification.QueueID, concreteUserId);
        
//         return notification;
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error creating generic notification for user");
//         return null;
//     }
// }


//         // ==================== HELPER METHODS ====================

//         private async Task<Guid> CreateBatchNotificationAsync(NotificationRule rule, int totalRecipients)
//         {
//             try
//             {
//                 var batchId = Guid.NewGuid();
                
//                 var batchNotification = new BatchNotification
//                 {
//                     BatchID = batchId,
//                     RuleID = rule.RuleID,
//                     Title = rule.TitleTemplate,
//                     Message = rule.MessageTemplate,
//                     TargetType = rule.TargetType ?? "ALL",
//                     TargetFilter = rule.TargetFilter,
//                     TotalRecipients = totalRecipients,
//                     Status = "PROCESSING",
//                     CreatedTime = GetPakistanTime()
//                 };

//                 _context.BatchNotifications.Add(batchNotification);
//                 await _context.SaveChangesAsync();

//                 _logger.LogInformation("📦 Created batch notification {BatchID} for rule {RuleID} with {Count} recipients", 
//                     batchId, rule.RuleID, totalRecipients);

//                 return batchId;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error creating batch notification");
//                 return Guid.Empty;
//             }
//         }

//         private async Task UpdateBatchNotificationAsync(Guid batchId, int sentCount)
//         {
//             try
//             {
//                 var batchNotification = await _context.BatchNotifications
//                     .FirstOrDefaultAsync(b => b.BatchID == batchId);

//                 if (batchNotification != null)
//                 {
//                     batchNotification.SentCount = sentCount;
//                     batchNotification.FailedCount = batchNotification.TotalRecipients - sentCount;
//                     batchNotification.Status = sentCount > 0 ? "COMPLETED" : "FAILED";
//                     batchNotification.CompletedTime = GetPakistanTime();

//                     await _context.SaveChangesAsync();

//                     _logger.LogInformation("📊 Updated batch notification {BatchID}: Sent={Sent}, Failed={Failed}", 
//                         batchId, sentCount, batchNotification.FailedCount);
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error updating batch notification");
//             }
//         }

//         private Dictionary<string, object> ParseRuleSettings(NotificationRule rule)
//         {
//             var settings = new Dictionary<string, object>();
            
//             try
//             {
//                 if (!string.IsNullOrEmpty(rule.TargetFilter) && rule.TargetFilter != "{}")
//                 {
//                     settings = JsonConvert.DeserializeObject<Dictionary<string, object>>(rule.TargetFilter) ?? new Dictionary<string, object>();
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error parsing rule settings for rule {RuleID}", rule.RuleID);
//             }

//             return settings;
//         }

//         private async Task UpdateRuleStatisticsAsync(NotificationRule rule)
//         {
//             try
//             {
//                 var pakistanNow = GetPakistanTime();
//                 rule.LastRunTime = pakistanNow;
//                 rule.TotalRuns++;
                
//                 if (!rule.IsManualTrigger)
//                 {
//                     rule.NextRunTime = await CalculateNextRunTime(rule);
//                 }
                
//                 rule.ModifiedDate = pakistanNow;
//                 await _context.SaveChangesAsync();
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error updating rule statistics for rule {RuleID}", rule.RuleID);
//             }
//         }

//         public async Task<DateTime?> CalculateNextRunTime(NotificationRule rule)
//         {
//             if (!rule.IsActive || string.IsNullOrEmpty(rule.TimingType))
//                 return null;

//             if (rule.RuleType == "MANUAL" || rule.IsManualTrigger)
//                 return null;

//             var pakistanNow = GetPakistanTime();

//             switch (rule.TimingType.ToUpper())
//             {
//                 case "IMMEDIATE":
//                     return pakistanNow.AddMinutes(5);
                    
//                 case "FIXED_TIME":
//                     if (rule.FixedTime.HasValue)
//                     {
//                         var nextRun = pakistanNow.Date.Add(rule.FixedTime.Value);
//                         if (nextRun <= pakistanNow)
//                             nextRun = nextRun.AddDays(1);
//                         return nextRun;
//                     }
//                     break;
                    
//                 case "DAYS_OFFSET":
//                     if (rule.DaysOffset.HasValue)
//                         return pakistanNow.AddDays(rule.DaysOffset.Value);
//                     break;
                    
//                 case "CRON":
//                     if (!string.IsNullOrEmpty(rule.CronExpression))
//                     {
//                         try
//                         {
//                             var utcNow = pakistanNow.ToUniversalTime();
//                             var parts = rule.CronExpression.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                            
//                             if (parts.Length != 5 && parts.Length != 6)
//                             {
//                                 return null;
//                             }
                            
//                             var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;
//                             var schedule = CronExpression.Parse(rule.CronExpression, format);
                            
//                             var nextUtc = schedule.GetNextOccurrence(utcNow, inclusive: false);
//                             if (nextUtc.HasValue)
//                                 return nextUtc.Value.ToLocalTime();
//                         }
//                         catch (Exception ex)
//                         {
//                             _logger.LogError(ex, "❌ Error parsing cron expression for rule {RuleID}: {Expression}", 
//                                 rule.RuleID, rule.CronExpression);
//                         }
//                     }
//                     break;
                    
//                 case "DAILY":
//                     return pakistanNow.AddDays(1);
                    
//                 case "WEEKLY":
//                     return pakistanNow.AddDays(7);
                    
//                 case "BIWEEKLY":
//                     return pakistanNow.AddDays(14);
                    
//                 case "MONTHLY":
//                     return pakistanNow.AddMonths(1);
//             }

//             return null;
//         }

//         public async Task ScheduleRule(NotificationRule rule)
//         {
//             try
//             {
//                 if (rule.RuleType == "CRON" && !string.IsNullOrEmpty(rule.CronExpression) && !rule.IsManualTrigger)
//                 {
//                     RecurringJob.RemoveIfExists($"notification-rule-{rule.RuleID}");
                    
//                     RecurringJob.AddOrUpdate<INotificationRuleProcessor>(
//                         $"notification-rule-{rule.RuleID}",
//                         processor => processor.ExecuteRuleDirectAsync(rule.RuleID),
//                         rule.CronExpression,
//                         TimeZoneInfo.Local);
                    
//                     _logger.LogInformation("📅 Scheduled cron job for rule {RuleID} with expression: {Expression}", 
//                         rule.RuleID, rule.CronExpression);
//                 }
                
//                 await Task.CompletedTask;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error scheduling rule {RuleID}", rule.RuleID);
//             }
//         }

//         public async Task<string> ResolveTemplate(string template, dynamic data)
//         {
//             if (string.IsNullOrEmpty(template))
//                 return string.Empty;

//             var result = template;
            
//             try
//             {
//                 var dataDict = ConvertToDictionary(data);

//                 foreach (var prop in dataDict)
//                 {
//                     var placeholder = "{" + prop.Key + "}";
//                     var value = prop.Value?.ToString() ?? string.Empty;
                    
//                     if (result.Contains(placeholder))
//                     {
//                         result = result.Replace(placeholder, value);
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogWarning(ex, "⚠️ Error resolving template: {Template}", template);
//             }

//             return result;
//         }

//         private Dictionary<string, object> ConvertToDictionary(dynamic data)
//         {
//             var dict = new Dictionary<string, object>();
            
//             if (data is ExpandoObject expando)
//             {
//                 var expandoDict = expando as IDictionary<string, object>;
//                 foreach (var kvp in expandoDict)
//                 {
//                     dict[kvp.Key] = kvp.Value;
//                 }
//             }
//             else if (data is IDictionary<string, object> dataDict)
//             {
//                 dict = new Dictionary<string, object>(dataDict);
//             }
            
//             return dict;
//         }

//         private int GetUserId(dynamic userData)
//         {
//             try
//             {
//                 if (userData is IDictionary<string, object> dict)
//                 {
//                     if (dict.TryGetValue("UserID", out var userIdObj))
//                         return Convert.ToInt32(userIdObj);
//                     if (dict.TryGetValue("ParentID", out var parentIdObj))
//                         return Convert.ToInt32(parentIdObj);
//                 }
                
//                 return 0;
//             }
//             catch
//             {
//                 return 0;
//             }
//         }

//         private string GetUserType(dynamic userData)
//         {
//             try
//             {
//                 if (userData is IDictionary<string, object> dict && dict.TryGetValue("UserType", out var userTypeObj))
//                 {
//                     return userTypeObj?.ToString() ?? "USER";
//                 }
//                 return "USER";
//             }
//             catch
//             {
//                 return "USER";
//             }
//         }

//         private string GetUserTypeFromRole(int roleId)
//         {
//             return roleId switch
//             {
//                 1 => "ADMIN",
//                 2 => "TEACHER",
//                 3 => "STUDENT",
//                 4 => "PARENT",
//                 _ => "USER"
//             };
//         }

//         [AutomaticRetry(Attempts = 3)]
//         public async Task ExecuteRuleDirectAsync(int ruleId)
//         {
//             try
//             {
//                 _logger.LogInformation("🚀 Hangfire executing rule {RuleID}", ruleId);
                
//                 var rule = await _context.NotificationRules.FindAsync(ruleId);
//                 if (rule == null)
//                 {
//                     _logger.LogWarning("⚠️ Rule {RuleID} not found", ruleId);
//                     return;
//                 }

//                 if (!rule.IsActive)
//                 {
//                     _logger.LogWarning("⏸️ Rule {RuleID} is inactive", ruleId);
//                     return;
//                 }

//                 await ExecuteRuleAsync(rule);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "❌ Error executing rule {RuleID} via Hangfire", ruleId);
//                 throw;
//             }
//         }

//         // Helper Classes for SQL Results
//         private class FeeTargetUser
//         {
//             public int FeePostingID { get; set; }
//             public int StudentID { get; set; }
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public int ParentID { get; set; }
//             public string ParentName { get; set; } = string.Empty;
//             public string ParentMobile { get; set; } = string.Empty;
//             public string DeviceToken { get; set; } = string.Empty;
//             public int? DueAmount { get; set; }
//             public int? LateFee { get; set; }
//             public string FeeMonth { get; set; } = string.Empty;
//             public string FeeYear { get; set; } = string.Empty;
//             public DateOnly? IssueDate { get; set; }
//             public DateOnly? DueDate { get; set; }
//             public int? DaysOverdue { get; set; }
//             public string ChallanNo { get; set; } = string.Empty;
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//             public int? RemainingAmount { get; set; }
//             public int IsFullyPaid { get; set; }
//         }

//         private class AttendanceTargetUser
//         {
//             public int StudentID { get; set; }
//             public int ParentID { get; set; }
//             public string DeviceToken { get; set; } = string.Empty;
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public DateTime? AttendanceDate { get; set; }
//             public string AttendanceStatus { get; set; } = string.Empty;
//             public string StudentRemarks { get; set; } = string.Empty;
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//         }

//         private class ExamTargetUser
//         {
//             public int StudentID { get; set; }
//             public int ParentID { get; set; }
//             public string DeviceToken { get; set; } = string.Empty;
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public string ExamTitle { get; set; } = string.Empty;
//             public DateTime? ExamDate { get; set; }
//             public string Subject { get; set; } = string.Empty;
//             public int? TotalMarks { get; set; }
//             public int? PassingMarks { get; set; }
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//         }

//         private class HomeworkTargetUser
//         {
//             public int StudentID { get; set; }
//             public int ParentID { get; set; }
//             public string DeviceToken { get; set; } = string.Empty;
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public string HomeworkTitle { get; set; } = string.Empty;
//             public string HomeworkDescription { get; set; } = string.Empty;
//             public string Subject { get; set; } = string.Empty;
//             public DateTime? DueDate { get; set; }
//             public DateTime? AssignedDate { get; set; }
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//         }

//         private class EventTargetUser
//         {
//             public int StudentID { get; set; }
//             public int ParentID { get; set; }
//             public string DeviceToken { get; set; } = string.Empty;
//             public string StudentName { get; set; } = string.Empty;
//             public int? RollNumber { get; set; }
//             public int? ClassID { get; set; }
//             public int? SectionID { get; set; }
//             public string EventTitle { get; set; } = string.Empty;
//             public string EventDescription { get; set; } = string.Empty;
//             public DateTime? EventDate { get; set; }
//             public string EventTime { get; set; } = string.Empty;
//             public string Location { get; set; } = string.Empty;
//             public string ClassName { get; set; } = string.Empty;
//             public string SectionName { get; set; } = string.Empty;
//         }
//     }
// }