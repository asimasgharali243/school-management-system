// store/api/classApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './apiConfig';

export const classApi = createApi({
    reducerPath: 'classApi',
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
    tagTypes: ['Class'],
    endpoints: (builder) => ({
        getClasses: builder.query({
            query: () => '/api/Class',  // ✅ Changed from /api/AddClass
            transformResponse: (response) => {
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: ['Class'],
        }),
        getActiveClasses: builder.query({
            query: () => '/api/Class/active',  // ✅ New endpoint
            transformResponse: (response) => {
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: ['Class'],
        }),
        getClassById: builder.query({
            query: (id) => `/api/Class/${id}`,
        }),
    }),
});

export const { useGetClassesQuery, useGetActiveClassesQuery, useGetClassByIdQuery } = classApi;