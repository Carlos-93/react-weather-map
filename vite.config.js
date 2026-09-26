import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import weatherApi from './plugins/weather-api.js';

export default defineConfig({
  plugins: [react(), weatherApi()],
  server: { port: 3000, open: true },
  test: { environment: 'jsdom', setupFiles: './src/setupTests.js' },
});