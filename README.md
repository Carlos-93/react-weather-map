<p align="center"><img src="https://raw.githubusercontent.com/Carlos-93/react-weather-map/main/public/logo192.png" width="15%"></p>

# Tiempo y Radar

A React web app that shows the current weather for any city, using the [OpenWeather Current Weather API](https://openweathermap.org/current). The interface is in Spanish.

**Demo:** https://weather-radar-map.vercel.app

## Features

- Search by city: type the name and press Enter.
- Temperature, weather description, feels-like temperature, humidity and wind speed in km/h.
- Background that matches the weather: clear, clouds, rain, snow, fog, haze or thunderstorm.
- Notice when the city does not exist or the request fails.

## Tech stack

- [React 19](https://react.dev) with [Vite](https://vite.dev)
- Native `fetch` for API requests
- [sonner](https://sonner.emilkowal.ski) for notices
- Plain CSS
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

The browser never calls OpenWeather directly. It calls `/api/weather`, a Vercel Function in `api/weather.js` that adds the API key on the server, so the key does not appear in the client code. During development, a small plugin in `vite.config.js` runs the same function inside the `pnpm dev` and `pnpm preview` servers.
