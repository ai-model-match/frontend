import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import path from 'path';

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    eslint({
      cache: false,
    }),
  ],
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, './src/context'),
      '@locales': path.resolve(__dirname, './src/locales'),
      '@types': path.resolve(__dirname, './src/types'),
      '@dtos': path.resolve(__dirname, './src/dtos'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@guards': path.resolve(__dirname, './src/guards'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  server: {
    port: 5173,
  },
});
