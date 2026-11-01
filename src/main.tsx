import React from 'react';
import ReactDOM from 'react-dom/client';
import { EventProvider } from './context/EventContext';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EventProvider>
      <App />
    </EventProvider>
  </React.StrictMode>
);

