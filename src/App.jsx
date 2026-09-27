import { useEffect, useRef, useState, useTransition } from 'react';
import { flushSync } from 'react-dom';
import { Toaster, toast } from 'sonner';

import Backdrop from './components/Backdrop/Backdrop';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import WeatherDetails from './components/WeatherDetails/WeatherDetails';
import Welcome from './components/Welcome/Welcome';
import { WEATHER_CONDITIONS } from './constants';
import { formatTemperature } from './utils/format';

// Cross-fades the whole page to the new state where the View Transitions API exists
function showWithTransition(update) {
  if (!document.startViewTransition) return update();
  document.startViewTransition(() => flushSync(update));
}

// Wraps the callback-based Geolocation API; a cached position up to 10 minutes old is fine for the weather
const getPosition = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10_000, maximumAge: 600_000 });
});

export default function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  // A separate transition tells the location button apart from a city search
  const [isLocating, startLocating] = useTransition();
  const isBusy = isPending || isLocating;
  const headingRef = useRef(null);

  const condition = WEATHER_CONDITIONS[data?.weather[0].main] ?? 'default';
  const period = data?.weather[0].icon.endsWith('n') ? 'night' : 'day';

  useEffect(() => {
    document.title = data ? `${data.name}, ${formatTemperature(data.main.temp)} · Tiempo y Radar` : 'Tiempo y Radar';
    // A clicked suggestion disappears with the welcome screen, so focus moves to the results
    if (data && document.activeElement === document.body) headingRef.current?.focus();
  }, [data]);

  // Method to fetch weather data for { city } or { lat, lon } and update the state accordingly
  async function fetchWeather(place) {
    try {
      const response = await fetch(`/api/weather?${new URLSearchParams(place)}`);
      if (response.status === 404) {
        toast.error(`No se ha encontrado la ciudad "${place.city}"`);
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      showWithTransition(() => {
        setData(result);
        setQuery('');
      });
    } catch {
      toast.error('No se ha podido cargar el tiempo, inténtalo más tarde');
    }
  }

  function searchWeather(city) {
    startTransition(() => fetchWeather({ city }));
  }

  // The browser only asks for the location permission here, after a click, never on load
  function searchMyLocation() {
    startLocating(async () => {
      try {
        const { coords } = await getPosition();
        // Two decimals (about 1 km) are enough for the weather and share less of the user's position
        await fetchWeather({ lat: coords.latitude.toFixed(2), lon: coords.longitude.toFixed(2) });
      } catch (error) {
        toast.error(error.code === GeolocationPositionError.PERMISSION_DENIED
          ? 'Permite el acceso a tu ubicación para ver su tiempo'
          : 'No se ha podido obtener tu ubicación');
      }
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const city = query.trim();
    if (city && !isBusy) searchWeather(city);
  }

  return (
    <div className="app" data-weather={condition} data-period={period}>
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <Backdrop weather={condition} code={data?.weather[0].id} period={period} />
      <Header query={query} onQueryChange={setQuery} onSubmit={handleSubmit} isPending={isPending} />
      <main id="main" className="main" aria-busy={isBusy}>
        {data ? (
          <div className="weather" key={`${data.id}-${data.dt}`}>
            <CurrentWeather data={data} ref={headingRef} />
            <WeatherDetails data={data} />
          </div>
        ) : (
          <Welcome onSelect={searchWeather} onLocate={searchMyLocation} isPending={isBusy} isLocating={isLocating} />
        )}
      </main>
      <Footer />
      <Toaster theme="dark" richColors position="top-center" offset={{ top: '6rem' }} mobileOffset={{ top: '6rem' }} />
    </div>
  );
}