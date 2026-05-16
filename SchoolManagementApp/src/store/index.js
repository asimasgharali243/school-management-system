import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";

// Import all slices
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import teacherReducer from "./slices/teacherSlice";
import { gradesApi } from "./gradesApi";
import { attendanceApi } from "./attendanceApi";
import { diaryApi } from "./diaryApi";
import { feeApi } from "./feeApi";
import { complaintApi } from "./complaintApi";
// Create simple reducers for missing ones
const userReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  user: userReducer,
  teacher: teacherReducer,
  [gradesApi.reducerPath]: gradesApi.reducer,
  [attendanceApi.reducerPath]: attendanceApi.reducer,
  [diaryApi.reducerPath]: diaryApi.reducer,
  [feeApi.reducerPath]: feeApi.reducer,
  [complaintApi.reducerPath]: complaintApi.reducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "theme"],
  version: 1,
  migrate: (state) => {
    if (!state) {
      return Promise.resolve({
        _persist: { version: 1, rehydrated: false },
      });
    }

    // Migration: Ensure theme has proper structure
    if (state.theme && (!state.theme.themeData || !state.theme.theme)) {
      return Promise.resolve({
        ...state,
        theme: {
          theme: "light",
          themeData: {
            primary: "#2196F3",
            secondary: "#FF9800",
            background: "#FFFFFF",
            surface: "#F5F5F5",
            text: "#212121",
            textSecondary: "#757575",
            error: "#F44336",
            success: "#4CAF50",
            warning: "#FF9800",
            border: "#E0E0E0",
            card: "#FFFFFF",
          },
          isDarkMode: false,
        },
        _persist: { ...state._persist, version: 1 },
      });
    }

    // Migration: Ensure teacher slice exists
    if (!state.teacher) {
      return Promise.resolve({
        ...state,
        teacher: {
          classes: [],
          currentClass: null,
          students: [],
          attendance: [],
          todayAttendance: null,
          attendanceHistory: [],
          loading: false,
          error: null,
          success: false,
          attendanceLoading: false,
          studentsLoading: false,
        },
        _persist: { ...state._persist, version: 1 },
      });
    }

    return Promise.resolve(state);
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "diaryApi/executeQuery/fulfilled",
    "diaryApi/executeQuery/rejected"],
       
      },
    }).concat(
      gradesApi.middleware,
      attendanceApi.middleware,
      diaryApi.middleware,
      feeApi.middleware,
      complaintApi.middleware
    ), // Add RTK Query middleware here
});

export const persistor = persistStore(store);

// Optional: Clear persisted state if needed during development
// persistor.purge();

setupListeners(store.dispatch);
