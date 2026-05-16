// src/store/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, API_TIMEOUT } from '../config/constants';
import { logout } from './slices/authSlice';

// Base query with authentication
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    },
    timeout: API_TIMEOUT,
});

// Custom base query with error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        console.log('API Error:', result.error);

        // Handle 401 Unauthorized
        if (result.error.status === 401) {
            // Clear stored tokens
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');

            // Dispatch logout action
            api.dispatch(logout());

            // You can redirect to login screen here if needed
        }

        // Handle network errors
        if (result.error.status === 'FETCH_ERROR') {
            return {
                error: {
                    status: 'NETWORK_ERROR',
                    data: { message: 'Network connection failed. Please check your internet connection.' }
                }
            };
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'User',
        'Student',
        'Teacher',
        'Class',
        'Section',
        'Attendance',
        'Fee',
        'Notification',
        'Campus'
    ],
    endpoints: () => ({}),
});