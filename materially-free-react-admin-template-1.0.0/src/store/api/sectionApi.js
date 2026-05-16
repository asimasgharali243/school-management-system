// store/api/sectionApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './apiConfig';

export const sectionApi = createApi({
    reducerPath: 'sectionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Section'],
    endpoints: (builder) => ({
        getSections: builder.query({
            query: () => '/api/Section',  // ✅ Changed from /api/AddSection
            transformResponse: (response) => {
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: ['Section'],
        }),
        getSectionsByClass: builder.query({
            query: (classId) => `/api/Section/byclass/${classId}`,  // ✅ Changed from /api/AddSection/byclass
            transformResponse: (response) => {
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: (result, error, classId) => [{ type: 'Section', id: `class_${classId}` }],
        }),
    }),
});

export const { useGetSectionsQuery, useGetSectionsByClassQuery } = sectionApi;