// Serves the Vercel Function in api/ from the CRA dev server, so `pnpm start` works without the Vercel CLI
import weather from '../api/weather';

export default (app) => {
  app.get('/api/weather', weather);
};