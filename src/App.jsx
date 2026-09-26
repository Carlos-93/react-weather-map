import { SearchBar, WeatherInfo } from './components';
import { Toaster, toast } from 'sonner';
import { useState } from 'react';

// Get Weather Class Function
function getWeatherClass(weather) {
  switch (weather?.[0]?.main?.toLowerCase()) {
    case 'rain':
    case 'drizzle':
      return 'rain';
    case 'clouds':
      return 'clouds';
    case 'clear':
      return 'clear';
    case 'snow':
      return 'snow';
    case 'fog':
    case 'mist':
      return 'fog';
    case 'haze':
    case 'smoke':
    case 'dust':
    case 'sand':
    case 'ash':
      return 'haze';
    case 'thunderstorm':
    case 'squall':
    case 'tornado':
      return 'thunderstorm';
    default:
      return 'default';
  }
}

// App Component
export default function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');

  // Search Location Function
  async function searchLocation(event) {
    event.preventDefault();
    const query = location.trim();
    if (!query) return;

    try {
      const response = await fetch(`/api/weather?${new URLSearchParams({ q: query })}`);
      if (response.status === 404) {
        toast.error(`No se ha encontrado la ciudad "${query}"`);
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setData(await response.json());
      setLocation('');
    } catch {
      toast.error('No se ha podido cargar el tiempo, inténtalo más tarde');
    }
  }

  // Return App Component
  return (
    <main className={`app ${getWeatherClass(data?.weather)}`}>
      <SearchBar location={location} setLocation={setLocation} searchLocation={searchLocation} />
      {data && <WeatherInfo data={data} />}
      <Toaster richColors position="top-right" />
    </main>
  );
}