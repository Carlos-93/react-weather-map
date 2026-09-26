import { useState } from 'react';
import { Toaster, toast } from 'sonner';

import SearchBar from './components/SearchBar';
import WeatherInfo from './components/WeatherInfo';
import { WEATHER_CONDITIONS } from './constants';

export default function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');

  // Method to handle the search form submission, fetch weather data from the API, and update the state accordingly
  async function searchWeather(event) {
    event.preventDefault();
    const city = query.trim();
    if (!city) return;

    try {
      const response = await fetch(`/api/weather?${new URLSearchParams({ city })}`);
      if (response.status === 404) {
        toast.error(`No se ha encontrado la ciudad "${city}"`);
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setData(await response.json());
      setQuery('');
    } catch {
      toast.error('No se ha podido cargar el tiempo, inténtalo más tarde');
    }
  }

  return (
    <main className={`app ${WEATHER_CONDITIONS[data?.weather[0].main] ?? 'default'}`}>
      <SearchBar value={query} onChange={setQuery} onSubmit={searchWeather} />
      {data && <WeatherInfo data={data} />}
      <Toaster richColors position="top-right" />
    </main>
  );
}