// src/components/IconDiagnostic.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';

// Try different icon imports
let MaterialIcons;
let FontAwesome;
let Ionicons;
let MaterialCommunityIcons;

try {
    MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
} catch (e) {
    console.log('MaterialIctors not available');
}

try {
    FontAwesome = require('react-native-vector-icons/FontAwesome').default;
} catch (e) {
    console.log('FontAwesome not available');
}

try {
    Ionicons = require('react-native-vector-icons/Ionicons').default;
} catch (e) {
    console.log('Ionicons not available');
}

try {
    MaterialCommunityIcons = require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch (e) {
    console.log('MaterialCommunityIcons not available');
}

const IconDiagnostic = () => {
    const [logs, setLogs] = useState([]);
    const [testResults, setTestResults] = useState({});

    useEffect(() => {
        runDiagnostics();
    }, []);

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { message, type, timestamp }]);
        console.log(`[${type.toUpperCase()}] ${message}`);
    };

    const runDiagnostics = async () => {
        addLog('Starting icon diagnostics...');
        addLog(`Platform: ${Platform.OS}`);
        addLog(`React Native Version: ${Platform.VERSION}`);

        // Test 1: Check if modules can be imported
        addLog('Test 1: Checking module imports...');
        const modules = {
            'MaterialIcons': !!MaterialIcons,
            'FontAwesome': !!FontAwesome,
            'Ionicons': !!Ionicons,
            'MaterialCommunityIcons': !!MaterialCommunityIcons,
        };

        setTestResults(prev => ({ ...prev, modules }));
        Object.entries(modules).forEach(([name, available]) => {
            addLog(`${name}: ${available ? '✅ Available' : '❌ Not available'}`);
        });

        // Test 2: Check font files in assets
        addLog('Test 2: Checking font files...');
        const fontFiles = [
            'MaterialIcons.ttf',
            'FontAwesome.ttf',
            'Ionicons.ttf',
            'MaterialCommunityIcons.ttf'
        ];

        // Test 3: Try to create icon components
        addLog('Test 3: Creating icon components...');
        try {
            if (MaterialIcons) {
                const testIcon = <MaterialIcons name="home" size={24} color="black" />;
                addLog('✅ MaterialIcons component creation successful');
            }
        } catch (error) {
            addLog(`❌ MaterialIcons error: ${error.message}`, 'error');
        }

        addLog('Diagnostics complete');
    };

    const renderIconTest = (IconComponent, name, libraryName) => {
        if (!IconComponent) {
            return (
                <View style={styles.testItem}>
                    <Text style={styles.testName}>{libraryName}</Text>
                    <Text style={styles.testStatusFail}>❌ Not installed</Text>
                </View>
            );
        }

        try {
            return (
                <View style={styles.testItem}>
                    <Text style={styles.testName}>{libraryName}</Text>
                    <View style={styles.iconContainer}>
                        <IconComponent name={name} size={24} color="#4A90E2" />
                        <Text style={styles.iconName}>{name}</Text>
                    </View>
                    <Text style={styles.testStatusSuccess}>✅ Working</Text>
                </View>
            );
        } catch (error) {
            return (
                <View style={styles.testItem}>
                    <Text style={styles.testName}>{libraryName}</Text>
                    <Text style={styles.testStatusFail}>❌ Error: {error.message}</Text>
                </View>
            );
        }
    };

    const clearLogs = () => {
        setLogs([]);
        runDiagnostics();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🔍 Icon Diagnostics</Text>
                <TouchableOpacity onPress={clearLogs} style={styles.refreshButton}>
                    <Text style={styles.refreshText}>🔄 Refresh</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live Icon Tests</Text>

                {renderIconTest(MaterialIcons, 'home', 'Material Icons')}
                {renderIconTest(FontAwesome, 'home', 'Font Awesome')}
                {renderIconTest(Ionicons, 'home', 'Ionicons')}
                {renderIconTest(MaterialCommunityIcons, 'home', 'Material Community')}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>More Material Icons Tests</Text>
                <View style={styles.iconGrid}>
                    {MaterialIcons && ['person', 'school', 'settings', 'refresh', 'menu-book', 'group', 'edit', 'notifications'].map((iconName) => (
                        <View key={iconName} style={styles.iconItem}>
                            <MaterialIcons name={iconName} size={24} color="#333" />
                            <Text style={styles.iconLabel}>{iconName}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Console Logs</Text>
                <View style={styles.logContainer}>
                    {logs.map((log, index) => (
                        <Text key={index} style={[
                            styles.logText,
                            log.type === 'error' && styles.logError,
                            log.type === 'success' && styles.logSuccess
                        ]}>
                            [{log.timestamp}] {log.message}
                        </Text>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Troubleshooting Steps</Text>
                <View style={styles.steps}>
                    <Text style={styles.step}>1. Check if react-native-vector-icons is installed</Text>
                    <Text style={styles.code}>npm list react-native-vector-icons</Text>

                    <Text style={styles.step}>2. Verify font files exist in android/assets/fonts/</Text>
                    <Text style={styles.code}>ls android/app/src/main/assets/fonts/</Text>

                    <Text style={styles.step}>3. Clean and rebuild Android</Text>
                    <Text style={styles.code}>cd android && ./gradlew clean && cd ..</Text>
                    <Text style={styles.code}>npx react-native run-android</Text>

                    <Text style={styles.step}>4. Check package.json dependencies</Text>
                    <Text style={styles.step}>5. Try linking manually (for older RN versions)</Text>
                    <Text style={styles.code}>npx react-native link react-native-vector-icons</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#4A90E2',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    refreshButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
    },
    refreshText: {
        color: 'white',
        fontSize: 14,
    },
    section: {
        backgroundColor: 'white',
        margin: 10,
        padding: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    testItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    testName: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconName: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    testStatusSuccess: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    testStatusFail: {
        fontSize: 12,
        color: '#F44336',
        fontWeight: 'bold',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    iconItem: {
        width: '23%',
        alignItems: 'center',
        marginBottom: 12,
        padding: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 6,
    },
    iconLabel: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    logContainer: {
        backgroundColor: '#1a1a1a',
        padding: 12,
        borderRadius: 6,
        maxHeight: 200,
    },
    logText: {
        fontSize: 11,
        color: '#ccc',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        marginBottom: 2,
    },
    logError: {
        color: '#ff6b6b',
    },
    logSuccess: {
        color: '#51cf66',
    },
    steps: {
        marginTop: 8,
    },
    step: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    code: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 4,
        marginBottom: 8,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});

export default IconDiagnostic;