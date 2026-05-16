// src/store/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../../config/constants';

const initialState = {
    theme: 'light',
    themeData: themes.light,
    isDarkMode: false,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            state.themeData = themes[action.payload] || themes.light;
            state.isDarkMode = action.payload === 'dark';
            AsyncStorage.setItem('theme', action.payload);
        },
        toggleTheme: (state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            state.theme = newTheme;
            state.themeData = themes[newTheme];
            state.isDarkMode = newTheme === 'dark';
            AsyncStorage.setItem('theme', newTheme);
        },
        loadTheme: (state, action) => {
            const savedTheme = action.payload;
            state.theme = savedTheme || 'light';
            state.themeData = themes[savedTheme] || themes.light;
            state.isDarkMode = savedTheme === 'dark';
        },
    },
});

export const { setTheme, toggleTheme, loadTheme } = themeSlice.actions;

// Selectors
export const selectTheme = (state) => state.theme.theme;
export const selectThemeData = (state) => state.theme.themeData;
export const selectIsDarkMode = (state) => state.theme.isDarkMode;

export default themeSlice.reducer;