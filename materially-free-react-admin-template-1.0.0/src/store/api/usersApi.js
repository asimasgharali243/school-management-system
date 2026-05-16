// store/api/usersApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../api/apiConfig';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/api/Users`,  // ✅ Changed from /users to /api/Users
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
        credentials: 'include',
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '',  // Now this will call /api/Users
            providesTags: ['User'],
        }),
        getProfile: builder.query({
            query: () => '/profile',
        }),
        validateUsername: builder.query({
            query: (username) => `/validate-username?username=${encodeURIComponent(username)}`,
        }),
        createUser: builder.mutation({
            query: (userData) => ({
                url: '',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...userData }) => ({
                url: `/${id}/update`,
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',  // ✅ Changed to DELETE
            }),
            invalidatesTags: ['User'],
        }),
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: '/change-password',
                method: 'POST',
                body: passwordData,
            }),
        }),
        resetUserPassword: builder.mutation({
            query: ({ id, newPassword }) => ({
                url: `/${id}/reset-password`,
                method: 'POST',
                body: { newPassword },
            }),
        }),
        toggleUserStatus: builder.mutation({
            query: ({ id, isActive }) => ({
                url: `/${id}/status`,
                method: 'POST',
                body: { isActive },
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetProfileQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useChangePasswordMutation,
    useValidateUsernameQuery,
    useResetUserPasswordMutation,
    useToggleUserStatusMutation,
} = usersApi;