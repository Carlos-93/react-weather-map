# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start      # Dev server at http://localhost:3000 with hot reload
pnpm build      # Production build to build/
pnpm test       # Jest in interactive watch mode (no test files exist yet)
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

Single-screen app that shows the current weather for a searched city.

- `src/App.jsx` holds all state (`data`, `location`). `searchLocation` runs on Enter: it calls the OpenWeather Current Weather API (`/data/2.5/weather`, metric units) with `axios` and stores the response in `data`. Failed searches show a `sonner` toast (404 means the city was not found).
- `getWeatherClass` maps `data.weather[0].main` to a CSS class (`rain`, `clouds`, `clear`, `snow`, `fog`, `haze`, `thunderstorm`, or `default`) that is added to `<main className="app ...">`.
- `src/components/` contains presentational components only: `SearchBar` (controlled input) and `WeatherInfo` (renders fields from the raw API response). Both are re-exported from `src/components/index.jsx`.
- `src/index.css` holds all styles. Each weather class sets the background image on `.app:before` from `src/assets/images/<class>.jpg`. To support a new weather condition, add a case to `getWeatherClass`, a `.app.<class>:before` rule and the matching image.

## Known issues

- The OpenWeather API key comes from `REACT_APP_OPENWEATHER_KEY`: set it in `.env.local` (git-ignored) locally and in the Vercel project settings for deploys. CRA inlines it at build time, so it still ships in the client bundle; real protection needs a server-side proxy.
- `gh-pages` is a dev dependency, but there is no `deploy` script or `homepage` field configured.
