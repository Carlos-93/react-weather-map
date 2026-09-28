import { loadEnv } from 'vite';
import { GET as cities } from '../api/cities.js';
import { GET as weather } from '../api/weather.js';

// The Vercel Functions in api/, by the path they answer on
const ROUTES = { '/api/weather': weather, '/api/cities': cities };

// Method to serve the API requests through Vite's dev server and preview server
function serve(handler) {
  return async (req, res) => {
    const response = await handler(new Request(new URL(req.originalUrl, 'http://localhost')));
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  };
}

function mountRoutes(server) {
  for (const [path, handler] of Object.entries(ROUTES)) server.middlewares.use(path, serve(handler));
}

// Vite plugin that runs the api/ Functions locally, so no Vercel CLI is needed
export default function weatherApi() {
  return {
    name: 'weather-api',
    // Vite only loads VITE_ variables, so read the server-only key by hand
    configResolved({ mode, envDir }) {
      process.env.OPENWEATHER_KEY ??= loadEnv(mode, envDir, 'OPENWEATHER_').OPENWEATHER_KEY;
    },
    // Hooks must return nothing: Vite runs a returned function as post middleware
    configureServer(server) {
      mountRoutes(server);
    },
    configurePreviewServer(server) {
      mountRoutes(server);
    },
  };
}