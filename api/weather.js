// Method Get to fetch the weather data from OpenWeather API
export async function GET(request) {
  // Get the city parameter from the request URL
  const city = new URL(request.url).searchParams.get('city')?.trim();
  if (!city) return Response.json({ message: 'Missing city' }, { status: 400 });

  // OpenWeather calls the city parameter `q`
  const params = new URLSearchParams({ q: city, units: 'metric', lang: 'es', appid: process.env.OPENWEATHER_KEY });

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