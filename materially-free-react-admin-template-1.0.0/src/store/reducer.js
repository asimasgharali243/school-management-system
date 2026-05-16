// store/reducer.js
import { combineReducers } from 'redux';
import customizationReducer from './customizationReducer';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { usersApi } from './api/usersApi';
import { notificationApi } from './api/notificationApi';
import { classApi } from './api/classApi';
import { sectionApi } from './api/sectionApi';
import { campusApi } from './api/campusApi';
import { studentApi } from './api/studentApi';

const reducer = combineReducers({
    customization: customizationReducer,
    auth: authReducer,

    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [classApi.reducerPath]: classApi.reducer,
    [sectionApi.reducerPath]: sectionApi.reducer,
    [campusApi.reducerPath]: campusApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
});

export default reducer;