import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
