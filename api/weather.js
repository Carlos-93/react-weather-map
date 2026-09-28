import { localName, openWeather, pickLanguage } from '../server/openweather.js';
import { openMeteo } from '../server/open-meteo.js';

const fromOpenMeteo = ({ name, latitude, longitude }) => ({ name, lat: latitude, lon: longitude });

// Finds the place to show: a chosen suggestion (its id), a typed city or a position, named in the chosen language
async function findPlace({ id, city, lat, lon }, lang) {
  if (id) return fromOpenMeteo(await openMeteo('/get', { id, language: lang }));
  if (city) {
    const { results } = await openMeteo('/search', { name: city, count: 1, language: lang });
    return results && fromOpenMeteo(results[0]);
  }
  // Open-Meteo has no reverse geocoding. OpenWeather's can name a district ("Chiyoda" in Tokyo), fine for "my location"
  const [place] = await openWeather('/geo/1.0/reverse', { lat, lon, limit: 1 });
  return place && { name: localName(place, lang), lat, lon };
}

// GET /api/weather?id=<GeoNames id>, ?city=<name> or ?lat=<lat>&lon=<lon>, plus &lang=<language>
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const city = searchParams.get('city')?.trim();
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const lang = pickLanguage(searchParams.get('lang'));
  if (!id && !city && !(lat && lon)) return Response.json({ message: 'Missing id, city or coordinates' }, { status: 400 });

  try {
    const place = await findPlace({ id, city, lat, lon }, lang);
    if (city && !place) return Response.json({ message: 'City not found' }, { status: 404 });

    const weather = await openWeather('/data/2.5/weather', { lat: place?.lat ?? lat, lon: place?.lon ?? lon, units: 'metric', lang });
    // The weather API names the nearest station's town, in English; the geocoded place names the city in the chosen language
    if (place) weather.name = place.name;
    // OpenWeather refreshes about every 10 minutes, so the CDN can reuse the answer
    return Response.json(weather, { headers: { 'Cache-Control': 's-maxage=600' } });
  } catch {
    // If OpenWeather or Open-Meteo is unavailable, return a 502 Bad Gateway error
    return Response.json({ message: 'The weather service is unavailable' }, { status: 502 });
  }
}