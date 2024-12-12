import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react(),
        {
            name: 'pdf-worker-copy',
            buildEnd() {
                // Copy PDF worker to public directory
                const fs = require('fs');
                const workerPath = resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.js');
                const destPath = resolve(__dirname, 'public/js/pdf.worker.min.js');
                
                if (!fs.existsSync(resolve(__dirname, 'public/js'))) {
                    fs.mkdirSync(resolve(__dirname, 'public/js'), { recursive: true });
                }
                
                fs.copyFileSync(workerPath, destPath);
            }
        }
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});

