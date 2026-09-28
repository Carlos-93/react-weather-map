import clearDay from '@meteocons/svg/fill/clear-day.svg?raw';
import clearNight from '@meteocons/svg/fill/clear-night.svg?raw';
import cloudy from '@meteocons/svg/fill/cloudy.svg?raw';
import fogDay from '@meteocons/svg/fill/fog-day.svg?raw';
import fogNight from '@meteocons/svg/fill/fog-night.svg?raw';
import overcastDay from '@meteocons/svg/fill/overcast-day.svg?raw';
import overcastNight from '@meteocons/svg/fill/overcast-night.svg?raw';
import partlyCloudyDay from '@meteocons/svg/fill/partly-cloudy-day.svg?raw';
import partlyCloudyDayRain from '@meteocons/svg/fill/partly-cloudy-day-rain.svg?raw';
import partlyCloudyNight from '@meteocons/svg/fill/partly-cloudy-night.svg?raw';
import partlyCloudyNightRain from '@meteocons/svg/fill/partly-cloudy-night-rain.svg?raw';
import rain from '@meteocons/svg/fill/rain.svg?raw';
import snow from '@meteocons/svg/fill/snow.svg?raw';
import thunderstormsDayRain from '@meteocons/svg/fill/thunderstorms-day-rain.svg?raw';
import thunderstormsNightRain from '@meteocons/svg/fill/thunderstorms-night-rain.svg?raw';
import cataloniaFlag from './assets/images/flags/catalonia.webp';
import franceFlag from './assets/images/flags/france.webp';
import germanyFlag from './assets/images/flags/germany.webp';
import italyFlag from './assets/images/flags/italy.webp';
import spainFlag from './assets/images/flags/spain.webp';
import unitedKingdomFlag from './assets/images/flags/united-kingdom.webp';

// Interface languages, in the portfolio's order; `locale` drives Intl dates, numbers and country names
export const LANGUAGES = [
  { code: 'es', name: 'Español', locale: 'es-ES', flag: spainFlag },
  { code: 'ca', name: 'Català', locale: 'ca-ES', flag: cataloniaFlag },
  { code: 'en', name: 'English', locale: 'en-GB', flag: unitedKingdomFlag },
  { code: 'de', name: 'Deutsch', locale: 'de-DE', flag: germanyFlag },
  { code: 'it', name: 'Italiano', locale: 'it-IT', flag: italyFlag },
  { code: 'fr', name: 'Français', locale: 'fr-FR', flag: franceFlag },
];

// Object mapping weather conditions to corresponding CSS classes for styling
export const WEATHER_CONDITIONS = {
  Rain: 'rain', Drizzle: 'rain',
  Clouds: 'clouds',
  Clear: 'clear',
  Snow: 'snow',
  Fog: 'fog', Mist: 'fog',
  Haze: 'haze', Smoke: 'haze', Dust: 'haze', Sand: 'haze', Ash: 'haze',
  Thunderstorm: 'thunderstorm', Squall: 'thunderstorm', Tornado: 'thunderstorm',
};

// Animated Meteocons SVG markup for each OpenWeather icon code (d = day, n = night)
export const WEATHER_ICONS = {
  '01d': clearDay,
  '01n': clearNight,
  '02d': partlyCloudyDay,
  '02n': partlyCloudyNight,
  '03d': cloudy,
  '03n': cloudy,
  '04d': overcastDay,
  '04n': overcastNight,
  '09d': rain,
  '09n': rain,
  '10d': partlyCloudyDayRain,
  '10n': partlyCloudyNightRain,
  '11d': thunderstormsDayRain,
  '11n': thunderstormsNightRain,
  '13d': snow,
  '13n': snow,
  '50d': fogDay,
  '50n': fogNight,
};

// Example searches shown before the first one: `id` is the GeoNames id Open-Meteo knows each city by, and `key` names the label in the translations
export const SUGGESTED_CITIES = [
  { key: 'madrid', id: 3117735 },
  { key: 'barcelona', id: 3128760 },
  { key: 'london', id: 2643743 },
  { key: 'newYork', id: 5128581 },
  { key: 'tokyo', id: 1850147 },
  { key: 'buenosAires', id: 3435910 },
];

// Qualitative scales as [upper limit, key] pairs, checked in order; each key is translated under scales.<name>
export const WIND_SCALE = [
  [1, 'calm'],
  [6, 'lightAir'],
  [12, 'lightBreeze'],
  [20, 'gentleBreeze'],
  [29, 'moderateBreeze'],
  [39, 'freshBreeze'],
  [50, 'strongBreeze'],
  [62, 'nearGale'],
  [75, 'gale'],
  [89, 'strongGale'],
  [103, 'storm'],
  [118, 'violentStorm'],
  [Infinity, 'hurricane'],
];

export const HUMIDITY_SCALE = [
  [30, 'dry'],
  [60, 'comfortable'],
  [80, 'humid'],
  [Infinity, 'veryHumid'],
];

export const PRESSURE_SCALE = [
  [1009, 'low'],
  [1023, 'normal'],
  [Infinity, 'high'],
];

export const VISIBILITY_SCALE = [
  [1, 'veryPoor'],
  [2, 'poor'],
  [5, 'moderate'],
  [10, 'good'],
  [Infinity, 'excellent'],
];

// Same bands as OpenWeather's cloud codes 801-804, so the card agrees with CLOUD_DESCRIPTIONS
export const CLOUDS_SCALE = [
  [11, 'clear'],
  [25, 'few'],
  [51, 'partly'],
  [85, 'mostly'],
  [Infinity, 'overcast'],
];

// Cloud codes shown with the scales.clouds terms (AEMET's in Spanish), whose bands fit better than OpenWeather's labels ("muy nuboso" for 51-84 %)
export const CLOUD_DESCRIPTIONS = {
  801: 'few',
  802: 'partly',
  803: 'mostly',
  804: 'overcast',
};