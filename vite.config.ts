import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    eslint({
      cache: false,
    }),
  ],
  server: {
    port: 5173,
  },
});
