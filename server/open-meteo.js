// Method to call Open-Meteo's geocoding API; throws on HTTP errors
export async function openMeteo(path, params) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1${path}?${new URLSearchParams(params)}`);
  if (!response.ok) throw new Error(`Open-Meteo ${path} answered ${response.status}`);
  return response.json();
}