import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';
import i18n from './i18n/config';

// Shaped like a real OpenWeather Current Weather response
const madrid = {
  coord: { lon: -3.7026, lat: 40.4165 },
  weather: [
    { id: 211, main: 'Thunderstorm', description: 'tormenta', icon: '11d' },
    { id: 701, main: 'Mist', description: 'niebla', icon: '50d' },
  ],
  base: 'stations',
  main: { temp: 21.4, feels_like: 19.2, temp_min: 18.1, temp_max: 23.8, pressure: 1013, humidity: 40, sea_level: 1013, grnd_level: 940 },
  visibility: 10000,
  wind: { speed: 5, deg: 315, gust: 7 },
  rain: { '1h': 1.2 },
  clouds: { all: 98 },
  dt: 1790456346,
  sys: { type: 2, id: 2084412, country: 'ES', sunrise: 1790402758, sunset: 1790445985 },
  timezone: 7200,
  id: 3117735,
  name: 'Madrid',
  cod: 200,
};

// /api/cities answers with `cities` (the search suggestions); /api/weather with `status` and `body`
function mockFetch(status, body = {}, cities = []) {
  vi.stubGlobal('fetch', vi.fn(async (url) => (url.startsWith('/api/cities')
    ? { ok: true, status: 200, json: async () => cities }
    : { ok: status < 400, status, json: async () => body })));
}

async function search(city) {
  await userEvent.type(screen.getByRole('combobox', { name: 'Ciudad' }), `${city}{Enter}`);
}

const card = (title) => screen.getByRole('heading', { level: 2, name: title }).closest('section');

const newYorks = [
  { id: 5128581, name: 'Nueva York', state: 'Nueva York', country: 'US' },
  { id: 3995402, name: 'Nueva York', state: 'Sonora', country: 'MX' },
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('shows the current weather of the searched city', async () => {
  mockFetch(200, madrid);
  const { container } = render(<App />);
  await search('Madrid');

  expect(await screen.findByRole('heading', { level: 1, name: 'Madrid' })).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/weather?city=Madrid&lang=es');
  expect(screen.getByText('España')).toBeInTheDocument();
  expect(screen.getByText('21°')).toBeInTheDocument();
  expect(screen.getByText('tormenta, niebla')).toBeInTheDocument();
  expect(container.querySelector('.current__icon svg #thunderstorms-day-rain')).toBeInTheDocument();
  expect(screen.getByText('Sensación').nextSibling).toHaveTextContent('19°');
  expect(container.querySelector('.app')).toHaveAttribute('data-weather', 'thunderstorm');
  expect(document.title).toBe('Madrid, 21° · Tiempo y Radar');
  expect(screen.getByRole('combobox')).toHaveValue('');
});

test('shows every detail card', async () => {
  mockFetch(200, madrid);
  render(<App />);
  await search('Madrid');
  await screen.findByRole('heading', { level: 1, name: 'Madrid' });

  expect(card('Viento')).toHaveTextContent(/18\s*km\/h.*Brisa débil.*Del NO · 315°.*Rachas25 km\/h/);
  expect(card('Sol')).toHaveTextContent(/Amanecer08:05.*Atardecer20:06.*Horas de luz12 h/);
  expect(card('Humedad')).toHaveTextContent(/40\s*%.*Humedad agradable/);
  expect(card('Presión')).toHaveTextContent(/1013\s*hPa.*Presión normal/);
  expect(card('Visibilidad')).toHaveTextContent(/10\s*km.*Excelente/);
  expect(card('Nubosidad')).toHaveTextContent(/98\s*%.*Cubierto/);
  expect(card('Precipitación')).toHaveTextContent(/1,2\s*mm.*Lluvia en la última hora/);
  expect(card('Ubicación')).toHaveTextContent(/40,42° N, 3,70° O.*UTC\+2/);
  expect(within(card('Ubicación')).getByRole('link', { name: /Ver en OpenWeather/ })).toHaveAttribute(
    'href',
    'https://openweathermap.org/city/3117735',
  );
});

test('describes cloud cover with AEMET terms and keeps the sun glow under broken clouds', async () => {
  mockFetch(200, { ...madrid, weather: [{ id: 803, main: 'Clouds', description: 'muy nuboso', icon: '04d' }], clouds: { all: 65 } });
  const { container } = render(<App />);
  await search('Madrid');
  await screen.findByRole('heading', { level: 1, name: 'Madrid' });

  expect(screen.getByText('nuboso')).toBeInTheDocument();
  expect(card('Nubosidad')).toHaveTextContent(/65\s*%.*Nuboso/);
  expect(container.querySelector('.backdrop__glow')).toBeInTheDocument();
});

test('searches a suggested city and moves focus to the result', async () => {
  mockFetch(200, madrid);
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Londres' }));

  const heading = await screen.findByRole('heading', { level: 1, name: 'Madrid' });
  expect(global.fetch).toHaveBeenCalledWith('/api/weather?id=2643743&lang=es');
  expect(heading).toHaveFocus();
});

test('suggests cities while typing and picks one with the keyboard', async () => {
  mockFetch(200, madrid, newYorks);
  render(<App />);
  const input = screen.getByRole('combobox', { name: 'Ciudad' });
  await userEvent.type(input, 'Nueva Y');

  const options = await screen.findAllByRole('option');
  expect(options).toHaveLength(2);
  expect(options[1]).toHaveTextContent('Nueva YorkSonora, México');
  expect(global.fetch).toHaveBeenCalledWith('/api/cities?q=Nueva+Y&lang=es', expect.anything());
  expect(input).toHaveAttribute('aria-expanded', 'true');

  await userEvent.keyboard('{ArrowDown}{ArrowDown}');
  expect(input).toHaveAttribute('aria-activedescendant', options[1].id);
  await userEvent.keyboard('{Enter}');

  await screen.findByRole('heading', { level: 1, name: 'Madrid' });
  expect(global.fetch).toHaveBeenCalledWith('/api/weather?id=3995402&lang=es');
});

test('picks a suggestion with a click and closes the list with Escape', async () => {
  mockFetch(200, madrid, newYorks);
  render(<App />);
  const input = screen.getByRole('combobox', { name: 'Ciudad' });
  await userEvent.type(input, 'Nueva');
  await screen.findAllByRole('option');

  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(input).toHaveValue('Nueva');

  await userEvent.keyboard('{ArrowDown}');
  await userEvent.click(screen.getAllByRole('option')[0]);
  await screen.findByRole('heading', { level: 1, name: 'Madrid' });
  expect(global.fetch).toHaveBeenCalledWith('/api/weather?id=5128581&lang=es');
});

test('translates the interface and reloads the weather in the chosen language', async () => {
  mockFetch(200, madrid);
  render(<App />);
  await search('Madrid');
  await screen.findByRole('heading', { level: 1, name: 'Madrid' });

  await userEvent.click(screen.getByRole('button', { name: 'Seleccionar idioma: Español' }));
  await userEvent.click(screen.getByRole('button', { name: 'English' }));

  expect(await screen.findByRole('heading', { level: 2, name: 'Wind' })).toBeInTheDocument();
  expect(card('Wind')).toHaveTextContent(/Gentle breeze.*From NW · 315°/);
  expect(card('Location')).toHaveTextContent(/40\.42° N, 3\.70° W/);
  expect(global.fetch).toHaveBeenLastCalledWith('/api/weather?city=Madrid&lang=en');
  expect(document.documentElement).toHaveAttribute('lang', 'en');
  expect(localStorage.getItem('language')).toBe('en');
  expect(screen.getByRole('button', { name: 'Select language: English' })).toHaveFocus();
});

test('starts in the browser language when none was picked before', async () => {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-DE', 'de']);
  // A first visit: nothing saved, so changeLanguage without a language runs the detection again
  localStorage.clear();
  await i18n.changeLanguage();
  render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: 'Das Wetter jeder Stadt, sofort' })).toBeInTheDocument();
  expect(document.documentElement).toHaveAttribute('lang', 'de');
});

// jsdom has no Geolocation API: answer getCurrentPosition with a position or an error, or never (null)
function mockGeolocation(answer) {
  vi.stubGlobal('GeolocationPositionError', { PERMISSION_DENIED: 1 });
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition: (resolve, reject) => answer && ('coords' in answer ? resolve(answer) : reject(answer)) },
  });
}

test('tells the user while it looks up the location', async () => {
  mockGeolocation(null);
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Usar mi ubicación' }));

  expect(screen.getByRole('button', { name: 'Buscando tu ubicación…' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Madrid' })).toBeDisabled();
  expect(screen.getByText('Buscando tu ubicación…', { selector: '[role="status"]' })).toBeInTheDocument();
});

test('shows the weather at the user location, rounded to two decimals', async () => {
  mockFetch(200, madrid);
  mockGeolocation({ coords: { latitude: 41.54012, longitude: 2.21349 } });
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Usar mi ubicación' }));

  expect(await screen.findByRole('heading', { level: 1, name: 'Madrid' })).toHaveFocus();
  expect(global.fetch).toHaveBeenCalledWith('/api/weather?lat=41.54&lon=2.21&lang=es');
});

test('shows a notice when the location permission is denied', async () => {
  mockFetch(200, madrid);
  mockGeolocation({ code: 1 });
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Usar mi ubicación' }));

  expect(await screen.findByText('Permite el acceso a tu ubicación para ver su tiempo')).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('focuses the search with the "/" shortcut', async () => {
  render(<App />);
  await userEvent.keyboard('/');

  expect(screen.getByRole('combobox')).toHaveFocus();
});

test('keeps the query and shows a notice when the city does not exist', async () => {
  mockFetch(404);
  render(<App />);
  await search('Atlantis');

  expect(await screen.findByText('No se ha encontrado la ciudad "Atlantis"')).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toHaveValue('Atlantis');
});

test('shows a notice when the request fails', async () => {
  mockFetch(500);
  render(<App />);
  await search('Madrid');

  expect(await screen.findByText('No se ha podido cargar el tiempo, inténtalo más tarde')).toBeInTheDocument();
});

test('does not search an empty query', async () => {
  mockFetch(200, madrid);
  render(<App />);
  await search('   ');

  expect(global.fetch).not.toHaveBeenCalled();
});