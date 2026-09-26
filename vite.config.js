import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { GET } from './api/weather.js';

// Serves the Vercel Function in api/ from `pnpm dev` and `pnpm preview`, so both work without the Vercel CLI
async function serveWeather(req, res) {
  const response = await GET(new Request(new URL(req.originalUrl, 'http://localhost')));
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(await response.text());
}

// The hooks must not return anything: Vite would call a returned function as a post middleware hook
const weatherApi = {
  name: 'weather-api',
  configureServer(server) {
    server.middlewares.use('/api/weather', serveWeather);
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/weather', serveWeather);
  },
};

export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_ variables to the client, so load the server-only key from .env files by hand
  process.env.OPENWEATHER_KEY ??= loadEnv(mode, process.cwd(), 'OPENWEATHER_').OPENWEATHER_KEY;

  return {
    plugins: [react(), weatherApi],
    server: { port: 3000, open: true },
    test: {
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
  };
});
