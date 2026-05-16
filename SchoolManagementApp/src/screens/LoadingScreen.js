// src/screens/LoadingScreen.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../store/slices/themeSlice';

const LoadingScreen = () => {
    const theme = useSelector(selectThemeData);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.text, { color: theme.text }]}>Loading...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 20,
        fontSize: 16,
    },
});

export default LoadingScreen;