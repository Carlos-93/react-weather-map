# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Vite dev server at http://localhost:3000 with hot reload (opens the browser)
pnpm build      # Production build to dist/
pnpm preview    # Serves dist/ locally, including /api/weather
pnpm test       # Vitest in watch mode (src/App.test.jsx mocks fetch; src/utils/format.test.js)
pnpm test run   # Vitest once, without watch mode
pnpm lint       # Oxlint (.oxlintrc.json)
```

`pnpm build` does not lint; run `pnpm lint` separately.

**Package manager: pnpm only.** The project pins `pnpm@11.2.2` via `packageManager` in `package.json`. Enable with `corepack enable` if needed.

## Stack

Vite 8 with `@vitejs/plugin-react`, React 19, plain JavaScript (`.jsx` for any file with JSX) and plain CSS. UI icons come from `lucide-react`; the big weather icon is an animated Meteocons SVG from `@meteocons/svg` (fill style), imported with Vite's `?raw` suffix. No TypeScript, no router, no state library. `package.json` sets `"type": "module"`, so every `.js` file is ESM. Tests use Vitest with jsdom and Testing Library; `src/setupTests.js` loads the `jest-dom` matchers and cleans up after each test. Requires Node.js 22.22 or 24.15 or later (the jsdom and Vitest minimums).

## Code style

- Use modern JavaScript: `const`/`let` (never `var`), arrow functions, template literals, optional chaining and nullish coalescing.
- Use modern React: function components and hooks only, no class components or deprecated APIs.
- Prefer the smallest implementation that solves the problem. Avoid unnecessary abstraction, state or dependencies.

## Architecture

Single-screen app that shows the current weather for a searched city. All user-facing text is in Spanish (Spain), hardcoded in the components; there is no i18n library.

- `index.html` (project root) loads `src/main.jsx`, which renders `App`. Static files served as-is (favicon, manifest, `llms.txt`, `robots.txt`) live in `public/`. The app icons `logo192.png` (also the apple-touch-icon and the README header) and `logo512.png` are the Meteocons `partly-cloudy-day` icon on the app's dark `#0d1524` background, the same colour as `theme-color` and the manifest's `theme_color` and `background_color`.
- `src/App.jsx` holds all state (`data`, `query`, and `isPending` and `isLocating` from two `useTransition`s, so the location button can show its own "Buscando tu ubicación…" state; everything is disabled while either runs). Before the first search it shows `Welcome`; after it, `CurrentWeather` and `WeatherDetails`, keyed by city and time so their entrance animations replay. `searchWeather(city)` runs from the search form and from the suggested-city buttons; `searchMyLocation()` runs from the "Usar mi ubicación" button, asks the Geolocation API for the position (the permission prompt only ever follows that click) and rounds it to two decimals. Both call `fetchWeather(place)`, which requests `/api/weather?city=<city>` or `?lat=<lat>&lon=<lon>` with native `fetch` and stores the raw response in `data`, cross-fading the page with `document.startViewTransition` + `flushSync` where the View Transitions API exists. Failed searches show a `sonner` toast (404 means the city was not found). It also updates `document.title` and, when focus was lost (a clicked suggestion disappears), focuses the city `<h1>`.
- `api/weather.js` is a Vercel Function that exports a Web-standard `GET(request)` handler returning a `Response`. It proxies the OpenWeather Current Weather API (`/data/2.5/weather`, metric units, `lang: 'es'`), so the API key never reaches the browser. It forwards OpenWeather's status and JSON, returns 400 when neither `city` (sent to OpenWeather as its `q` parameter) nor `lat` and `lon` are given, and 502 if OpenWeather is unreachable, and lets the CDN cache successful answers for 10 minutes.
- The `weather-api` plugin in `plugins/weather-api.js` (registered in `vite.config.js`) mounts that same `GET` handler on `/api/weather` in the dev and preview servers, so `pnpm dev` and `pnpm preview` work without the Vercel CLI. Its `configureServer`/`configurePreviewServer` hooks must not return a value, because Vite calls a returned function as a post-middleware hook. Keep it outside `api/`: Vercel turns every file there into a public Function. Restart `pnpm dev` after changing `api/weather.js`, `plugins/` or `vite.config.js`.
- `lang: 'es'` translates `weather[].description` (shown in the UI) but never `weather[].main`, which stays in English. For the cloud codes 801-804, `CLOUD_DESCRIPTIONS` replaces OpenWeather's Spanish label with the AEMET term (its "muy nuboso" covers 51-84 % cover), and `CLOUDS_SCALE` uses the same bands so the cloud card agrees. The `WEATHER_CONDITIONS` object maps `data.weather[0].main` (capitalized, e.g. `Rain`) to a condition (`rain`, `clouds`, `clear`, `snow`, `fog`, `haze`, `thunderstorm`, or `default`) that `App` puts in `data-weather` on the root `.app` element. `data-period` is `night` when the icon code ends in `n`.
- `src/constants.js` holds every static table: `WEATHER_CONDITIONS`, `WEATHER_ICONS` (OpenWeather icon code to Meteocons SVG markup; `WeatherIcon` inlines it rather than using `<img>` because its SMIL animations ignore CSS, so under `prefers-reduced-motion` it calls `pauseAnimations()`), `SUGGESTED_CITIES` (queries include the country code to avoid homonyms), `COMPASS_POINTS`, `CLOUD_DESCRIPTIONS` and the `*_SCALE` arrays of `[upper limit, label]` pairs used by `describe()`.
- `src/utils/format.js` formats values with `Intl` in `es-ES`. OpenWeather gives UTC timestamps plus the city's `timezone` offset in seconds, so city times are shifted by that offset and then formatted in UTC. `src/hooks/useNow.js` re-renders every minute for the local clock, the sun position and "measured X minutes ago".
- The UI shows every user-facing field of the response except three that mislead: `main.temp_min`/`main.temp_max` are the spread across the area's stations right now, not the day's range, and `main.grnd_level` uses a coarse model terrain height (979 hPa for a town at 68 m). `main.sea_level` is not shown either because it repeats `main.pressure`. OpenWeather's internal fields (`base`, `cod`, `sys.type`, `sys.id`) are not displayed; the city `id` builds the "Ver en OpenWeather" link.
- `src/components/` holds presentational components, one folder each: `src/components/<Name>/<Name>.jsx` plus its styles in `<Name>.css`, which the component imports. Import components by their full path (`./components/Header/Header`); there is no barrel `index` file. `Header` (brand + `SearchBar`, which also focuses on the `/` key), `Welcome` (empty state with the location button and suggestions), `CurrentWeather` (city, country, local time, icon, temperature and feels like), `WeatherDetails` (the card grid: `WindCard` with an SVG compass, `SunCard` with the sun's arc, `MetricCard` for single values with an optional level bar, `LocationCard`), `Card` (glass panel with the pointer spotlight; `index` staggers its entrance), `WeatherIcon`, `ExternalLink`, `Backdrop` (photo, shade and weather particles; the sun glow shows by day only for clouds short of overcast, codes 801-803, because the clear photo already has its own sun; the shade is kept light so the photo's colours show, with more for the white snow, fog and haze photos and at night) and `Footer`.
- Styles use cascade layers (`reset, base, layout, components, effects, utilities`). There are no design tokens: colours, sizes, shadows, radii and easings are written directly in each rule. The only custom properties are the ones that change at runtime: `--accent` (swapped per condition on `.app[data-weather]`), the values React sets inline (`--index`, `--level`, `--rotation`, `--progress`, `--pointer-x`/`--pointer-y` and the particle ones), the registered `--spotlight` that the card hover animates, and a few local ones inside `Backdrop.css`. `src/index.css` holds only the global part: the layer order, the default `--accent` and its per-condition values, the reset, the page layout, shared helpers (`.skip-link`, `.spinner`, `.visually-hidden`, `kbd`) and the keyframes several components use (`rise`, `fade`, `spin`). `main.jsx` imports it before `App` so the layer order is declared before any component stylesheet; otherwise the first component file would fix a different order. Each component stylesheet wraps its rules in `@layer components` (`Backdrop.css` in `@layer effects`) and keeps its own keyframes and its own unlayered `prefers-reduced-motion` block. `Card.css` also holds the pieces every card reuses (`.card__hint`, `.metric`, `.facts`). Entrance animations use `animation-fill-mode: backwards` so hover transforms still apply afterwards. Never animate `opacity` on a parent of an element with `backdrop-filter`: it switches the blur off while it runs. The `prefers-reduced-motion` block at the end turns entrances into fades and stops the ambient effects.
- To support a new weather condition, add an entry to `WEATHER_CONDITIONS`, a `.app[data-weather='<condition>'] .backdrop__image` rule in `Backdrop.css` with its image from `src/assets/images/` (at most 1920px wide), an `--accent` for it in `index.css` and, if it needs one, an effect in `Backdrop`.

## Deployment

Vercel deploys every push to `main` to https://weather-radar-map.vercel.app. The Vite framework preset (build with `vite build`, output `dist/`) is set in the Vercel project settings; there is no `vercel.json`. Vercel turns `api/` into Functions automatically.

The OpenWeather API key is the server-only variable `OPENWEATHER_KEY`: set it in `.env.local` (git-ignored) locally and in the Vercel project settings for deploys. The `weather-api` plugin copies it from the `.env` files into `process.env` for the dev and preview servers. Never give it a `VITE_` prefix, because Vite inlines those variables into the client bundle.
