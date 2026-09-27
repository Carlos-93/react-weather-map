// Method Get to fetch the weather data from OpenWeather API
export async function GET(request) {
  // Get the city or the coordinates from the request URL
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.trim();
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // OpenWeather calls the city parameter `q`
  const place = city ? { q: city } : lat && lon ? { lat, lon } : null;
  if (!place) return Response.json({ message: 'Missing city or coordinates' }, { status: 400 });

  const params = new URLSearchParams({ ...place, units: 'metric', lang: 'es', appid: process.env.OPENWEATHER_KEY });

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
    // OpenWeather refreshes about every 10 minutes, so the CDN can reuse successful answers
    const headers = response.ok ? { 'Cache-Control': 's-maxage=600' } : {};
    return Response.json(await response.json(), { status: response.status, headers });
  } catch {
    // If OpenWeather is unavailable, return a 502 Bad Gateway error
    return Response.json({ message: 'OpenWeather is unavailable' }, { status: 502 });
  }
}