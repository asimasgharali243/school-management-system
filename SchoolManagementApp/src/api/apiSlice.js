import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseQuery = fetchBaseQuery({
    baseUrl: 'YOUR_API_BASE_URL',
    prepareHeaders: async (headers) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        const result = await baseQuery(args, api, extraOptions);

        if (result.error && result.error.status === 401) {
            // Handle token expiration
            await AsyncStorage.removeItem('token');
            // You can dispatch logout action here
        }

        return result;
    },
    tagTypes: ['User', 'Student', 'Teacher', 'Class', 'Attendance', 'Fee'],
    endpoints: () => ({}),
});