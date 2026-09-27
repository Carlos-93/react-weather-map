import { describe as group, expect, test } from 'vitest';

import { WIND_SCALE } from '../constants';
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

  test('names the compass point in Spanish', () => {
    expect(compassPoint(0)).toBe('N');
    expect(compassPoint(140)).toBe('SE');
    expect(compassPoint(315)).toBe('NO');
    expect(compassPoint(355)).toBe('N');
  });

  test('picks the first scale label above the value', () => {
    expect(describe(0, WIND_SCALE)).toBe('Calma');
    expect(describe(18, WIND_SCALE)).toBe('Brisa débil');
    expect(describe(150, WIND_SCALE)).toBe('Huracán');
  });

  test('prints times in the city time zone', () => {
    expect(formatCityTime(1790402758, 7200)).toBe('08:05');
    expect(formatCityTime(1790402758, -10800)).toBe('03:05');
  });

  test('formats durations, offsets and coordinates', () => {
    expect(formatDuration(43227)).toBe('12 h');
    expect(formatDuration(5820)).toBe('1 h 37 min');
    expect(formatDuration(1800)).toBe('30 min');
    expect(formatUtcOffset(7200)).toBe('UTC+2');
    expect(formatUtcOffset(-10800)).toBe('UTC−3');
    expect(formatUtcOffset(19800)).toBe('UTC+5:30');
    expect(formatCoordinates({ lat: 40.4165, lon: -3.7026 })).toBe('40,42° N, 3,70° O');
  });

  test('describes how long ago the data was measured', () => {
    const now = 1790456346000;
    expect(formatRelativeTime(now / 1000, now)).toBe('ahora mismo');
    expect(formatRelativeTime(now / 1000 - 300, now)).toBe('hace 5 minutos');
    expect(formatRelativeTime(now / 1000 - 7200, now)).toBe('hace 2 horas');
  });
});