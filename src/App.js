import React, { useState } from 'react';
import axios from 'axios';
import { SearchBar, WeatherInfo } from './components';

// App Component
export default function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  // Get Weather Class Function
  function getWeatherClass(weather) {
    if (weather) {
      const main = weather[0].main.toLowerCase();
      if (main.includes('rain')) {
        return 'rain';
      } else if (main.includes('clouds')) {
        return 'clouds';
      } else if (main.includes('clear')) {
        return 'clear';
      } else if (main.includes('snow')) {
        return 'snow';
      } else if (main.includes('fog')) {
        return 'fog';
      } else if (main.includes('haze')) {
        return 'haze';
      } else if (main.includes('thunderstorm')) {
        return 'thunderstorm';
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
    <div className={`app ${getWeatherClass(data.weather)}`}>
      <SearchBar location={location} setLocation={setLocation} searchLocation={searchLocation} />
      <WeatherInfo data={data} />
    </div>
  );
}