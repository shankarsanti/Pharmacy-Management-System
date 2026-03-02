import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);

