import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import './i18n/config';

import ErrorBoundary from './components/common/ErrorBoundary';

// Unregister any existing service workers to ensure users get the latest version
// and are not trapped by aggressive caching from the previous VitePWA setup.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then(success => {
        if (success) {
          console.log('Successfully unregistered legacy service worker');
        }
      });
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);