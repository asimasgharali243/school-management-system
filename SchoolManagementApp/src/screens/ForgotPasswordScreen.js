import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Forgot Password Screen</Text>
            <Button
                title="Back to Login"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default ForgotPasswordScreen;