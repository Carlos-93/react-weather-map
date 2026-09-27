import { COMPASS_POINTS } from '../constants';

const LOCALE = 'es-ES';

const numberFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const coordinateFormat = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const relativeFormat = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
const regionNames = new Intl.DisplayNames(LOCALE, { type: 'region' });
// City times are shifted by their UTC offset and then printed as UTC
const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
const dateFormat = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

const toCityDate = (unixSeconds, offsetSeconds) => new Date((unixSeconds + offsetSeconds) * 1000);

export const formatTemperature = (celsius) => `${Math.round(celsius)}°`;

export const formatNumber = (value) => numberFormat.format(value);

export const toKmh = (metersPerSecond) => Math.round(metersPerSecond * 3.6);

export const compassPoint = (degrees) => COMPASS_POINTS[Math.round(degrees / 22.5) % 16];

// Returns the label of the first [limit, label] pair whose limit is above the value
export const describe = (value, scale) => scale.find(([limit]) => value < limit)[1];

export const formatCityTime = (unixSeconds, offsetSeconds) => timeFormat.format(toCityDate(unixSeconds, offsetSeconds));

export const formatCityDate = (unixSeconds, offsetSeconds) => dateFormat.format(toCityDate(unixSeconds, offsetSeconds));

export const formatCountry = (code) => (code ? regionNames.of(code) : '');

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

export function formatCoordinates({ lat, lon }) {
  const latitude = `${coordinateFormat.format(Math.abs(lat))}° ${lat < 0 ? 'S' : 'N'}`;
  const longitude = `${coordinateFormat.format(Math.abs(lon))}° ${lon < 0 ? 'O' : 'E'}`;
  return `${latitude}, ${longitude}`;
}

export function formatRelativeTime(unixSeconds, now) {
  const minutes = Math.round((unixSeconds * 1000 - now) / 60_000);
  if (minutes === 0) return 'ahora mismo';
  if (Math.abs(minutes) < 60) return relativeFormat.format(minutes, 'minute');
  return relativeFormat.format(Math.round(minutes / 60), 'hour');
}