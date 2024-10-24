import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SocketProvider } from './contexts/SocketContext';
import ErrorBoundary from './ErrorBoundary'

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
    <SocketProvider>
    <ErrorBoundary>
      <App />
      </ErrorBoundary>
      </SocketProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root container not found');
}