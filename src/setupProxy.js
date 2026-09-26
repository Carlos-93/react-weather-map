// Serves the Vercel Function in api/ from the CRA dev server, so `pnpm start` works without the Vercel CLI
const weather = require('../api/weather');

module.exports = (app) => {
  app.get('/api/weather', weather);
};