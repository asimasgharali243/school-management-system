
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const lectureApi = createApi({
    reducerPath: 'lectureApi',
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
    tagTypes: ['Lectures', 'LectureClasses', 'LectureSections', 'LectureSubjects', 'LectureBooks', 'LectureChapters', 'LectureTopics'],
    endpoints: (builder) => ({
        // Class
        getLectureClasses: builder.query({
            query: () => '/api/Lectures/classes',
            providesTags: ['LectureClasses'],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                if (Array.isArray(response)) return response;
                return [];
            },
            keepUnusedDataFor: 300,
        }),

        // Sections
        getLectureSections: builder.query({
            query: (classId) => `/api/Lectures/sections/${classId}`,
            providesTags: (result, error, classId) => [{ type: 'LectureSections', id: classId }],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                if (Array.isArray(response)) return response;
                return [];
            },
            keepUnusedDataFor: 300,
        }),

        // Subjects
        getLectureSubjects: builder.query({
            query: (classId) => `/api/Lectures/subjects/${classId}`,
            providesTags: (result, error, classId) => [{ type: 'LectureSubjects', id: classId }],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                if (Array.isArray(response)) return response;
                return [];
            },
            keepUnusedDataFor: 300,
        }),

        // Books (from tbl_SubjectBook)
        getLectureBooks: builder.query({
            query: ({ classId, subjectId }) => `/api/Lectures/books/${classId}/${subjectId}`,
            providesTags: (result, error, { classId, subjectId }) => [{ type: 'LectureBooks', id: `${classId}-${subjectId}` }],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                if (Array.isArray(response)) return response;
                return [];
            },
            keepUnusedDataFor: 300,
        }),

        // Chapters (from tbl_SubjectChapter)
        getLectureChapters: builder.query({
            query: ({ classId, subjectId, bookId }) => `/api/Lectures/chapters/${classId}/${subjectId}/${bookId}`,
            providesTags: (result, error, { classId, subjectId, bookId }) => [{ type: 'LectureChapters', id: `${classId}-${subjectId}-${bookId}` }],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                if (Array.isArray(response)) return response;
                return [];
            },
            keepUnusedDataFor: 300,
        }),

        // Topics (from tbl_ChapterTopic)
        getLectureTopics: builder.query({
            query: ({ classId, subjectId, bookId, chapterId }) => `/api/Lectures/topics/${classId}/${subjectId}/${bookId}/${chapterId}`,
            providesTags: (result, error, { classId, subjectId, bookId, chapterId }) => [{ type: 'LectureTopics', id: `${classId}-${subjectId}-${bookId}-${chapterId}` }],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                if (Array.isArray(response)) return response;
                return [];
            },
            keepUnusedDataFor: 300,
        }),

        // Create Lecture
        createLecture: builder.mutation({
            query: (lectureData) => ({
                url: '/api/Lectures/create',
                method: 'POST',
                body: lectureData,
            }),
            invalidatesTags: ['Lectures'],
        }),

        // Teacher Lecture List
        getTeacherLectures: builder.query({
            query: ({ classId, subjectId, page = 1, limit = 20 }) => {
                let url = `/api/Lectures/list?page=${page}&limit=${limit}`;
                if (classId) url += `&classId=${classId}`;
                if (subjectId) url += `&subjectId=${subjectId}`;
                return url;
            },
            providesTags: ['Lectures'],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                return { lectures: [], total: 0, page: 1, limit: 20, totalPages: 0 };
            },
        }),

        // Student/Parent Lecture List
        getStudentLectures: builder.query({
            query: ({ classId, sectionId, page = 1, limit = 20 }) =>
                `/api/Lectures/student?classId=${classId}&sectionId=${sectionId}&page=${page}&limit=${limit}`,
            providesTags: ['Lectures'],
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                return { lectures: [], total: 0, page: 1, limit: 20, totalPages: 0 };
            },
        }),

        // Get Single Lecture
        getLectureById: builder.query({
            query: (lectureId) => `/api/Lectures/${lectureId}`,
            transformResponse: (response) => {
                if (response?.success && response?.data) return response.data;
                return null;
            },
        }),

        // Delete Lecture
        deleteLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/api/Lectures/${lectureId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Lectures'],
        }),
    }),
});

export const {
    useGetLectureClassesQuery,
    useGetLectureSectionsQuery,
    useGetLectureSubjectsQuery,
    useGetLectureBooksQuery,
    useGetLectureChaptersQuery,
    useGetLectureTopicsQuery,
    useCreateLectureMutation,
    useGetTeacherLecturesQuery,
    useGetStudentLecturesQuery,
    useGetLectureByIdQuery,
    useDeleteLectureMutation,
} = lectureApi;

export default lectureApi;