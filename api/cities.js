import { openMeteo } from '../server/open-meteo.js';
import { pickLanguage } from '../server/openweather.js';

// GET /api/cities?q=<text>&lang=<language>: up to five places for the search suggestions
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const lang = pickLanguage(searchParams.get('lang'));
  if (query.length < 2) return Response.json([]);

  try {
    // Open-Meteo leaves `results` out when nothing matches; ten leave room for the repeats removed below
    const { results = [] } = await openMeteo('/search', { name: query, count: 10, language: lang });
    // Villages with the same name in the same region would look like identical rows, so only the first stays
    const labels = new Set();
    const cities = results
      .map(({ id, name, admin1, country_code }) => ({ id, name, state: admin1, country: country_code }))
      .filter(({ name, state, country }) => {
        const label = `${name}|${state}|${country}`;
        if (labels.has(label)) return false;
        labels.add(label);
        return true;
      })
      .slice(0, 5);
    // Places do not change, so the CDN can keep the answer for a day
    return Response.json(cities, { headers: { 'Cache-Control': 's-maxage=86400' } });
  } catch {
    return Response.json({ message: 'Geocoding is unavailable' }, { status: 502 });
  }
}