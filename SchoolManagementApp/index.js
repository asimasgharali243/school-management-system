// // index.js
// import { registerRootComponent } from 'expo';
// import { LogBox } from 'react-native';
// import App from './App';

// // Ignore all warnings temporarily
// LogBox.ignoreAllLogs();

// // Global error handler
// if (!__DEV__) {
//     const defaultHandler = ErrorUtils?.getGlobalHandler?.();
//     if (defaultHandler) {
//         ErrorUtils.setGlobalHandler((error, isFatal) => {
//             console.error('🔥 GLOBAL ERROR:', error, isFatal);
//             defaultHandler(error, isFatal);
//         });
//     }
// }

// console.log('🚀 App starting...');

// registerRootComponent(App);
import { registerRootComponent } from 'expo';
import { LogBox, Platform } from 'react-native';
import App from './App';

// ✅ Filter specific warnings instead of ignoring all
LogBox.ignoreLogs([
    'ViewPropTypes will be removed',
    'ColorPropType will be removed',
    'Require cycle:',
    'source.uri should not be an empty string', // Add this line
    'VirtualizedLists should never be nested', // Common warning
]);

// ✅ Or better: Only ignore in production
if (__DEV__) {
    // Keep warnings visible in development
} else {
    LogBox.ignoreAllLogs();
}

console.log('🚀 App starting...', {
    platform: Platform.OS,
    timestamp: new Date().toISOString()
});

registerRootComponent(App);