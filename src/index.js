import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppMovies from './AppMovies';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './config/routes';
import Home from './pages/Home';
import MovieDetail from './pages/movieDetail';
import SearchResults from './pages/SearchResults';
import WatchList from './pages/WatchList';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetail />} />
        <Route path={ROUTES.SEARCH} element={<SearchResults />} />
        <Route path={ROUTES.WATCHLIST} element={<WatchList />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
