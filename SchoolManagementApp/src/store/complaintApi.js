// store/complaintApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const complaintApi = createApi({
    reducerPath: 'complaintApi',
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
    tagTypes: ['Complaints', 'Categories'],
    endpoints: (builder) => ({
        // Get complaint categories
        getComplaintCategories: builder.query({
            query: () => '/api/Complaint/categories',
            transformResponse: (response) => {
                if (response?.success === true && response?.data) {
                    return response.data;
                }
                return [];
            },
            providesTags: ['Categories'],
        }),

        // Get complaints by student
        getComplaintsByStudent: builder.query({
            query: (studentId) => `/api/Complaint/student/${studentId}`,
            transformResponse: (response) => {
                if (response?.success === true && response?.data) {
                    return response.data;
                }
                return [];
            },
            providesTags: (result, error, studentId) => 
                result ? [{ type: 'Complaints', id: studentId }] : ['Complaints'],
        }),

        // Get complaints by parent
        getComplaintsByParent: builder.query({
            query: (parentId) => `/api/Complaint/parent/${parentId}`,
            transformResponse: (response) => {
                if (response?.success === true && response?.data) {
                    return response.data;
                }
                return [];
            },
            providesTags: ['Complaints'],
        }),

        // Create complaint
        createComplaint: builder.mutation({
            query: (complaintData) => ({
                url: '/api/Complaint/create',
                method: 'POST',
                body: complaintData,
            }),
            invalidatesTags: ['Complaints'],
        }),

        // Update complaint status
        updateComplaintStatus: builder.mutation({
            query: (statusData) => ({
                url: '/api/Complaint/update-status',
                method: 'PUT',
                body: statusData,
            }),
            invalidatesTags: ['Complaints'],
        }),

        // Get complaint by ID
        getComplaintById: builder.query({
            query: (complaintId) => `/api/Complaint/${complaintId}`,
            transformResponse: (response) => {
                if (response?.success === true && response?.data) {
                    return response.data;
                }
                return null;
            },
        }),
    }),
});

export const {
    useGetComplaintCategoriesQuery,
    useGetComplaintsByStudentQuery,
    useGetComplaintsByParentQuery,
    useCreateComplaintMutation,
    useUpdateComplaintStatusMutation,
    useGetComplaintByIdQuery,
} = complaintApi;