// // // import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// // // import { BASE_URL } from '../config/constants';

// // // export const diaryApi = createApi({
// // //     reducerPath: 'diaryApi',
// // //     baseQuery: fetchBaseQuery({
// // //         baseUrl: BASE_URL,
// // //         prepareHeaders: (headers, { getState }) => {
// // //             const token = getState().auth?.token;
// // //             if (token) {
// // //                 headers.set('Authorization', `Bearer ${token}`);
// // //             }
// // //             headers.set('Accept', 'application/json');
// // //             headers.set('Content-Type', 'application/json');
// // //             return headers;
// // //         }
// // //     }),
// // //     tagTypes: ['Diary', 'TeacherClasses', 'Subjects'],
// // //     endpoints: (builder) => ({
// // //         // Get teacher's assigned classes with sections
// // //         getTeacherClasses: builder.query({
// // //             query: () => '/api/diary/teacher/classes',
// // //             providesTags: ['TeacherClasses'],
// // //         }),

// // //         // Get subjects by class and section
// // //         getSubjectsByClass: builder.query({
// // //             query: ({ classId, sectionId }) => 
// // //                 `/api/diary/class/${classId}/subjects${sectionId ? `?sectionId=${sectionId}` : ''}`,
// // //             providesTags: ['Subjects'],
// // //         }),

// // //         // Get teacher's diary entries with filters
// // //         getTeacherDiaries: builder.query({
// // //             query: ({ classId, sectionIds, subjectId, dateFrom, dateTo, page = 1, limit = 20 }) => {
// // //                 const params = new URLSearchParams();
// // //                 if (classId) params.append('classId', classId);
// // //                 if (sectionIds?.length) params.append('sectionIds', sectionIds.join(','));
// // //                 if (subjectId) params.append('subjectId', subjectId);
// // //                 if (dateFrom) params.append('dateFrom', dateFrom);
// // //                 if (dateTo) params.append('dateTo', dateTo);
// // //                 params.append('page', page);
// // //                 params.append('limit', limit);
// // //                 return `/api/diary/teacher/entries?${params.toString()}`;
// // //             },
// // //             providesTags: (result, error, arg) => 
// // //                 result ? [{ type: 'Diary', id: 'LIST' }] : ['Diary'],
// // //         }),

// // //         // Create batch diary (multiple sections)
// // //         createBatchDiary: builder.mutation({
// // //             query: (diaryData) => ({
// // //                 url: '/api/diary/batch',
// // //                 method: 'POST',
// // //                 body: diaryData,
// // //             }),
// // //             invalidatesTags: ['Diary'],
// // //         }),

// // //         // Get single diary entry (for editing)
// // //         getDiaryEntry: builder.query({
// // //             query: ({ entryId }) => `/api/diary/entry/${entryId}`,
// // //             providesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
// // //         }),

// // //         // Update existing diary
// // //         updateDiaryEntry: builder.mutation({
// // //             query: ({ entryId, data }) => ({
// // //                 url: `/api/diary/entry/${entryId}`,
// // //                 method: 'PUT',
// // //                 body: data,
// // //             }),
// // //             invalidatesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
// // //         }),
// // //     }),
// // // });

// // // export const {
// // //     useGetTeacherClassesQuery,
// // //     useGetSubjectsByClassQuery,
// // //     useGetTeacherDiariesQuery,
// // //     useCreateBatchDiaryMutation,
// // //     useGetDiaryEntryQuery,
// // //     useUpdateDiaryEntryMutation,
// // // } = diaryApi;


// // import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// // import { BASE_URL } from '../config/constants';

// // export const diaryApi = createApi({
// //     reducerPath: 'diaryApi',
// //     baseQuery: fetchBaseQuery({
// //         baseUrl: BASE_URL,
// //         prepareHeaders: (headers, { getState }) => {
// //             const token = getState().auth?.token;
// //             if (token) {
// //                 headers.set('Authorization', `Bearer ${token}`);
// //             }
// //             headers.set('Accept', 'application/json');
// //             headers.set('Content-Type', 'application/json');
// //             return headers;
// //         }
// //     }),
// //     tagTypes: ['Diary', 'TeacherClasses', 'Subjects'],
// //     endpoints: (builder) => ({
// //         // Get teacher's assigned classes with sections
// //         getTeacherClasses: builder.query({
// //             query: () => '/api/diary/teacher/classes',
// //             providesTags: ['TeacherClasses'],
// //         }),

// //         // Get subjects from tbl_ClassWiseSubject by class
// //         getSubjectsFromClassWise: builder.query({
// //             query: ({ classId }) => `/api/diary/class/${classId}/subjects-from-classwise`,
// //             providesTags: ['Subjects'],
// //         }),

// //         // Get teacher's diary entries with filters
// //         getTeacherDiaries: builder.query({
// //             query: ({ classId, sectionIds, subjectId, dateFrom, dateTo, page = 1, limit = 20 }) => {
// //                 const params = new URLSearchParams();
// //                 if (classId) params.append('classId', classId);
// //                 if (sectionIds?.length) params.append('sectionIds', sectionIds.join(','));
// //                 if (subjectId) params.append('subjectId', subjectId);
// //                 if (dateFrom) params.append('dateFrom', dateFrom);
// //                 if (dateTo) params.append('dateTo', dateTo);
// //                 params.append('page', page);
// //                 params.append('limit', limit);
// //                 return `/api/diary/teacher/entries?${params.toString()}`;
// //             },
// //             providesTags: (result, error, arg) => 
// //                 result ? [{ type: 'Diary', id: 'LIST' }] : ['Diary'],
// //         }),

// //         // Create batch diary (multiple sections)
// //         createBatchDiary: builder.mutation({
// //             query: (diaryData) => ({
// //                 url: '/api/diary/batch',
// //                 method: 'POST',
// //                 body: diaryData,
// //             }),
// //             invalidatesTags: ['Diary'],
// //         }),

// //         // Get single diary entry (for editing)
// //         getDiaryEntry: builder.query({
// //             query: ({ entryId }) => `/api/diary/entry/${entryId}`,
// //             providesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
// //         }),

// //         // Update existing diary
// //         updateDiaryEntry: builder.mutation({
// //             query: ({ entryId, data }) => ({
// //                 url: `/api/diary/entry/${entryId}`,
// //                 method: 'PUT',
// //                 body: data,
// //             }),
// //             invalidatesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
// //         }),
// //     }),
// // });

// // export const {
// //     useGetTeacherClassesQuery,
// //     useGetSubjectsFromClassWiseQuery,
// //     useGetTeacherDiariesQuery,
// //     useCreateBatchDiaryMutation,
// //     useGetDiaryEntryQuery,
// //     useUpdateDiaryEntryMutation,
// // } = diaryApi;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { BASE_URL } from '../config/constants';

// export const diaryApi = createApi({
//     reducerPath: 'diaryApi',
//     baseQuery: fetchBaseQuery({
//         baseUrl: BASE_URL,
//         prepareHeaders: (headers, { getState }) => {
//             const token = getState().auth?.token;
//             if (token) {
//                 headers.set('Authorization', `Bearer ${token}`);
//             }
//             headers.set('Accept', 'application/json');
//             headers.set('Content-Type', 'application/json');
//             return headers;
//         }
//     }),
//     tagTypes: ['Diary', 'TeacherClasses', 'Subjects'],
//     endpoints: (builder) => ({
//         // Get teacher's assigned classes with sections
//         getTeacherClasses: builder.query({
//             query: () => '/api/diary/teacher/classes',
//             providesTags: ['TeacherClasses'],
//         }),

//         // ✅ USE THIS ONE - Gets subjects from tbl_ClassWiseSubject (ALL subjects for the class)
//         getSubjectsFromClassWise: builder.query({
//             query: ({ classId }) => `/api/diary/class/${classId}/subjects-from-classwise`,
//             providesTags: ['Subjects'],
//         }),

//         // ❌ DON'T USE THIS - This only returns subjects the teacher is assigned to
//         getSubjectsByClass: builder.query({
//             query: ({ classId, sectionId }) => 
//                 `/api/diary/class/${classId}/subjects${sectionId ? `?sectionId=${sectionId}` : ''}`,
//             providesTags: ['Subjects'],
//         }),

//         // Get teacher's diary entries with filters
//         getTeacherDiaries: builder.query({
//             query: ({ classId, sectionIds, subjectId, dateFrom, dateTo, page = 1, limit = 20 }) => {
//                 const params = new URLSearchParams();
//                 if (classId) params.append('classId', classId);
//                 if (sectionIds?.length) params.append('sectionIds', sectionIds.join(','));
//                 if (subjectId) params.append('subjectId', subjectId);
//                 if (dateFrom) params.append('dateFrom', dateFrom);
//                 if (dateTo) params.append('dateTo', dateTo);
//                 params.append('page', page);
//                 params.append('limit', limit);
//                 return `/api/diary/teacher/entries?${params.toString()}`;
//             },
//             providesTags: (result, error, arg) => 
//                 result ? [{ type: 'Diary', id: 'LIST' }] : ['Diary'],
//         }),

//         // Create batch diary (multiple sections)
//         createBatchDiary: builder.mutation({
//             query: (diaryData) => ({
//                 url: '/api/diary/batch',
//                 method: 'POST',
//                 body: diaryData,
//             }),
//             invalidatesTags: ['Diary'],
//         }),

//         // Get single diary entry (for editing)
//         getDiaryEntry: builder.query({
//             query: ({ entryId }) => `/api/diary/entry/${entryId}`,
//             providesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
//         }),

//         // Update existing diary
//         updateDiaryEntry: builder.mutation({
//             query: ({ entryId, data }) => ({
//                 url: `/api/diary/entry/${entryId}`,
//                 method: 'PUT',
//                 body: data,
//             }),
//             invalidatesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
//         }),
//     }),
// });

// export const {
//     useGetTeacherClassesQuery,
//     useGetSubjectsFromClassWiseQuery,  // ✅ Use this one
//     useGetSubjectsByClassQuery,         // ❌ Don't use this
//     useGetTeacherDiariesQuery,
//     useCreateBatchDiaryMutation,
//     useGetDiaryEntryQuery,
//     useUpdateDiaryEntryMutation,
// } = diaryApi;


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const diaryApi = createApi({
    reducerPath: 'diaryApi',
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
        }
    }),
    tagTypes: ['Diary', 'TeacherClasses', 'Subjects', 'ClassWork', 'SOW'],
    endpoints: (builder) => ({
        // Get teacher's assigned classes with sections
        getTeacherClasses: builder.query({
            query: () => '/api/diary/teacher/classes',
            providesTags: ['TeacherClasses'],
        }),

        // Gets subjects from tbl_ClassWiseSubject (ALL subjects for the class)
        getSubjectsFromClassWise: builder.query({
            query: ({ classId }) => `/api/diary/class/${classId}/subjects-from-classwise`,
            providesTags: ['Subjects'],
        }),

        // ❌ DON'T USE THIS - This only returns subjects the teacher is assigned to
        getSubjectsByClass: builder.query({
            query: ({ classId, sectionId }) => 
                `/api/diary/class/${classId}/subjects${sectionId ? `?sectionId=${sectionId}` : ''}`,
            providesTags: ['Subjects'],
        }),

        // Get teacher's diary entries with filters
        getTeacherDiaries: builder.query({
            query: ({ classId, sectionIds, subjectId, dateFrom, dateTo, page = 1, limit = 20 }) => {
                const params = new URLSearchParams();
                if (classId) params.append('classId', classId);
                if (sectionIds?.length) params.append('sectionIds', sectionIds.join(','));
                if (subjectId) params.append('subjectId', subjectId);
                if (dateFrom) params.append('dateFrom', dateFrom);
                if (dateTo) params.append('dateTo', dateTo);
                params.append('page', page);
                params.append('limit', limit);
                return `/api/diary/teacher/entries?${params.toString()}`;
            },
            providesTags: (result, error, arg) => 
                result ? [{ type: 'Diary', id: 'LIST' }] : ['Diary'],
        }),

        // Create batch diary (multiple sections)
        createBatchDiary: builder.mutation({
            query: (diaryData) => ({
                url: '/api/diary/batch',
                method: 'POST',
                body: diaryData,
            }),
            invalidatesTags: ['Diary'],
        }),

        // Get single diary entry (for editing)
        getDiaryEntry: builder.query({
            query: ({ entryId }) => `/api/diary/entry/${entryId}`,
            providesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
        }),

        // Update existing diary
        updateDiaryEntry: builder.mutation({
            query: ({ entryId, data }) => ({
                url: `/api/diary/entry/${entryId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { entryId }) => [{ type: 'Diary', id: entryId }],
        }),

        // ==================== NEW ENDPOINTS ADDED ====================

        // GET: Class Work from sp_PrintClassWork stored procedure
        getClassWork: builder.query({
            query: ({ classId, sectionId, lessonDate }) => {
                // Format date as MM/dd/yyyy to match backend expectation
                let formattedDate = lessonDate;
                if (lessonDate instanceof Date) {
                    const month = (lessonDate.getMonth() + 1).toString().padStart(2, '0');
                    const day = lessonDate.getDate().toString().padStart(2, '0');
                    const year = lessonDate.getFullYear();
                    formattedDate = `${month}/${day}/${year}`;
                }
                return `/api/diary/class-work?classId=${classId}&sectionId=${sectionId}&lessonDate=${formattedDate}`;
            },
            transformResponse: (response) => {
                // Handle ApiResponse wrapper format
                if (response?.success === true && response?.data) {
                    return response.data;
                }
                if (Array.isArray(response)) {
                    return response;
                }
                return [];
            },
            providesTags: (result, error, { lessonDate }) => 
                result ? [{ type: 'ClassWork', id: lessonDate }] : ['ClassWork'],
        }),

        // GET: Scheme of Work from sp_rptSchemeOfWorkForMonth stored procedure
        getSchemeOfWork: builder.query({
            query: ({ classId, sectionId, month, year }) => {
                return `/api/diary/scheme-of-work?classId=${classId}&sectionId=${sectionId}&month=${encodeURIComponent(month)}&year=${year}`;
            },
            transformResponse: (response) => {
                if (response?.success === true && response?.data) {
                    return response.data;
                }
                if (Array.isArray(response)) {
                    return response;
                }
                return [];
            },
            providesTags: (result, error, { month, year }) => 
                result ? [{ type: 'SOW', id: `${month}-${year}` }] : ['SOW'],
        }),
    }),
});

export const {
    useGetTeacherClassesQuery,
    useGetSubjectsFromClassWiseQuery,
    useGetSubjectsByClassQuery,
    useGetTeacherDiariesQuery,
    useCreateBatchDiaryMutation,
    useGetDiaryEntryQuery,
    useUpdateDiaryEntryMutation,
    useGetClassWorkQuery,
    useGetSchemeOfWorkQuery,
} = diaryApi;

export default diaryApi;