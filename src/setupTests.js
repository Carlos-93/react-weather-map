import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

import i18n from './i18n/config';

// jsdom's browser language is English, so each test starts in Spanish explicitly
beforeEach(async () => {
  await i18n.changeLanguage('es');
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});