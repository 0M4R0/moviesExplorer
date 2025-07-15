import { ROUTES } from './config/routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar'; 
import MovieDetail from './pages/movieDetail';
import WatchList from './pages/WatchList';

function AppMovies() {
    return (
        <Router>
            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path={ROUTES.HOME} element={<Home />} />
                    <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetail />} />
                    <Route path={ROUTES.WATCHLIST} element={<WatchList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppMovies;
