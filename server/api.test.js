import { afterEach, expect, test, vi } from 'vitest';

import { GET as cities } from '../api/cities.js';
import { GET as weather } from '../api/weather.js';

// Answers each OpenWeather and Open-Meteo endpoint by its path; `null` makes that endpoint fail
function mockServices(answers) {
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    const answer = answers[new URL(url).pathname];
    return answer === null ? { ok: false, status: 500, json: async () => ({}) } : { ok: true, status: 200, json: async () => answer };
  }));
}

const call = (handler, query) => handler(new Request(`http://localhost/api?${query}`));
const requested = (path) => global.fetch.mock.calls.map(([url]) => new URL(url)).find((url) => url.pathname === path);
// Shaped like an Open-Meteo geocoding result
const place = (id, name, latitude, longitude, extra = {}) => ({ id, name, latitude, longitude, country_code: 'US', ...extra });

afterEach(() => {
  vi.unstubAllGlobals();
});

test('geocodes a typed city and names it in the chosen language', async () => {
  mockServices({
    '/v1/search': { results: [place(5128581, 'Nueva York', 40.71427, -74.00597)] },
    '/data/2.5/weather': { name: 'Manhattan' },
  });
  const response = await call(weather, 'city=Nueva York&lang=es');

  expect(response.status).toBe(200);
  expect((await response.json()).name).toBe('Nueva York');
  expect(requested('/v1/search').searchParams.get('language')).toBe('es');
  expect(requested('/data/2.5/weather').searchParams.get('lat')).toBe('40.71427');
  expect(response.headers.get('Cache-Control')).toBe('s-maxage=600');
});

test('answers 404 when no place matches the typed city', async () => {
  // Open-Meteo leaves `results` out when nothing matches
  mockServices({ '/v1/search': {} });
  const response = await call(weather, 'city=Atlantis&lang=es');

  expect(response.status).toBe(404);
  expect(requested('/data/2.5/weather')).toBeUndefined();
});

test('shows a chosen place by its id, named in the chosen language', async () => {
  mockServices({
    '/v1/get': place(3128760, 'Barcellona', 41.38879, 2.15899, { country_code: 'ES' }),
    '/data/2.5/weather': { name: 'Barcelona' },
  });
  const response = await call(weather, 'id=3128760&lang=it');

  expect((await response.json()).name).toBe('Barcellona');
  expect(requested('/v1/get').searchParams.get('id')).toBe('3128760');
  expect(requested('/data/2.5/weather').searchParams.get('lon')).toBe('2.15899');
});

test('names a position with reverse geocoding', async () => {
  mockServices({
    '/geo/1.0/reverse': [{ name: 'Barcelona', lat: 41.39, lon: 2.17, local_names: { ca: 'Barcelona' } }],
    '/data/2.5/weather': { name: 'Barcelona' },
  });
  const response = await call(weather, 'lat=41.39&lon=2.17&lang=ca');

  expect((await response.json()).name).toBe('Barcelona');
  expect(requested('/data/2.5/weather').searchParams.get('lang')).toBe('ca');
});

test('rejects requests without a place and unknown languages', async () => {
  mockServices({ '/v1/search': { results: [place(3117735, 'Madrid', 40.4, -3.7)] }, '/data/2.5/weather': { name: 'Madrid' } });

  expect((await call(weather, 'lang=es')).status).toBe(400);
  await call(weather, 'city=Madrid&lang=xx');
  expect(requested('/data/2.5/weather').searchParams.get('lang')).toBe('es');
});

test('answers 502 when a service fails', async () => {
  mockServices({ '/v1/search': null });

  expect((await call(weather, 'city=Madrid&lang=es')).status).toBe(502);
  expect((await call(cities, 'q=Madrid&lang=es')).status).toBe(502);
});

test('suggests up to five places for the start of a name, in the chosen language, without repeats', async () => {
  mockServices({
    '/v1/search': {
      results: [
        place(3128760, 'Barcelona', 41.38879, 2.15899, { admin1: 'Cataluña', country_code: 'ES' }),
        place(3648559, 'Barcelona', 10.13625, -64.68618, { admin1: 'Anzoátegui', country_code: 'VE' }),
        place(3648560, 'Barcelona', 10.1, -64.7, { admin1: 'Anzoátegui', country_code: 'VE' }),
        ...[1, 2, 3, 4].map((id) => place(id, `Barcel ${id}`, 0, 0)),
      ],
    },
  });
  const response = await call(cities, 'q=Barcel&lang=es');
  const suggestions = await response.json();

  expect(suggestions).toHaveLength(5);
  expect(suggestions.slice(0, 3)).toEqual([
    { id: 3128760, name: 'Barcelona', state: 'Cataluña', country: 'ES' },
    { id: 3648559, name: 'Barcelona', state: 'Anzoátegui', country: 'VE' },
    { id: 1, name: 'Barcel 1', country: 'US' },
  ]);
});

test('skips the search for queries shorter than two characters', async () => {
  mockServices({});

  expect(await (await call(cities, 'q=M&lang=es')).json()).toEqual([]);
  expect(global.fetch).not.toHaveBeenCalled();
});