
// export const { useGetStudentPerformanceQuery } = performanceApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const performanceApi = createApi({
    reducerPath: 'performanceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getStudentPerformance: builder.query({
            query: ({ regId, sessionYear, classId = 0, sectionId = 0, dateFrom, dateTo }) => {
                let url = `/api/Performance/student-performance/${regId}?sessionYear=${sessionYear}&classId=${classId}&sectionId=${sectionId}`;
                if (dateFrom) url += `&dateFrom=${encodeURIComponent(dateFrom)}`;
                if (dateTo) url += `&dateTo=${encodeURIComponent(dateTo)}`;
                return url;
            },
            transformResponse: (response) => response?.data || null,
        }),

        getStudentPerformanceSessionYears: builder.query({
            query: () => '/api/Performance/session-years',
            transformResponse: (response) => response?.data || [],
        }),
    }),
});

export const { useGetStudentPerformanceQuery, useGetStudentPerformanceSessionYearsQuery } = performanceApi;