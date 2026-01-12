import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker registered: ', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('New content is available; please refresh.');
                // You can show a notification to the user here
                if (window.confirm('A new version of the app is available. Would you like to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      },
      (error) => {
        console.log('Service Worker registration failed: ', error);
      }
    );
  });
}

createRoot(document.getElementById("root")!).render(<App />);
