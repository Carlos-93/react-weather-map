import { loadEnv } from 'vite';
import { GET } from '../api/weather.js';

// Method to serve the weather API requests through Vite's dev server and preview server
async function serveWeather(req, res) {
  const response = await GET(new Request(new URL(req.originalUrl, 'http://localhost')));
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(await response.text());
}

// Component to be used in Vite's plugin system to handle weather API requests
export default function weatherApi() {
  return {
    name: 'weather-api',
    // Vite only loads VITE_ variables, so read the server-only key by hand
    configResolved({ mode, envDir }) {
      process.env.OPENWEATHER_KEY ??= loadEnv(mode, envDir, 'OPENWEATHER_').OPENWEATHER_KEY;
    },
    // Hooks must return nothing: Vite runs a returned function as post middleware
    configureServer(server) {
      server.middlewares.use('/api/weather', serveWeather);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/weather', serveWeather);
    },
  };
}