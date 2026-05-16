

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const attendanceApi = createApi({
    reducerPath: 'attendanceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        // In both API files, update the prepareHeaders function:
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const token = state.auth?.token;

            console.log('🔐 API Headers - Token Check:', {
                hasToken: !!token,
                tokenLength: token?.length,
                tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
                timestamp: new Date().toISOString()
            });

            if (token) {
                console.log('🔐 Setting Authorization header');
                headers.set('Authorization', `Bearer ${token}`);
            } else {
                console.warn('⚠️ No token found in Redux state for API call');
                // You might want to dispatch a token refresh here
            }

            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Attendance', 'AttendanceStats', 'Diary', 'Children'],
    endpoints: (builder) => ({
        // Get child's attendance statistics
        getChildAttendanceStats: builder.query({
            query: ({ childId, filters = {} }) => {
                const params = new URLSearchParams();
                if (filters.month !== undefined && filters.month !== null) {
                    params.append('month', filters.month);
                }
                if (filters.year !== undefined && filters.year !== null) {
                    params.append('year', filters.year);
                }
                if (filters.dateFrom) {
                    params.append('dateFrom', filters.dateFrom);
                }
                if (filters.dateTo) {
                    params.append('dateTo', filters.dateTo);
                }

                return `/api/attendance/child/${childId}/stats?${params.toString()}`;
            },
            transformResponse: (response) => {
                console.log('📊 Attendance Stats Response:', response);

                // The backend returns ApiResponse<T> format
                if (response && typeof response === 'object') {
                    if (response.success !== undefined) {
                        return {
                            success: response.success,
                            data: response.data || {},
                            error: response.error
                        };
                    }
                }

                return {
                    success: false,
                    data: {},
                    error: 'Invalid response format'
                };
            },
            providesTags: ['AttendanceStats'],
        }),

        // Get child's attendance history
        getChildAttendanceHistory: builder.query({
            query: ({ childId, filters = {} }) => {
                const params = new URLSearchParams();
                if (filters.month !== undefined && filters.month !== null) {
                    params.append('month', filters.month);
                }
                if (filters.year !== undefined && filters.year !== null) {
                    params.append('year', filters.year);
                }
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status);
                }
                if (filters.dateFrom) {
                    params.append('dateFrom', filters.dateFrom);
                }
                if (filters.dateTo) {
                    params.append('dateTo', filters.dateTo);
                }

                return `/api/attendance/child/${childId}/history?${params.toString()}`;
            },
            transformResponse: (response) => {
                console.log('📅 Attendance History Response:', response);

                if (response && typeof response === 'object') {
                    if (response.success !== undefined) {
                        return {
                            success: response.success,
                            data: response.data || {},
                            error: response.error
                        };
                    }
                }

                return {
                    success: false,
                    data: {},
                    error: 'Invalid response format'
                };
            },
            providesTags: ['Attendance'],
        }),

        // Get child's diary entries
        getChildDiary: builder.query({
            query: ({ childId, filters = {} }) => {
                const params = new URLSearchParams();
                if (filters.date) {
                    params.append('date', filters.date);
                }
                if (filters.month !== undefined && filters.month !== null) {
                    params.append('month', filters.month);
                }
                if (filters.year !== undefined && filters.year !== null) {
                    params.append('year', filters.year);
                }
                if (filters.subjectId) {
                    params.append('subjectId', filters.subjectId);
                }

                return `/api/diary/child/${childId}?${params.toString()}`;
            },
            transformResponse: (response) => {
                console.log('📓 Diary Response:', response);

                if (response && typeof response === 'object') {
                    if (response.success !== undefined) {
                        return {
                            success: response.success,
                            data: response.data || {},
                            error: response.error
                        };
                    }
                }

                return {
                    success: false,
                    data: {},
                    error: 'Invalid response format'
                };
            },
            providesTags: ['Diary'],
        }),

    
getChildren: builder.query({
    query: () => `/api/attendance/children`,  // Changed to match new endpoint
    transformResponse: (response) => {
        console.log('👶 Children API Response:', response);
        if (response && typeof response === 'object') {
            if (response.success !== undefined) {
                return {
                    success: response.success,
                    data: response.data || [],
                    message: response.message
                };
            }
        }
        return {
            success: false,
            data: [],
            error: 'Invalid response format'
        };
    },
    providesTags: ['Children'],
}),
    }),
});

export const {
    useGetChildAttendanceStatsQuery,
    useGetChildAttendanceHistoryQuery,
    useGetChildDiaryQuery,
    useGetChildrenQuery
} = attendanceApi;