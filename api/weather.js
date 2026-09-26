// Proxies the OpenWeather Current Weather API so the API key stays on the server.
// Runs as a Vercel Function in production and through src/setupProxy.js in development.
module.exports = async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  if (!q) return res.status(400).json({ message: 'Missing city' });

  const params = new URLSearchParams({ q, units: 'metric', lang: 'es', appid: process.env.OPENWEATHER_KEY });
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
    // OpenWeather updates current weather about every 10 minutes, so the CDN can reuse successful answers
    if (response.ok) res.setHeader('Cache-Control', 's-maxage=600');
    res.status(response.status).json(await response.json());
  } catch {
    res.status(502).json({ message: 'OpenWeather is unavailable' });
  }
};
