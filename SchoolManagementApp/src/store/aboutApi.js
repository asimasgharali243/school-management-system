// src/store/aboutApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const aboutApi = createApi({
    reducerPath: 'aboutApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['AboutSettings', 'SocialLinks'],
    endpoints: (builder) => ({
        // Get all about settings
        getAboutSettings: builder.query({
            query: () => '/api/About',
            providesTags: ['AboutSettings'],
            transformResponse: (response) => {
                if (response?.success && response?.data) {
                    return response.data;
                }
                return { content: {}, socialLinks: [] };
            },
            keepUnusedDataFor: 3600, // Cache for 1 hour
        }),

        // Get single setting by key
        getSettingByKey: builder.query({
            query: (key) => `/api/About/${key}`,
            providesTags: (result, error, key) => [{ type: 'AboutSettings', id: key }],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                return null;
            },
        }),

        // Update setting (Admin only)
        updateSetting: builder.mutation({
            query: ({ key, value }) => ({
                url: `/api/About/${key}`,
                method: 'PUT',
                body: { value },
            }),
            invalidatesTags: (result, error, { key }) => [{ type: 'AboutSettings', id: key }, 'AboutSettings'],
        }),

        // Create new setting (Admin only)
        createSetting: builder.mutation({
            query: (settingData) => ({
                url: '/api/About',
                method: 'POST',
                body: settingData,
            }),
            invalidatesTags: ['AboutSettings'],
        }),
    }),
});

export const {
    useGetAboutSettingsQuery,
    useGetSettingByKeyQuery,
    useUpdateSettingMutation,
    useCreateSettingMutation,
} = aboutApi;

export default aboutApi;