import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// Before App: index.css declares the cascade layer order that every component stylesheet relies on
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
