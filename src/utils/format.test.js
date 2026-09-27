import { describe as group, expect, test } from 'vitest';

import { WIND_SCALE } from '../constants';
import de from '../i18n/locales/de/translation.json';
import es from '../i18n/locales/es/translation.json';
import {
  compassPoint,
  describe,
  formatCityTime,
  formatCoordinates,
  formatDuration,
  formatRelativeTime,
  formatTemperature,
  formatUtcOffset,
  toKmh,
} from './format';

group('format', () => {
  test('rounds temperatures without a negative zero', () => {
    expect(formatTemperature(21.6)).toBe('22°');
    expect(formatTemperature(-0.4)).toBe('0°');
    expect(formatTemperature(-3.6)).toBe('-4°');
  });

  test('converts m/s to km/h', () => {
    expect(toKmh(5)).toBe(18);
  });

  test('names the compass point with the translated rose', () => {
    expect(compassPoint(0, es.compass)).toBe('N');
    expect(compassPoint(140, es.compass)).toBe('SE');
    expect(compassPoint(315, es.compass)).toBe('NO');
    expect(compassPoint(355, es.compass)).toBe('N');
    expect(compassPoint(90, de.compass)).toBe('O');
  });

  test('picks the key of the first scale step above the value', () => {
    expect(describe(0, WIND_SCALE)).toBe('calm');
    expect(describe(18, WIND_SCALE)).toBe('gentleBreeze');
    expect(describe(150, WIND_SCALE)).toBe('hurricane');
  });

  test('prints times in the city time zone', () => {
    expect(formatCityTime(1790402758, 7200, 'es')).toBe('08:05');
    expect(formatCityTime(1790402758, -10800, 'es')).toBe('03:05');
  });

  test('formats durations, offsets and coordinates', () => {
    expect(formatDuration(43227)).toBe('12 h');
    expect(formatDuration(5820)).toBe('1 h 37 min');
    expect(formatDuration(1800)).toBe('30 min');
    expect(formatUtcOffset(7200)).toBe('UTC+2');
    expect(formatUtcOffset(-10800)).toBe('UTC−3');
    expect(formatUtcOffset(19800)).toBe('UTC+5:30');
    expect(formatCoordinates({ lat: 40.4165, lon: -3.7026 }, 'es', es.compass)).toBe('40,42° N, 3,70° O');
    expect(formatCoordinates({ lat: 40.4165, lon: 3.7026 }, 'de', de.compass)).toBe('40,42° N, 3,70° O');
  });

  test('describes how long ago the data was measured', () => {
    const now = 1790456346000;
    expect(formatRelativeTime(now / 1000, now, 'es')).toBe('ahora');
    expect(formatRelativeTime(now / 1000 - 300, now, 'es')).toBe('hace 5 minutos');
    expect(formatRelativeTime(now / 1000 - 7200, now, 'es')).toBe('hace 2 horas');
    expect(formatRelativeTime(now / 1000 - 300, now, 'en')).toBe('5 minutes ago');
  });
});