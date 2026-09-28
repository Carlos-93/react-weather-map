// Shared by the Functions in api/; it lives outside api/ because Vercel would turn it into a public Function too

// Interface languages, also supported by OpenWeather; kept here because the Functions cannot import src/constants.js
const LANGUAGES = ['es', 'ca', 'en', 'de', 'it', 'fr'];

export const pickLanguage = (value) => (LANGUAGES.includes(value) ? value : 'es');

// Method to call OpenWeather's API with the API key from the environment; throws on HTTP errors
export async function openWeather(path, params) {
  const query = new URLSearchParams({ ...params, appid: process.env.OPENWEATHER_KEY });
  const response = await fetch(`https://api.openweathermap.org${path}?${query}`);
  if (!response.ok) throw new Error(`OpenWeather ${path} answered ${response.status}`);
  return response.json();
}

// A geocoded place's name in the interface language, or OpenWeather's own name when it has no translation
export const localName = (place, language) => place.local_names?.[language] ?? place.name;