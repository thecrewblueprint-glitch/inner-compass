import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? './' : '/',
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_INNER_COMPASS_PREVIEW': JSON.stringify(process.env.VITE_INNER_COMPASS_PREVIEW || 'false'),
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
