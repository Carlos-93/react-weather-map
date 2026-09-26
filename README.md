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

- [React 19](https://react.dev) with [Create React App](https://create-react-app.dev)
- [axios](https://axios-http.com) for API requests
- [sonner](https://sonner.emilkowal.ski) for notices
- Plain CSS

## Getting started

Requirements: Node.js 22 or later and [pnpm](https://pnpm.io). The project pins `pnpm@11.2.2` in `package.json`; if you don't have pnpm, enable it with `corepack enable`.

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/Carlos-93/react-weather-map.git
   cd react-weather-map
   pnpm install
   ```

2. Create a free API key on [OpenWeather](https://home.openweathermap.org/api_keys) and save it in a `.env.local` file at the project root:

   ```bash
   REACT_APP_OPENWEATHER_KEY=your_api_key
   ```

3. Start the development server:

   ```bash
   pnpm start
   ```

   The app opens at http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `pnpm start` | Development server at http://localhost:3000 with hot reload |
| `pnpm build` | Production build to the `build/` folder |
| `pnpm test` | Jest tests in interactive watch mode |

## Deployment

The project deploys to [Vercel](https://vercel.com) on every push to `main`. `REACT_APP_OPENWEATHER_KEY` must be set in the Vercel project settings, because Create React App inlines it into the code at build time.
