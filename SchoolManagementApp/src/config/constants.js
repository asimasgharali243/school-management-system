// src/config/constants.js
// export const BASE_URL = 'https://schoolapp.ultsol.cloud';

export const BASE_URL = 'http://localhost:5027';
export const API_TIMEOUT = 30000;
export const ENCRYPTION_KEY = 'school-management-2024';

// src/config/themes.js
// export const themes = {
//     light: {
//         primary: '#3B82F6',
//         secondary: '#10B981',
//         background: '#FFFFFF',
//         card: '#F3F4F6',
//         text: '#111827',
//         textSecondary: '#6B7280',
//         border: '#E5E7EB',
//         success: '#10B981',
//         error: '#EF4444',
//         warning: '#F59E0B',
//         info: '#3B82F6',
//     },
//     dark: {
//         primary: '#60A5FA',
//         secondary: '#34D399',
//         background: '#111827',
//         card: '#1F2937',
//         text: '#F9FAFB',
//         textSecondary: '#9CA3AF',
//         border: '#374151',
//         success: '#34D399',
//         error: '#F87171',
//         warning: '#FBBF24',
//         info: '#60A5FA',
//     },
//     blue: {
//         primary: '#2563EB',
//         secondary: '#0EA5E9',
//         background: '#F0F9FF',
//         card: '#E0F2FE',
//         text: '#0C4A6E',
//         textSecondary: '#475569',
//         border: '#BAE6FD',
//         success: '#0D9488',
//         error: '#DC2626',
//         warning: '#F59E0B',
//         info: '#0284C7',
//     },
// };

// src/config/themes.js
// export const themes = {
//     light: {
//         primary: '#1D4ED8',
//         secondary: '#059669',

//         background: '#F8FAFC',     // soft cool gray-white
//         card: '#FFFFFF',           // clean neutral card (FIXED)

//         text: '#0F172A',
//         textSecondary: '#475569',

//         border: '#E2E8F0',

//         success: '#16A34A',
//         error: '#DC2626',
//         warning: '#D97706',
//         info: '#0284C7',
//     },

//     dark: {
//         primary: '#3B82F6',
//         secondary: '#22C55E',

//         background: '#0B1220',     // deep neutral dark
//         card: '#111827',          // consistent dark gray surface

//         text: '#F8FAFC',
//         textSecondary: '#CBD5E1',

//         border: '#1F2937',

//         success: '#22C55E',
//         error: '#F87171',
//         warning: '#FBBF24',
//         info: '#38BDF8',
//     },

//     blue: {
//         primary: '#1E40AF',
//         secondary: '#0284C7',

//         background: '#EFF6FF',     // very light cool gray-blue
//         card: '#F1F5F9',           // FIXED: neutral gray instead of strong blue

//         text: '#0B2A4A',
//         textSecondary: '#334155',

//         border: '#CBD5E1',

//         success: '#047857',
//         error: '#B91C1C',
//         warning: '#B45309',
//         info: '#0369A1',
//     },
// };

// src/config/themes.js
export const themes = {
    light: {
        // Core colors - Premium Indigo theme
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#8B5CF6',
        secondaryLight: '#A78BFA',
        
        // UI colors
        background: '#F8FAFC',
        card: '#FFFFFF',
        cardHover: '#F1F5F9',
        border: '#E2E8F0',
        borderLight: '#F1F5F9',
        
        // Text colors
        text: '#0F172A',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        
        // Semantic colors
        success: '#10B981',
        successLight: '#34D399',
        error: '#EF4444',
        errorLight: '#F87171',
        warning: '#F59E0B',
        warningLight: '#FBBF24',
        info: '#3B82F6',
        infoLight: '#60A5FA',
        
        // Grade colors
        gradeA: '#22C55E',
        gradeB: '#FBBF24',
        gradeC: '#F97316',
        gradeD: '#EF4444',
        gradeF: '#991B1B',
        
        // Gradients
        gradientPrimary: ['#6366F1', '#8B5CF6'],
        gradientSuccess: ['#10B981', '#34D399'],
        gradientCard: ['#FFFFFF', '#F8FAFC'],
        
        // Shadows
        shadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        shadowStrong: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    },
    
    dark: {
        primary: '#818CF8',
        primaryDark: '#6366F1',
        primaryLight: '#A78BFA',
        secondary: '#A78BFA',
        secondaryLight: '#C4B5FD',
        
        background: '#0B1220',
        card: '#111827',
        cardHover: '#1F2937',
        border: '#1F2937',
        borderLight: '#374151',
        
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        
        success: '#34D399',
        successLight: '#6EE7B7',
        error: '#F87171',
        errorLight: '#FCA5A5',
        warning: '#FBBF24',
        warningLight: '#FDE68A',
        info: '#60A5FA',
        infoLight: '#93C5FD',
        
        gradeA: '#4ADE80',
        gradeB: '#FCD34D',
        gradeC: '#FB923C',
        gradeD: '#F87171',
        gradeF: '#7F1D1D',
        
        gradientPrimary: ['#818CF8', '#A78BFA'],
        gradientSuccess: ['#34D399', '#6EE7B7'],
        gradientCard: ['#111827', '#0B1220'],
        
        shadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
        shadowStrong: '0px 8px 24px rgba(0, 0, 0, 0.4)',
    },
    
    blue: {
        primary: '#1E40AF',
        primaryDark: '#1E3A8A',
        primaryLight: '#3B82F6',
        secondary: '#0284C7',
        secondaryLight: '#38BDF8',
        
        background: '#EFF6FF',
        card: '#FFFFFF',
        cardHover: '#F8FAFC',
        border: '#DBEAFE',
        borderLight: '#F1F5F9',
        
        text: '#0B2A4A',
        textSecondary: '#334155',
        textTertiary: '#475569',
        
        success: '#047857',
        successLight: '#059669',
        error: '#DC2626',
        errorLight: '#EF4444',
        warning: '#D97706',
        warningLight: '#F59E0B',
        info: '#0284C7',
        infoLight: '#0EA5E9',
        
        gradeA: '#10B981',
        gradeB: '#F59E0B',
        gradeC: '#F97316',
        gradeD: '#EF4444',
        gradeF: '#991B1B',
        
        gradientPrimary: ['#1E40AF', '#0284C7'],
        gradientSuccess: ['#047857', '#059669'],
        gradientCard: ['#FFFFFF', '#EFF6FF'],
        
        shadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        shadowStrong: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    },
};

// src/config/permissions.js
export const rolePermissions = {
    1: ['admin_panel', 'student_management', 'fee_management', 'attendance_management', 'teacher_management', 'reports', 'settings', 'user_management'],
    2: ['dashboard', 'fee_management', 'reports'],
    3: ['dashboard', 'attendance_management', 'student_view'],
    4: ['dashboard', 'student_view', 'fee_view', 'attendance_view'],
    5: ['dashboard'],
};


export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/Auth/login',
        LOGOUT: '/api/Auth/logout',
        VALIDATE: '/api/Auth/validate',
    },
    STUDENT: {
        LIST: '/api/Student',
        DETAILS: '/api/Student',
        ATTENDANCE: '/api/Student/attendance',
        GRADES: '/api/Student/grades',
        DIARY: '/api/Student/diary',
    },
    TEACHER: {
        CLASSES: '/api/Teacher/classes',
        STUDENTS: '/api/Teacher/students',
        ATTENDANCE: '/api/Teacher/attendance',
    },
    PARENT: {
        CHILDREN: '/api/Parent/children',
    },
};

export const USER_ROLES = {
    ADMIN: 1,
    ACCOUNTANT: 2,
    TEACHER: 3,
    PARENT: 4,
};