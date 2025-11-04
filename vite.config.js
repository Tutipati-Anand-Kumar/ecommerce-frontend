import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        theme: {
          screens: {
            mid: { min: '345px', max: '500px' },
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
          },
        },
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});