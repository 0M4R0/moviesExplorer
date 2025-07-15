import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchPopularMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SpinnerLoader from '../components/SpinnerLoader';
import Pagination from '../components/Pagination';

function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const location = useLocation();

    // Obtener la página actual de la URL
    const currentPage = parseInt(location.search.split('=')[1]) || 1;

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const response = await fetchPopularMovies(currentPage);
                
                // Limitar a 500 películas en total
                const moviesToShow = response.results.slice(0, 25); // 25 películas por página
                setMovies(moviesToShow);
                
                // Calcular el total de páginas basado en el límite de 500 películas
                const maxPages = Math.min(response.total_pages, Math.ceil(500 / 20));
                setTotalPages(maxPages);
            } catch (error) {
                console.error('Error fetching popular movies:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, [location.search]);

    if (loading) {
        return <SpinnerLoader />;
    }

    return (
        <div className="home-page">
            <Navbar />
            <div className="movie-grid-container">
                <MovieGrid movies={movies} />
            </div>
            <Pagination totalPages={totalPages} />
            <Footer />
        </div>
    );
}

export default Home;