
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './src/contexts/LanguageContext';

// Ensure fetch is protected at the entry point as well
try {
  const originalFetch = window.fetch;
  if (originalFetch) {
    Object.defineProperty(window, 'fetch', {
      get: function() { return originalFetch; },
      set: function(v) { /* ignore */ },
      configurable: true,
      enumerable: true
    });
  }
} catch (e) {
  // Silent fail
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
