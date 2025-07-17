import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: './build',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
