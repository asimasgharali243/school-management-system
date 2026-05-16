// utils/apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/constants';
const baseURLApi= BASE_URL + '/api';
const apiClient = axios.create({
    baseURL: baseURLApi,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.log('Unauthorized! Logging out...');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            // You might want to redirect to login here
        }
        return Promise.reject(error);
    }
);

export { apiClient };