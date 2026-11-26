// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { BASE_URL } from '../config/constants';

// export const galleryApi = createApi({
//     reducerPath: 'galleryApi',
//     baseQuery: fetchBaseQuery({
//         baseUrl: BASE_URL,
//         prepareHeaders: (headers, { getState }) => {
//             const token = getState().auth?.token;
//             if (token) headers.set('Authorization', `Bearer ${token}`);
//             headers.set('Accept', 'application/json');
//             return headers;
//         },
//     }),
//     tagTypes: ['GalleryAlbums', 'GalleryAlbum'],
//     endpoints: (builder) => ({
//         getGalleryAlbums: builder.query({
//             query: ({ classId, sectionId, page = 1, limit = 20 }) => {
//                 let url = `/api/Gallery/albums?page=${page}&limit=${limit}`;
//                 if (classId) url += `&classId=${classId}`;
//                 if (sectionId) url += `&sectionId=${sectionId}`;
//                 return url;
//             },
//             providesTags: ['GalleryAlbums'],
//             transformResponse: (response) => response?.data || { albums: [], total: 0 },
//         }),

//         getGalleryAlbum: builder.query({
//             query: (albumId) => `/api/Gallery/album/${albumId}`,
//             providesTags: (result, error, albumId) => [{ type: 'GalleryAlbum', id: albumId }],
//             transformResponse: (response) => response?.data || null,
//         }),

//         createAlbum: builder.mutation({
//             query: (formData) => ({
//                 url: '/api/Gallery/create-album',
//                 method: 'POST',
//                 body: formData,
//             }),
//             invalidatesTags: ['GalleryAlbums'],
//         }),

//         deleteAlbum: builder.mutation({
//             query: (albumId) => ({
//                 url: `/api/Gallery/album/${albumId}`,
//                 method: 'DELETE',
//             }),
//             invalidatesTags: ['GalleryAlbums'],
//         }),
//     }),
// });

// export const {
//     useGetGalleryAlbumsQuery,
//     useGetGalleryAlbumQuery,
//     useCreateAlbumMutation,
//     useDeleteAlbumMutation,
// } = galleryApi;

// export default galleryApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/constants';

export const galleryApi = createApi({
    reducerPath: 'galleryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            headers.set('Accept', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['GalleryAlbums', 'GalleryAlbum'],
    endpoints: (builder) => ({
        // Existing endpoints
        getGalleryAlbums: builder.query({
            query: ({ classId, sectionId, page = 1, limit = 20 }) => {
                let url = `/api/Gallery/albums?page=${page}&limit=${limit}`;
                if (classId) url += `&classId=${classId}`;
                if (sectionId) url += `&sectionId=${sectionId}`;
                return url;
            },
            providesTags: ['GalleryAlbums'],
            transformResponse: (response) => response?.data || { albums: [], total: 0 },
        }),

        // Student/Parent specific query (reuses same endpoint)
        getStudentAlbums: builder.query({
            query: ({ classId, sectionId, page = 1, limit = 20 }) => {
                let url = `/api/Gallery/albums?page=${page}&limit=${limit}`;
                if (classId) url += `&classId=${classId}`;
                if (sectionId) url += `&sectionId=${sectionId}`;
                return url;
            },
            providesTags: ['GalleryAlbums'],
            transformResponse: (response) => response?.data || { albums: [], total: 0 },
        }),

        getGalleryAlbum: builder.query({
            query: (albumId) => `/api/Gallery/album/${albumId}`,
            providesTags: (result, error, albumId) => [{ type: 'GalleryAlbum', id: albumId }],
            transformResponse: (response) => response?.data || null,
        }),

        createAlbum: builder.mutation({
            query: (formData) => ({
                url: '/api/Gallery/create-album',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['GalleryAlbums'],
        }),

        deleteAlbum: builder.mutation({
            query: (albumId) => ({
                url: `/api/Gallery/album/${albumId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['GalleryAlbums'],
        }),
    }),
});

export const {
    useGetGalleryAlbumsQuery,
    useGetStudentAlbumsQuery,
    useGetGalleryAlbumQuery,
    useCreateAlbumMutation,
    useDeleteAlbumMutation,
} = galleryApi;

export default galleryApi;