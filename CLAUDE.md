# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start      # Dev server at http://localhost:3000 with hot reload
pnpm build      # Production build to build/
pnpm test       # Jest in interactive watch mode (tests in src/App.test.jsx, fetch is mocked)
```

Set `CI=true` to run `pnpm test` once without watch mode. With `CI=true`, `pnpm build` also fails on lint warnings. There is no separate lint script: ESLint (`react-app` config in `package.json`) runs inside `react-scripts` during `start` and `build`.

**Package manager: pnpm only.** The project pins `pnpm@11.2.2` via `packageManager` in `package.json`. Enable with `corepack enable` if needed. `pnpm-workspace.yaml` blocks the `core-js` and `core-js-pure` install scripts through `allowBuilds`; they only print a funding message.

## Stack

Create React App (`react-scripts` 5) with React 19, plain JavaScript (`.jsx`) and plain CSS. No TypeScript, no router, no state library. `react-scripts` is deprecated; keep it unless a migration is explicitly requested.

## Code style

- Use modern JavaScript: `const`/`let` (never `var`), arrow functions, template literals, optional chaining and nullish coalescing.
- Use modern React: function components and hooks only, no class components or deprecated APIs.
- Prefer the smallest implementation that solves the problem. Avoid unnecessary abstraction, state or dependencies.

## Architecture

Single-screen app that shows the current weather for a searched city. All user-facing text is in Spanish (Spain), hardcoded in the components; there is no i18n library.

- `src/App.jsx` holds all state (`data`, `location`). `data` starts as `null` and `WeatherInfo` only renders after a successful search. `searchLocation` runs on form submit (Enter): it calls `/api/weather?q=<city>` with native `fetch` and stores the response in `data`. Failed searches show a `sonner` toast (404 means the city was not found).
- `api/weather.js` is a Vercel Function (CommonJS, `(req, res)` handler) that proxies the OpenWeather Current Weather API (`/data/2.5/weather`, metric units, `lang: 'es'`), so the API key never reaches the browser. It forwards OpenWeather's status and JSON, returns 400 for an empty `q` and 502 if OpenWeather is unreachable, and lets the CDN cache successful answers for 10 minutes. In development, `src/setupProxy.js` mounts the same handler on the CRA dev server, so `pnpm start` works without the Vercel CLI.
- `lang: 'es'` translates `weather[0].description` (shown in the UI) but never `weather[0].main`, which stays in English. `getWeatherClass` maps `data.weather[0].main` to a CSS class (`rain`, `clouds`, `clear`, `snow`, `fog`, `haze`, `thunderstorm`, or `default`) that is added to `<main className="app ...">`.
- `src/components/` contains presentational components only: `SearchBar` (controlled search input inside a `<form role="search">`) and `WeatherInfo` (renders fields from the raw API response). Both are re-exported from `src/components/index.jsx`.
- `src/index.css` holds all styles. Each weather class sets the background image on `.app:before` from `src/assets/images/<class>.jpg`. To support a new weather condition, add a case to `getWeatherClass`, a `.app.<class>:before` rule that sets `background-image`, and the matching image (at most 1920px wide). Dark images need light text, like the `.app.thunderstorm` rules.

## Deployment

Vercel deploys every push to `main` to https://weather-radar-map.vercel.app. Vercel builds the CRA app and turns `api/` into Functions automatically; there is no `vercel.json`.

The OpenWeather API key is the server-only variable `OPENWEATHER_KEY`: set it in `.env.local` (git-ignored) locally and in the Vercel project settings for deploys. Never give it a `REACT_APP_` prefix, because CRA inlines those variables into the client bundle.
