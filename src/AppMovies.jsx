import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './config/routes';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/movieDetail';
import WatchList from './pages/WatchList';
import SearchResults from './pages/SearchResults';

function AppMovies() {
    return (
        <>
            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path={ROUTES.HOME} element={<Home />} />
                    <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetail />} />
                    <Route path={ROUTES.WATCHLIST} element={<WatchList />} />
                    <Route path={ROUTES.SEARCH} element={<SearchResults />} />
                </Routes>
            </div>
        </>
    );
}

export default AppMovies;
