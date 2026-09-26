import axios from 'axios';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { SearchBar, WeatherInfo } from './components';

// App Component
export default function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  // Get Weather Class Function
  function getWeatherClass(weather) {
    if (weather && weather[0] && weather[0].main) {
      switch (weather[0].main.toLowerCase()) {
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
    return 'default';
  };

  // Search Location Function
  async function searchLocation(event) {
    if (event.key === 'Enter' && location.trim()) {
      try {
        const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: { q: location, units: 'metric', lang: 'es', appid: process.env.REACT_APP_OPENWEATHER_KEY },
        });
        setData(data);
        setLocation('');
      } catch (error) {
        toast.error(error.response?.status === 404 ? `No se ha encontrado la ciudad "${location}"` : 'No se ha podido cargar el tiempo, inténtalo más tarde');
      }
    }
  };

  // Return App Component
  return (
    <main className={`app ${getWeatherClass(data.weather)}`}>
      <SearchBar location={location} setLocation={setLocation} searchLocation={searchLocation} />
      <WeatherInfo data={data} />
      <Toaster richColors position="top-right" />
    </main>
  );
}