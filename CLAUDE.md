# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Vite dev server at http://localhost:3000 with hot reload (opens the browser)
pnpm build      # Production build to dist/
pnpm preview    # Serves dist/ locally, including /api/weather
pnpm test       # Vitest in watch mode (tests in src/App.test.jsx, fetch is mocked)
pnpm test run   # Vitest once, without watch mode
pnpm lint       # Oxlint (.oxlintrc.json)
```

`pnpm build` does not lint; run `pnpm lint` separately.

**Package manager: pnpm only.** The project pins `pnpm@11.2.2` via `packageManager` in `package.json`. Enable with `corepack enable` if needed.

## Stack

Vite 8 with `@vitejs/plugin-react`, React 19, plain JavaScript (`.jsx` for any file with JSX) and plain CSS. No TypeScript, no router, no state library. `package.json` sets `"type": "module"`, so every `.js` file is ESM. Tests use Vitest with jsdom and Testing Library; `src/setupTests.js` loads the `jest-dom` matchers and cleans up after each test. Requires Node.js 22.22 or 24.15 or later (the jsdom and Vitest minimums).

## Code style

- Use modern JavaScript: `const`/`let` (never `var`), arrow functions, template literals, optional chaining and nullish coalescing.
- Use modern React: function components and hooks only, no class components or deprecated APIs.
- Prefer the smallest implementation that solves the problem. Avoid unnecessary abstraction, state or dependencies.

## Architecture

Single-screen app that shows the current weather for a searched city. All user-facing text is in Spanish (Spain), hardcoded in the components; there is no i18n library.

- `index.html` (project root) loads `src/main.jsx`, which renders `App`. Static files served as-is (favicon, manifest, `llms.txt`, `robots.txt`) live in `public/`.
- `src/App.jsx` holds all state (`data`, `query`). `data` starts as `null` and `WeatherInfo` only renders after a successful search. `searchWeather` runs on form submit (Enter): it calls `/api/weather?city=<city>` with native `fetch` and stores the response in `data`. Failed searches show a `sonner` toast (404 means the city was not found).
- `api/weather.js` is a Vercel Function that exports a Web-standard `GET(request)` handler returning a `Response`. It proxies the OpenWeather Current Weather API (`/data/2.5/weather`, metric units, `lang: 'es'`), so the API key never reaches the browser. It forwards OpenWeather's status and JSON, returns 400 for an empty `city` (sent to OpenWeather as its `q` parameter) and 502 if OpenWeather is unreachable, and lets the CDN cache successful answers for 10 minutes.
- The `weather-api` plugin in `plugins/weather-api.js` (registered in `vite.config.js`) mounts that same `GET` handler on `/api/weather` in the dev and preview servers, so `pnpm dev` and `pnpm preview` work without the Vercel CLI. Its `configureServer`/`configurePreviewServer` hooks must not return a value, because Vite calls a returned function as a post-middleware hook. Keep it outside `api/`: Vercel turns every file there into a public Function. Restart `pnpm dev` after changing `api/weather.js`, `plugins/` or `vite.config.js`.
- `lang: 'es'` translates `weather[0].description` (shown in the UI) but never `weather[0].main`, which stays in English. The `WEATHER_CONDITIONS` object in `src/constants.js` (the home for app-wide constants) maps `data.weather[0].main` (capitalized, e.g. `Rain`) to a CSS class (`rain`, `clouds`, `clear`, `snow`, `fog`, `haze`, `thunderstorm`, or `default`) that is added to `<main className="app ...">`.
- `src/components/` contains presentational components only: `SearchBar` (controlled search input inside a `<form role="search">`, with `value`/`onChange(value)`/`onSubmit` props) and `WeatherInfo` (renders fields from the raw API response). Import each one directly from its file; there is no barrel `index` file.
- `src/index.css` holds all styles. Each weather class sets the background image on `.app:before` from `src/assets/images/<class>.jpg`. To support a new weather condition, add an entry to `WEATHER_CONDITIONS` in `src/constants.js`, a `.app.<class>:before` rule that sets `background-image`, and the matching image (at most 1920px wide). Dark images need light text, like the `.app.thunderstorm` rules.

## Deployment

Vercel deploys every push to `main` to https://weather-radar-map.vercel.app. The Vite framework preset (build with `vite build`, output `dist/`) is set in the Vercel project settings; there is no `vercel.json`. Vercel turns `api/` into Functions automatically.

The OpenWeather API key is the server-only variable `OPENWEATHER_KEY`: set it in `.env.local` (git-ignored) locally and in the Vercel project settings for deploys. The `weather-api` plugin copies it from the `.env` files into `process.env` for the dev and preview servers. Never give it a `VITE_` prefix, because Vite inlines those variables into the client bundle.
