import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // Specify the development server port
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./vitest.setup.js'],
        mockReset: true,
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules/',
                'src/main.jsx',
            ],
        },
    },
});