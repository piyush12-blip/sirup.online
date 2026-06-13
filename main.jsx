import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (window.location.pathname === '/studio') {
  import('./plasmic-host.jsx').then(({ default: PlasmicHost }) => {
    root.render(
      React.createElement(PlasmicHost)
    );
  });
} else {
  import('./App.jsx').then(({ default: App }) => {
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(App)
      )
    );
  });
}