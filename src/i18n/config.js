import { initReactI18next } from 'react-i18next';
import { LANGUAGES } from '../constants';

import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import es from './locales/es/translation.json';
import i18n from 'i18next';

// Spanish is bundled; every other language is its own chunk, loaded only when chosen
const loaders = import.meta.glob(['./locales/*/translation.json', '!./locales/es/translation.json']);

// Resolves once the saved language is loaded, so main.jsx can wait for it and avoid a flash of Spanish
export const i18nReady = i18n
    .use(LanguageDetector)
    .use(resourcesToBackend((language) => loaders[`./locales/${language}/translation.json`]?.() ?? Promise.resolve({ default: es })))
    .use(initReactI18next)
    .init({
        fallbackLng: 'es',
        supportedLngs: LANGUAGES.map(({ code }) => code),
        partialBundledLanguages: true,
        resources: { es: { translation: es } },
        // A language picked before wins; otherwise the browser's (en-US counts as en), and Spanish if it is not one of the six
        detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'], lookupLocalStorage: 'language' },
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });

export default i18n;