import { apiSlice } from '../apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: '/users/profile',
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        getStudents: builder.query({
            query: ({ page = 1, limit = 20, search = '' }) => ({
                url: '/students',
                params: { page, limit, search },
            }),
            providesTags: ['Student'],
        }),
        getStudent: builder.query({
            query: (id) => `/students/${id}`,
            providesTags: (result, error, id) => [{ type: 'Student', id }],
        }),
        createStudent: builder.mutation({
            query: (studentData) => ({
                url: '/students',
                method: 'POST',
                body: studentData,
            }),
            invalidatesTags: ['Student'],
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...studentData }) => ({
                url: `/students/${id}`,
                method: 'PUT',
                body: studentData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetStudentsQuery,
    useGetStudentQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
} = userApi;