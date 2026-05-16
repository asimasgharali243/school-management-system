// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import jsconfigPaths from 'vite-jsconfig-paths';

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');
//   const API_URL = `${env.VITE_APP_BASE_NAME}`;
//   // this sets a default port to 3000
//   const PORT = `${'3000'}`;

//   return {

//      publicDir: 'public',
//     server: {
//       // this ensures that the browser opens upon server start
//       open: true,
//       port: PORT
//     },
//     define: {
//       global: 'window'
//     },
//     resolve: {
//       //     alias: [
//       //       {
//       //         find: /^~(.+)/,
//       //         replacement: path.join(process.cwd(), 'node_modules/$1')
//       //       },
//       //       {
//       //         find: /^src(.+)/,
//       //         replacement: path.join(process.cwd(), 'src/$1')
//       //       }
//       //     ]
//     },
//     preview: {
//       // this ensures that the browser opens upon preview start
//       open: true,
//       port: PORT
//     },
//     base: API_URL,
//     plugins: [react(), jsconfigPaths()]
//   };
// });


import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_APP_BASE_NAME ? `/${env.VITE_APP_BASE_NAME}/` : '/';
  
  return {
    publicDir: 'public',
    server: {
      open: true,
      port: 3000
    },
    define: {
      global: 'window'
    },
    preview: {
      open: true,
      port: 3000
    },
    // Fix: Base path should start and end with slash for subdirectory deployment
    base: base,
    plugins: [react(), jsconfigPaths()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Add this to ensure proper chunking
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@mui/material', '@mui/icons-material', '@mui/lab'],
            charts: ['apexcharts', 'react-apexcharts'],
            routing: ['react-router-dom'],
            state: ['redux', 'react-redux', '@reduxjs/toolkit']
          }
        }
      }
    }
  };
});