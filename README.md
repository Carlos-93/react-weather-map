<p align="center"><img src="https://raw.githubusercontent.com/Carlos-93/react-weather-map/main/public/logo192.png" width="15%"></p>

# Tiempo y Radar

A React web app that shows the current weather for any city, using the [OpenWeather Current Weather API](https://openweathermap.org/current). The interface is in Spanish.

**Demo:** https://weather-radar-map.vercel.app

## Features

- Search by city (press `/` from anywhere to jump to the search box), use your current location or pick one of the suggested cities.
- The current weather: temperature, feels like, description and icon, wind speed, gusts and direction on a compass, humidity, pressure, visibility, cloudiness, rain or snow in the last hour, sunrise, sunset and daylight on the sun's arc, coordinates, time zone, local time and when the data was measured.
- Full-screen background that matches the weather, with ambient effects: rain, snow, lightning, drifting mist, a sun glow or stars at night.
- Glass cards, staggered entrance animations and cross-fades between searches (View Transitions API), all reduced to simple fades when the system asks for reduced motion.
- Notice when the city does not exist or the request fails.

## Tech stack

- [React 19](https://react.dev) with [Vite](https://vite.dev)
- Native `fetch` for API requests
- [sonner](https://sonner.emilkowal.ski) for notices
- [Lucide](https://lucide.dev) icons and animated [Meteocons](https://github.com/basmilius/meteocons-poc) weather icons by Bas Milius (MIT)
- Plain CSS with cascade layers, container queries and native nesting
- [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com) for tests, [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Getting started

Requirements: Node.js 22.22 or 24.15 or later and [pnpm](https://pnpm.io). The project pins `pnpm@11.2.2` in `package.json`; if you don't have pnpm, enable it with `corepack enable`.

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/Carlos-93/react-weather-map.git
   cd react-weather-map
   pnpm install
   ```

2. Create a free API key on [OpenWeather](https://home.openweathermap.org/api_keys) and save it in a `.env.local` file at the project root:

   ```bash
   OPENWEATHER_KEY=your_api_key
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

   The app opens at http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Development server at http://localhost:3000 with hot reload |
| `pnpm build` | Production build to the `dist/` folder |
| `pnpm preview` | Serves the production build locally, including `/api/weather` |
| `pnpm test` | Vitest tests in watch mode (`pnpm test run` runs them once) |
| `pnpm lint` | Lints the code with Oxlint |

## Deployment

The project deploys to [Vercel](https://vercel.com) on every push to `main`. `OPENWEATHER_KEY` must be set in the Vercel project settings.

The browser never calls OpenWeather directly. It calls `/api/weather`, a Vercel Function in `api/weather.js` that adds the API key on the server, so the key does not appear in the client code. During development, a small Vite plugin in `plugins/weather-api.js` runs the same function inside the `pnpm dev` and `pnpm preview` servers.
