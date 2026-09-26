// Proxies the OpenWeather Current Weather API so the API key stays on the server.
// Runs as a Vercel Function in production and through the dev server plugin in vite.config.js in development.
export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q')?.trim();
  if (!q) return Response.json({ message: 'Missing city' }, { status: 400 });

  const params = new URLSearchParams({ q, units: 'metric', lang: 'es', appid: process.env.OPENWEATHER_KEY });
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
    // OpenWeather updates current weather about every 10 minutes, so the CDN can reuse successful answers
    const headers = response.ok ? { 'Cache-Control': 's-maxage=600' } : {};
    return Response.json(await response.json(), { status: response.status, headers });
  } catch {
    return Response.json({ message: 'OpenWeather is unavailable' }, { status: 502 });
  }
}
