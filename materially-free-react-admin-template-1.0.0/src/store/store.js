// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { authApi } from './api/authApi';
import { notificationApi } from './api/notificationApi';
import { usersApi } from './api/usersApi';
import { classApi } from './api/classApi';
import { sectionApi } from './api/sectionApi';
import { campusApi } from './api/campusApi';
import { studentApi } from './api/studentApi';

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            authApi.middleware,
            usersApi.middleware,
            notificationApi.middleware,
            classApi.middleware,
            sectionApi.middleware,
            campusApi.middleware,
            studentApi.middleware,
        ),
    devTools: import.meta.env.MODE !== 'production',
});

export default store;