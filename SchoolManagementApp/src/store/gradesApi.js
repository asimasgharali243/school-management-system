


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const gradesApi = createApi({
    reducerPath: 'gradesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const token = state.auth?.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Grades', 'ResultStats', 'Teacher', 'Subject'],
    endpoints: (builder) => ({
        // Get child's grades
        getChildGrades: builder.query({
            query: ({ childId, filters = {} }) => {
                const params = new URLSearchParams();

                // Add filters if they exist
                if (filters.subjectId) params.append('subjectId', filters.subjectId);
                if (filters.batchId) params.append('batchId', filters.batchId);
                if (filters.yearId) params.append('yearId', filters.yearId);
                if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
                if (filters.dateTo) params.append('dateTo', filters.dateTo);
                if (filters.month) params.append('month', filters.month);
                if (filters.year) params.append('year', filters.year);

                const url = `/api/grades/child/${childId}${params.toString() ? `?${params.toString()}` : ''}`;
                console.log('Fetching grades from:', url);
                return url;
            },
            transformResponse: (response) => {
                // Handle both wrapped and unwrapped responses
                if (response?.success !== undefined) {
                    return response.data || [];
                }
                return response || [];
            },
            providesTags: (result, error, { childId }) =>
                result ? [{ type: 'Grades', id: childId }] : ['Grades'],
        }),

        // Get child's grade statistics
        getChildGradeStats: builder.query({
            query: ({ childId, filters = {} }) => {
                const params = new URLSearchParams();

                if (filters.subjectId) params.append('subjectId', filters.subjectId);
                if (filters.yearId) params.append('yearId', filters.yearId);
                if (filters.month) params.append('month', filters.month);
                if (filters.year) params.append('year', filters.year);

                const url = `/api/grades/child/${childId}/stats${params.toString() ? `?${params.toString()}` : ''}`;
                return url;
            },
            transformResponse: (response) => {
                if (response?.success !== undefined) {
                    return response.data || {};
                }
                return response || {};
            },
            providesTags: (result, error, { childId }) =>
                result ? [{ type: 'ResultStats', id: childId }] : ['ResultStats'],
        }),

        // Get subjects with grades
        getChildSubjectsWithGrades: builder.query({
            query: (childId) => `/api/grades/child/${childId}/subjects`,
            transformResponse: (response) => {
                if (response?.success !== undefined) {
                    return response.data || [];
                }
                return response || [];
            },
            providesTags: ['Subject'],
        }),

        // Get exam batches
        getExamBatches: builder.query({
            query: ({ classId, sectionId }) => {
                const params = new URLSearchParams();
                if (classId) params.append('classId', classId);
                if (sectionId) params.append('sectionId', sectionId);

                const url = `/api/grades/exam-batches${params.toString() ? `?${params.toString()}` : ''}`;
                return url;
            },
            transformResponse: (response) => {
                if (response?.success !== undefined) {
                    return response.data || [];
                }
                return response || [];
            },
        }),

        // Get academic years
        getAcademicYears: builder.query({
            query: () => '/api/grades/academic-years',
            transformResponse: (response) => {
                if (response?.success !== undefined) {
                    return response.data || [];
                }
                return response || [];
            },
        }),

        // Get grade trends
        getGradeTrends: builder.query({
            query: ({ childId, subjectId }) =>
                `/api/grades/child/${childId}/trends${subjectId ? `?subjectId=${subjectId}` : ''}`,
            transformResponse: (response) => {
                if (response?.success !== undefined) {
                    return response.data || [];
                }
                return response || [];
            },
            providesTags: ['Grades'],
        }),

        // Download grade report
        downloadGradeReport: builder.mutation({
            query: ({ childId, filters = {} }) => ({
                url: `/api/grades/child/${childId}/report`,
                method: 'GET',
                params: filters,
                responseHandler: async (response) => {
                    const contentType = response.headers.get('content-type');

                    if (contentType?.includes('application/json')) {
                        const data = await response.json();
                        return data;
                    }

                    // Handle PDF download
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `grade-report-${childId}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);

                    return { success: true, message: 'Report downloaded successfully' };
                },
            }),
        }),
    }),
});

export const {
    useGetChildGradesQuery,
    useGetChildGradeStatsQuery,
    useGetChildSubjectsWithGradesQuery,
    useGetExamBatchesQuery,
    useGetAcademicYearsQuery,
    useGetGradeTrendsQuery,
    useDownloadGradeReportMutation,
} = gradesApi;