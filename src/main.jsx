import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ContentProvider } from './content.jsx';
import { I18nProvider } from './i18n.jsx';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
