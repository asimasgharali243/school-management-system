namespace school_management_Backend.Helpers
{
    public static class CronExpressionHelper
    {
        public static bool IsValidCronExpression(string expression)
        {
            if (string.IsNullOrWhiteSpace(expression))
                return false;

            try
            {
                // Simple validation - you might want to use a proper cron parser library
                var parts = expression.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                
                // Standard cron has 5 parts, Quartz cron has 6 or 7 parts
                if (parts.Length < 5 || parts.Length > 7)
                    return false;

                // Check each part
                foreach (var part in parts)
                {
                    if (!IsValidCronPart(part))
                        return false;
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        private static bool IsValidCronPart(string part)
        {
            if (string.IsNullOrEmpty(part) || part == "*")
                return true;

            // Check for valid characters and patterns
            // This is a simplified validation
            var validChars = new[] { '*', ',', '-', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '?', 'L', 'W', '#' };
            
            foreach (char c in part)
            {
                if (!validChars.Contains(c))
                    return false;
            }

            return true;
        }

        public static string GetHumanReadableDescription(string cronExpression)
        {
            try
            {
                var parts = cronExpression.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                
                if (parts.Length < 5)
                    return "Invalid cron expression";

                var description = new List<string>();

                // Minute
                if (parts[0] == "*")
                    description.Add("every minute");
                else if (parts[0].Contains('/'))
                    description.Add($"every {parts[0].Split('/')[1]} minutes");
                else
                    description.Add($"at minute {parts[0]}");

                // Hour
                if (parts[1] == "*")
                    description.Add("of every hour");
                else if (parts[1].Contains('/'))
                    description.Add($"every {parts[1].Split('/')[1]} hours");
                else
                    description.Add($"at hour {parts[1]}");

                // Day of month
                if (parts[2] == "*")
                    description.Add("every day");
                else if (parts[2] == "?")
                    description.Add("(day not specified)");
                else
                    description.Add($"on day {parts[2]} of the month");

                // Month
                if (parts[3] == "*")
                    description.Add("every month");
                else
                    description.Add($"in {GetMonthName(parts[3])}");

                // Day of week
                if (parts[4] == "*" || parts[4] == "?")
                    description.Add("");
                else
                    description.Add($"on {GetDayOfWeekName(parts[4])}");

                return string.Join(" ", description).Trim();
            }
            catch
            {
                return cronExpression;
            }
        }

        private static string GetMonthName(string month)
        {
            if (int.TryParse(month, out int monthNum) && monthNum >= 1 && monthNum <= 12)
            {
                var monthNames = new[] { "January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December" };
                return monthNames[monthNum - 1];
            }
            return month;
        }

        private static string GetDayOfWeekName(string day)
        {
            if (int.TryParse(day, out int dayNum) && dayNum >= 0 && dayNum <= 6)
            {
                var dayNames = new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
                return dayNames[dayNum];
            }
            else if (day == "*" || day == "?")
            {
                return "every day";
            }
            return day;
        }

        public static string[] GetCommonCronExpressions()
        {
            return new[]
            {
                "0 * * * *",      // Every hour
                "0 0 * * *",      // Daily at midnight
                "0 9 * * *",      // Daily at 9 AM
                "0 9 * * 1-5",    // Weekdays at 9 AM
                "0 9 * * 0",      // Sundays at 9 AM
                "0 0 1 * *",      // First day of month at midnight
                "0 0 * * 0",      // Weekly on Sunday at midnight
                "0 0 1 1 *",      // Yearly on Jan 1 at midnight
                "*/5 * * * *",    // Every 5 minutes
                "*/15 * * * *",   // Every 15 minutes
                "*/30 * * * *",   // Every 30 minutes
                "0 */6 * * *",    // Every 6 hours
                "0 0 */7 * *",    // Every 7 days
                "0 0 1,15 * *",   // 1st and 15th of month
                "0 12 * * 1-5"    // Weekdays at noon
            };
        }
    }
}