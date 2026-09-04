import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ModeProvider } from './mode.js';
import './index.css';
import './max.css';

/* The site used to run on HashRouter, so links shared as /#/about are still
   in the wild. Rewrite them to real paths before React mounts. */
if (window.location.hash.startsWith('#/')) {
  const target = window.location.hash.slice(1);
  window.history.replaceState(null, '', target + window.location.search);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ModeProvider>
  </React.StrictMode>,
);
