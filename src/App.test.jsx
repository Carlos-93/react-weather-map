import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';

const madrid = {
  name: 'Madrid',
  main: { temp: 21.4, feels_like: 19.2, humidity: 40 },
  weather: [{ main: 'Thunderstorm', description: 'tormenta' }],
  wind: { speed: 5 },
};

function mockFetch(status, body = {}) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body }));
}

async function search(city) {
  await userEvent.type(screen.getByRole('searchbox', { name: 'Ciudad' }), `${city}{Enter}`);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test('shows the weather of the searched city', async () => {
  mockFetch(200, madrid);
  render(<App />);
  await search('Madrid');

  expect(await screen.findByRole('heading', { name: 'Madrid' })).toBeInTheDocument();
  expect(screen.getByText('21°C')).toBeInTheDocument();
  expect(screen.getByText('19°C')).toBeInTheDocument();
  expect(screen.getByText('tormenta')).toBeInTheDocument();
  expect(screen.getByText('18 km/h')).toBeInTheDocument();
  expect(screen.getByRole('main')).toHaveClass('app thunderstorm');
  expect(screen.getByRole('searchbox')).toHaveValue('');
  expect(global.fetch).toHaveBeenCalledWith('/api/weather?city=Madrid');
});

test('keeps the query and shows a notice when the city does not exist', async () => {
  mockFetch(404);
  render(<App />);
  await search('Atlantis');

  expect(await screen.findByText('No se ha encontrado la ciudad "Atlantis"')).toBeInTheDocument();
  expect(screen.getByRole('searchbox')).toHaveValue('Atlantis');
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