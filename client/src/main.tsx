import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SocketProvider } from './contexts/SocketContext';

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
    <SocketProvider>
      <App />
      </SocketProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root container not found');
}