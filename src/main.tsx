import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { DioramaProvider } from './context/DioramaContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <DioramaProvider>
        <App />
      </DioramaProvider>
    </AppProvider>
  </React.StrictMode>
);
