// src/services/authService.js
import { apiSlice } from '../store/apiSlice';
import { encode } from '../utils/encryption';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: {
                    ...credentials,
                    password: encode(credentials.password),
                },
            }),
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        validateToken: builder.query({
            query: () => '/auth/validate',
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
        changePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: '/users/change-password',
                method: 'POST',
                body: {
                    oldPassword: encode(oldPassword),
                    newPassword: encode(newPassword),
                },
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useValidateTokenQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = authApi;