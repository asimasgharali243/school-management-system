
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './apiConfig';

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['NotificationRule', 'Notification', 'NotificationLog', 'NotificationHistory', 'BatchNotification'],
    endpoints: (builder) => ({
        getNotificationRules: builder.query({
            query: (params = {}) => {
                const { active } = params;
                const urlParams = new URLSearchParams();
                if (active !== undefined) {
                    urlParams.append('active', active);
                }
                return `/api/notificationrules?${urlParams.toString()}`;
            },
            providesTags: ['NotificationRule'],
        }),

        getNotificationRuleById: builder.query({
            query: (id) => `/api/notificationrules/${id}`,
            providesTags: (result, error, id) => [{ type: 'NotificationRule', id }],
        }),

        createNotificationRule: builder.mutation({
            query: (ruleData) => ({
                url: '/api/notificationrules',
                method: 'POST',
                body: ruleData,
            }),
            invalidatesTags: ['NotificationRule'],
        }),

        updateNotificationRule: builder.mutation({
            query: ({ id, ...ruleData }) => {
                console.log('Sending update request for ID:', id, 'with data:', ruleData);
                return {
                    url: `/api/notificationrules/${id}/update`,
                    method: 'POST',
                    body: ruleData,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'NotificationRule', id }],
        }),

        deleteNotificationRule: builder.mutation({
            query: (id) => ({
                url: `/api/notificationrules/${id}/delete`,
                method: 'POST',
                body:{}
            }),
            invalidatesTags: ['NotificationRule'],
        }),

        testNotificationRule: builder.mutation({
            query: ({ id, ...testData }) => ({
                url: `/api/notificationrules/${id}/test`,
                method: 'POST',
                body: testData,
            }),
        }),

        activateNotificationRule: builder.mutation({
            query: ({ id, isActive }) => ({
                url: `/api/notificationrules/${id}/activate`,
                method: 'POST',
                body: { isActive },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'NotificationRule', id }],
        }),

        executeNotificationRule: builder.mutation({
            query: (id) => ({
                url: `/api/notificationrules/${id}/execute`,
                method: 'POST',
            }),
        }),

        getNotifications: builder.query({
            query: (params = {}) => {
                const { page = 1, pageSize = 10, status, fromDate, toDate } = params;
                const urlParams = new URLSearchParams();

                if (page) urlParams.append('page', page);
                if (pageSize) urlParams.append('pageSize', pageSize);
                if (status && status !== 'all') urlParams.append('status', status);
                if (fromDate) urlParams.append('fromDate', fromDate);
                if (toDate) urlParams.append('toDate', toDate);

                return `/api/notifications?${urlParams.toString()}`;
            },
            providesTags: ['Notification'],
        }),

        getUserNotifications: builder.query({
            query: ({ userId, page = 1, pageSize = 20 }) => ({
                url: `/api/notifications/user/${userId}`,
                params: { page, pageSize },
            }),
            providesTags: ['Notification'],
        }),

        getUnreadCount: builder.query({
            query: (userId) => `/api/notifications/unread-count/${userId}`,
        }),

        markAsRead: builder.mutation({
            query: ({ id, userId }) => ({
                url: `/api/notifications/${id}/read?userId=${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Notification'],
        }),

        markAllAsRead: builder.mutation({
            query: (userId) => ({
                url: `/api/notifications/mark-all-read?userId=${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Notification'],
        }),

        getNotificationStats: builder.query({
            query: (params = {}) => {
                const { fromDate, toDate } = params;
                const urlParams = new URLSearchParams();

                if (fromDate) urlParams.append('fromDate', fromDate);
                if (toDate) urlParams.append('toDate', toDate);

                return `/api/notifications/stats?${urlParams.toString()}`;
            },
        }),

        getPendingNotifications: builder.query({
            query: (limit = 100) => ({
                url: '/api/notifications/pending',
                params: { limit },
            }),
            providesTags: ['Notification'],
        }),

        getFailedNotifications: builder.query({
            query: (limit = 100) => ({
                url: '/api/notifications/failed',
                params: { limit },
            }),
            providesTags: ['Notification'],
        }),

        retryNotification: builder.mutation({
            query: (id) => ({
                url: `/api/notifications/retry/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['Notification'],
        }),

        retryAllFailed: builder.mutation({
            query: (ruleId) => {
                const url = ruleId ?
                    `/api/notifications/retry-failed?ruleId=${ruleId}` :
                    '/api/notifications/retry-failed';
                return {
                    url: url,
                    method: 'POST',
                };
            },
            invalidatesTags: ['Notification'],
        }),

        cleanupNotifications: builder.mutation({
            query: (days = 30) => ({
                url: `/api/notifications/cleanup?days=${days}`,
                method: 'POST',
            }),
        }),

        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/api/notifications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notification'],
        }),

        getNotificationLogs: builder.query({
            query: (params = {}) => {
                const { fromDate, toDate, action, page = 1, pageSize = 50 } = params;
                const urlParams = new URLSearchParams();

                if (fromDate) urlParams.append('fromDate', fromDate);
                if (toDate) urlParams.append('toDate', toDate);
                if (action) urlParams.append('action', action);
                urlParams.append('page', page);
                urlParams.append('pageSize', pageSize);

                return `/api/adminnotification/logs?${urlParams.toString()}`;
            },
            providesTags: ['NotificationLog'],
        }),

        getNotificationHistory: builder.query({
            query: (params = {}) => {
                const { fromDate, toDate, userId, category, page = 1, pageSize = 50 } = params;
                const urlParams = new URLSearchParams();

                if (fromDate) urlParams.append('fromDate', fromDate);
                if (toDate) urlParams.append('toDate', toDate);
                if (userId) urlParams.append('userId', userId);
                if (category) urlParams.append('category', category);
                urlParams.append('page', page);
                urlParams.append('pageSize', pageSize);

                return `/api/adminnotification/history?${urlParams.toString()}`;
            },
            providesTags: ['NotificationHistory'],
        }),

        getBatchNotifications: builder.query({
            query: (params = {}) => {
                const { status, fromDate, toDate } = params;
                const urlParams = new URLSearchParams();

                if (status) urlParams.append('status', status);
                if (fromDate) urlParams.append('fromDate', fromDate);
                if (toDate) urlParams.append('toDate', toDate);

                return `/api/adminnotification/batch?${urlParams.toString()}`;
            },
            providesTags: ['BatchNotification'],
        }),

        getSystemStats: builder.query({
            query: (params = {}) => {
                const { fromDate, toDate } = params;
                const urlParams = new URLSearchParams();

                if (fromDate) urlParams.append('fromDate', fromDate);
                if (toDate) urlParams.append('toDate', toDate);

                return `/api/adminnotification/system-stats?${urlParams.toString()}`;
            },
        }),

        sendBroadcastNotification: builder.mutation({
            query: (data) => ({
                url: '/api/adminnotification/broadcast',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Notification', 'BatchNotification'],
        }),

        testWebhook: builder.mutation({
            query: (data) => ({
                url: '/api/adminnotification/test-webhook',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetNotificationRulesQuery,
    useGetNotificationRuleByIdQuery,
    useCreateNotificationRuleMutation,
    useUpdateNotificationRuleMutation,
    useDeleteNotificationRuleMutation,
    useTestNotificationRuleMutation,
    useActivateNotificationRuleMutation,
    useExecuteNotificationRuleMutation,
    useGetNotificationsQuery,
    useGetUserNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useGetNotificationStatsQuery,
    useGetPendingNotificationsQuery,
    useGetFailedNotificationsQuery,
    useRetryNotificationMutation,
    useRetryAllFailedMutation,
    useCleanupNotificationsMutation,
    useDeleteNotificationMutation,
    useGetNotificationLogsQuery,
    useGetNotificationHistoryQuery,
    useGetBatchNotificationsQuery,
    useGetSystemStatsQuery,
    useSendBroadcastNotificationMutation,
    useTestWebhookMutation,
} = notificationApi;