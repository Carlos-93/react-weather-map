import { LANGUAGES } from '../constants';

const toLocale = (language) => LANGUAGES.find(({ code }) => code === language)?.locale ?? 'es-ES';

// Intl formatters are costly to build, so each one is created once per language and options
const formatters = new Map();
function formatter(Formatter, language, options) {
  const key = `${Formatter.name}|${language}|${JSON.stringify(options)}`;
  if (!formatters.has(key)) formatters.set(key, new Formatter(toLocale(language), options));
  return formatters.get(key);
}

// City times are shifted by their UTC offset and then printed as UTC
const toCityDate = (unixSeconds, offsetSeconds) => new Date((unixSeconds + offsetSeconds) * 1000);

export const formatTemperature = (celsius) => `${Math.round(celsius)}°`;

export const formatNumber = (value, language) => formatter(Intl.NumberFormat, language, { maximumFractionDigits: 1 }).format(value);

export const toKmh = (metersPerSecond) => Math.round(metersPerSecond * 3.6);

// `points` is the translated 16-point compass rose, starting at north
export const compassPoint = (degrees, points) => points[Math.round(degrees / 22.5) % 16];

// Returns the key of the first [limit, key] pair whose limit is above the value
export const describe = (value, scale) => scale.find(([limit]) => value < limit)[1];

export const formatCityTime = (unixSeconds, offsetSeconds, language) =>
  formatter(Intl.DateTimeFormat, language, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
    .format(toCityDate(unixSeconds, offsetSeconds));

export const formatCityDate = (unixSeconds, offsetSeconds, language) =>
  formatter(Intl.DateTimeFormat, language, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(toCityDate(unixSeconds, offsetSeconds));

export const formatCountry = (code, language) => (code ? formatter(Intl.DisplayNames, language, { type: 'region' }).of(code) : '');

export function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (!hours) return `${minutes} min`;
  return minutes % 60 ? `${hours} h ${minutes % 60} min` : `${hours} h`;
}

export function formatUtcOffset(offsetSeconds) {
  const totalMinutes = Math.abs(offsetSeconds) / 60;
  const minutes = totalMinutes % 60;
  const sign = offsetSeconds < 0 ? '−' : '+';
  return `UTC${sign}${Math.floor(totalMinutes / 60)}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
}

// North, east, south and west are points 0, 4, 8 and 12 of the translated compass rose
export function formatCoordinates({ lat, lon }, language, points) {
  const coordinate = formatter(Intl.NumberFormat, language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const latitude = `${coordinate.format(Math.abs(lat))}° ${lat < 0 ? points[8] : points[0]}`;
  const longitude = `${coordinate.format(Math.abs(lon))}° ${lon < 0 ? points[12] : points[4]}`;
  return `${latitude}, ${longitude}`;
}

export function formatRelativeTime(unixSeconds, now, language) {
  const relative = formatter(Intl.RelativeTimeFormat, language, { numeric: 'auto' });
  const minutes = Math.round((unixSeconds * 1000 - now) / 60_000);
  // "now" in every language, instead of "this minute"
  if (minutes === 0) return relative.format(0, 'second');
  if (Math.abs(minutes) < 60) return relative.format(minutes, 'minute');
  return relative.format(Math.round(minutes / 60), 'hour');
}