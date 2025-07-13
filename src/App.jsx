import { useState } from 'react';
import axios from 'axios';
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
          return 'fog';
        case 'haze':
          return 'haze';
        case 'thunderstorm':
          return 'thunderstorm';
        default:
          return 'default';
      }
    }
    return 'default';
  };

  // Search Location Function
  async function searchLocation(event) {
    if (event.key === 'Enter') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=ed0594a86f0907b3764b18cc87a0d5ec`;
      try {
        const { data } = await axios.get(url);
        setData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
      setLocation('');
    }
  };

  // Return App Component
  return (
    <main className={`app ${getWeatherClass(data.weather)}`}>
      <SearchBar location={location} setLocation={setLocation} searchLocation={searchLocation} />
      <WeatherInfo data={data} />
    </main>
  );
}