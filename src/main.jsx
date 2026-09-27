import { createRoot } from 'react-dom/client';
import { i18nReady } from './i18n/config';
import { StrictMode } from 'react';

import App from './App';
import './index.css';

// Waits for the saved language's translations, so the page never shows Spanish first
await i18nReady;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);