import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Filter out known benign React Native Web responder warning during mouse/touch emulation
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Cannot find single active touch')) {
    return;
  }
  originalConsoleError(...args);
};

window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Cannot find single active touch')) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
