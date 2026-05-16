// store/api/campusApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './apiConfig';

export const campusApi = createApi({
    reducerPath: 'campusApi',
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
    tagTypes: ['Campus'],
    endpoints: (builder) => ({
        getCampuses: builder.query({
            query: () => '/api/Campus',
            transformResponse: (response) => {
                if (response.data) return response.data;
                if (response.result) return response.result;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: ['Campus'],
        }),
    }),
});

export const { useGetCampusesQuery } = campusApi;