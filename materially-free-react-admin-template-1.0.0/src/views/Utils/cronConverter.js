// src/utils/cronConverter.js
import dayjs from 'dayjs';

/**
 * Convert a JavaScript Date object to a cron expression
 * @param {Date} date - The date/time to convert to cron expression
 * @param {string} frequency - Frequency type: 'once', 'daily', 'weekly', 'monthly', 'yearly'
 * @param {Object} options - Additional options for recurring schedules
 * @returns {string} Cron expression
 */
export const dateToCron = (date, frequency = 'once', options = {}) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid date provided');
    }

    // Extract date components (use local time for user-friendly experience)
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // 1-12
    const dayOfWeek = date.getDay(); // 0-6 (0=Sunday)

    switch (frequency) {
        case 'once':
            // For one-time execution at specific date and time
            return `${minutes} ${hours} ${dayOfMonth} ${month} *`;

        case 'daily':
            // Daily at specific time
            return `${minutes} ${hours} * * *`;

        case 'weekly':
            // Weekly on specific day and time
            return `${minutes} ${hours} * * ${dayOfWeek}`;

        case 'monthly':
            // Monthly on specific day and time
            return `${minutes} ${hours} ${dayOfMonth} * *`;

        case 'yearly':
            // Yearly on specific date and time
            return `${minutes} ${hours} ${dayOfMonth} ${month} *`;

        case 'hourly':
            // Every hour at specific minute
            return `${minutes} * * * *`;

        case 'every_minute':
            // Every minute
            return `* * * * *`;

        case 'custom':
            // For custom intervals
            const { interval, unit } = options;
            switch (unit) {
                case 'minutes':
                    return `*/${interval} * * * *`;
                case 'hours':
                    return `0 */${interval} * * *`;
                case 'days':
                    return `${minutes} ${hours} */${interval} * *`;
                default:
                    return `${minutes} ${hours} * * *`;
            }

        default:
            return `${minutes} ${hours} * * *`;
    }
};

/**
 * Parse cron expression to human-readable text
 * @param {string} cronExpression - Cron expression
 * @returns {string} Human-readable description
 */
export const parseCronToText = (cronExpression) => {
    if (!cronExpression) return 'Not set';

    const parts = cronExpression.trim().split(/\s+/);

    if (parts.length !== 5) return cronExpression;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Check for specific patterns
    if (cronExpression === '0 0 * * *') return 'Daily at midnight';
    if (cronExpression === '0 9 * * *') return 'Daily at 9:00 AM';
    if (cronExpression === '0 0 * * 0') return 'Weekly on Sunday at midnight';
    if (cronExpression === '0 0 1 * *') return 'Monthly on 1st at midnight';
    if (cronExpression === '0 0 1 1 *') return 'Yearly on Jan 1st at midnight';
    if (cronExpression === '* * * * *') return 'Every minute';

    // Minute-based patterns
    if (minute.startsWith('*/')) {
        const interval = minute.substring(2);
        return `Every ${interval} minutes`;
    }

    // Hour-based patterns
    if (hour.startsWith('*/') && minute === '0') {
        const interval = hour.substring(2);
        return `Every ${interval} hours`;
    }

    // Day-based patterns
    if (dayOfMonth.startsWith('*/') && minute !== '*' && hour !== '*') {
        const interval = dayOfMonth.substring(2);
        const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
        return `Every ${interval} days at ${time}`;
    }

    // Specific time patterns
    if (minute !== '*' && hour !== '*') {
        const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

        if (dayOfMonth !== '*' && month !== '*') {
            // Specific date
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `Yearly on ${dayOfMonth} ${months[parseInt(month) - 1]} at ${time}`;
        }

        if (dayOfMonth !== '*' && month === '*') {
            // Monthly on specific day
            const suffix = getDaySuffix(parseInt(dayOfMonth));
            return `Monthly on ${dayOfMonth}${suffix} at ${time}`;
        }

        if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
            // Weekly on specific day
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            if (dayOfWeek.includes(',')) {
                const dayNumbers = dayOfWeek.split(',').map(d => parseInt(d.trim()));
                const dayNames = dayNumbers.map(d => days[d]).join(', ');
                return `Weekly on ${dayNames} at ${time}`;
            }
            if (dayOfWeek.includes('-')) {
                const [start, end] = dayOfWeek.split('-').map(d => parseInt(d.trim()));
                const dayNames = days.slice(start, end + 1).join(', ');
                return `Weekly on ${dayNames} at ${time}`;
            }
            return `Weekly on ${days[parseInt(dayOfWeek)]} at ${time}`;
        }

        if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            return `Daily at ${time}`;
        }
    }

    return cronExpression;
};

/**
 * Get day suffix (st, nd, rd, th)
 */
const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

/**
 * Validate cron expression
 * @param {string} cronExpression - Cron expression to validate
 * @returns {boolean} Whether the cron expression is valid
 */
export const isValidCron = (cronExpression) => {
    if (!cronExpression || cronExpression.trim() === '') return false;

    const cronParts = cronExpression.trim().split(/\s+/);

    // Standard cron has 5 parts
    if (cronParts.length !== 5) return false;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronParts;

    // Helper function to validate field
    const validateField = (field, min, max) => {
        if (field === '*') return true;

        // Handle */n syntax
        if (field.startsWith('*/')) {
            const num = field.substring(2);
            return !isNaN(num) && parseInt(num) > 0 && parseInt(num) <= max;
        }

        // Handle comma-separated values
        if (field.includes(',')) {
            const parts = field.split(',');
            return parts.every(part => {
                const num = parseInt(part);
                return !isNaN(num) && num >= min && num <= max;
            });
        }

        // Handle ranges
        if (field.includes('-')) {
            const [start, end] = field.split('-').map(Number);
            return !isNaN(start) && !isNaN(end) &&
                start >= min && end <= max &&
                start <= end;
        }

        // Handle single number
        const num = parseInt(field);
        return !isNaN(num) && num >= min && num <= max;
    };

    return (
        validateField(minute, 0, 59) &&
        validateField(hour, 0, 23) &&
        validateField(dayOfMonth, 1, 31) &&
        validateField(month, 1, 12) &&
        validateField(dayOfWeek, 0, 6)
    );
};

/**
 * Get next run time from cron expression
 * @param {string} cronExpression - Cron expression
 * @param {Date} fromDate - Starting date (default: now)
 * @returns {Date} Next run time
 */
export const getNextRunTime = (cronExpression, fromDate = new Date()) => {
    if (!isValidCron(cronExpression)) return null;

    try {
        const parts = cronExpression.split(' ');
        const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

        // Create a copy of the from date
        let nextRun = new Date(fromDate.getTime());

        // If it's a simple daily schedule
        if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            nextRun.setMinutes(parseInt(minute));
            nextRun.setHours(parseInt(hour));
            nextRun.setSeconds(0);

            // If this time has already passed today, schedule for tomorrow
            if (nextRun.getTime() <= fromDate.getTime()) {
                nextRun.setDate(nextRun.getDate() + 1);
            }

            return nextRun;
        }

        // For other patterns, return a reasonable estimate
        nextRun.setDate(nextRun.getDate() + 1);
        nextRun.setHours(parseInt(hour) || 0);
        nextRun.setMinutes(parseInt(minute) || 0);
        nextRun.setSeconds(0);

        return nextRun;
    } catch (error) {
        console.error('Error calculating next run:', error);
        return null;
    }
};

/**
 * Generate preview dates for cron expression
 * @param {string} cronExpression - Cron expression
 * @param {number} count - Number of previews to generate
 * @returns {Date[]} Array of upcoming run times
 */
export const generateSchedulePreview = (cronExpression, count = 3) => {
    if (!isValidCron(cronExpression)) return [];

    const previews = [];
    let currentDate = new Date();

    for (let i = 0; i < count; i++) {
        const nextRun = getNextRunTime(cronExpression, currentDate);
        if (nextRun) {
            previews.push(nextRun);
            currentDate = new Date(nextRun.getTime() + 60000); // Move 1 minute past
        }
    }

    return previews;
};