// Add this to your existing diaryApi.js or create a new feeApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const feeApi = createApi({
    reducerPath: 'feeApi',
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
    tagTypes: ['FeeLedger'],
    endpoints: (builder) => ({
        // Get Student Fee Ledger
        getStudentFeeLedger: builder.query({
            query: ({ studentRegistrationId, fromDate, toDate }) => {
                const params = new URLSearchParams();
                params.append('studentRegistrationId', studentRegistrationId);
                if (fromDate) params.append('fromDate', fromDate);
                if (toDate) params.append('toDate', toDate);
                return `/api/student/fee-ledger?${params.toString()}`;
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
            providesTags: (result, error, { studentRegistrationId }) => 
                result ? [{ type: 'FeeLedger', id: studentRegistrationId }] : ['FeeLedger'],
        }),
    }),
});

export const {
    useGetStudentFeeLedgerQuery,
} = feeApi;