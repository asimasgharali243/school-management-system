import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './apiConfig';

export const studentApi = createApi({
    reducerPath: 'studentApi',
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
    tagTypes: ['Student', 'Section'],
    endpoints: (builder) => ({
        // Get students by class ID
        getStudentsByClass: builder.query({
            query: (classId) => `/api/Student/byclass/${classId}`,
            transformResponse: (response) => {
                console.log('Raw Student API response by class id:', response);
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: (result, error, classId) => [{ type: 'Student', id: `class_${classId}` }],
        }),

        // Get students by section ID
        getStudentsBySection: builder.query({
            query: (sectionId) => `/api/Student/bysection/${sectionId}`,
            transformResponse: (response) => {
                console.log('Raw Student API response by section id:', response);
                
                let students = [];
                if (response?.data) students = response.data;
                else if (response?.Data) students = response.Data;
                else if (Array.isArray(response)) students = response;
                
                // Log the first student to see what fields are present
                if (students && students.length > 0) {
                    console.log('First student fields:', Object.keys(students[0]));
                    console.log('RollNo value:', students[0].RollNo);
                    console.log('roll_no value:', students[0].roll_no);
                }
                
                return students;
            },
            providesTags: (result, error, sectionId) => [{ type: 'Student', id: `section_${sectionId}` }],
        }),

        // Debug endpoint to see raw student data
        getStudentsBySectionDebug: builder.query({
            query: (sectionId) => `/api/Student/bysection-debug/${sectionId}`,
            transformResponse: (response) => {
                console.log('Debug response:', response);
                return response;
            },
        }),

        // Get sections that have students
        getSectionsWithStudents: builder.query({
            query: () => `/api/Student/sections-with-students`,
            transformResponse: (response) => {
                console.log('Raw Sections with Students API response: with section id ', response);
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: ['Section'],
        }),

        // Get all sections with counts
        getAllSectionsWithCounts: builder.query({
            query: () => `/api/Student/all-sections-with-counts`,
            transformResponse: (response) => {
                console.log('Raw All Sections with Counts API response: with section id ', response);
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: ['Section'],
        }),

        // Get students by family
        getStudentsByFamily: builder.query({
            query: (familyCode) => `/api/Student/byfamily/${familyCode}`,
            transformResponse: (response) => {
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
        }),

        // Get parents by student
        getParentsByStudent: builder.query({
            query: (studentId) => `/api/Student/parents/${studentId}`,
            transformResponse: (response) => {
                if (response?.data) return response.data;
                if (response?.Data) return response.Data;
                if (Array.isArray(response)) return response;
                return [];
            },
        }),

        // Debug endpoint
        debugStudentSections: builder.query({
            query: () => `/api/Student/debug-student-sections`,
            transformResponse: (response) => {
                return response;
            },
        }),
    }),
});

export const {
    useGetStudentsByClassQuery,
    useGetStudentsBySectionQuery,
    useGetStudentsBySectionDebugQuery,
    useGetSectionsWithStudentsQuery,
    useGetAllSectionsWithCountsQuery,
    useGetStudentsByFamilyQuery,
    useGetParentsByStudentQuery,
    useDebugStudentSectionsQuery,
} = studentApi;