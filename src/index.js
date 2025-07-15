import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppMovies from './AppMovies';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/moviesExplorer">
      <AppMovies />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
