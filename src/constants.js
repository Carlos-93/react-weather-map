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

// Example searches shown before the first one; the country code avoids homonyms
export const SUGGESTED_CITIES = [
  { label: 'Madrid', query: 'Madrid,ES' },
  { label: 'Barcelona', query: 'Barcelona,ES' },
  { label: 'Londres', query: 'London,GB' },
  { label: 'Nueva York', query: 'New York,US' },
  { label: 'Tokio', query: 'Tokyo,JP' },
  { label: 'Buenos Aires', query: 'Buenos Aires,AR' },
];

// 16-point compass rose in Spanish (O = oeste)
export const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO',
];

// Qualitative scales as [upper limit, label] pairs, checked in order
export const WIND_SCALE = [
  [1, 'Calma'],
  [6, 'Ventolina'],
  [12, 'Brisa muy débil'],
  [20, 'Brisa débil'],
  [29, 'Brisa moderada'],
  [39, 'Brisa fresca'],
  [50, 'Brisa fuerte'],
  [62, 'Viento fuerte'],
  [75, 'Temporal'],
  [89, 'Temporal fuerte'],
  [103, 'Temporal duro'],
  [118, 'Temporal muy duro'],
  [Infinity, 'Huracán'],
];

export const HUMIDITY_SCALE = [
  [30, 'Ambiente seco'],
  [60, 'Humedad agradable'],
  [80, 'Ambiente húmedo'],
  [Infinity, 'Muy húmedo'],
];

export const PRESSURE_SCALE = [
  [1009, 'Presión baja'],
  [1023, 'Presión normal'],
  [Infinity, 'Presión alta'],
];

export const VISIBILITY_SCALE = [
  [1, 'Muy reducida'],
  [2, 'Reducida'],
  [5, 'Moderada'],
  [10, 'Buena'],
  [Infinity, 'Excelente'],
];

// Same bands as OpenWeather's cloud codes 801-804, so the card agrees with CLOUD_DESCRIPTIONS
export const CLOUDS_SCALE = [
  [11, 'Cielo despejado'],
  [25, 'Poco nuboso'],
  [51, 'Intervalos nubosos'],
  [85, 'Nuboso'],
  [Infinity, 'Cubierto'],
];

// AEMET sky terms for OpenWeather's cloud codes, whose Spanish labels sound gloomier ("muy nuboso" for 51-84 %)
export const CLOUD_DESCRIPTIONS = {
  801: 'poco nuboso',
  802: 'intervalos nubosos',
  803: 'nuboso',
  804: 'cubierto',
};
