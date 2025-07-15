import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieGrid from "../components/MovieGrid";
import { searchMovies } from "../api/tmdb";
import Footer from "../components/Footer";
import SpinnerLoader from "../components/SpinnerLoader";
import Pagination from "../components/Pagination";
import "./SearchResults.css";
import { Link } from "react-router-dom";

function SearchResults() {
    const { query } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    // Obtener la página actual de la URL
    const currentPage = parseInt(location.search.split('=')[1]) || 1;

    useEffect(() => {
        if (!query) {
            navigate("/");
            return;
        }

        const fetchMovies = async () => {
            try {
                const response = await searchMovies(decodeURIComponent(query), currentPage);
                setMovies(response.results);
                setTotalPages(response.total_pages);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [query, location.search, navigate, currentPage]);

    if (loading) {
        return (
            <div className="search-results">
                <Navbar />
                <div className="loading-container">
                    <SpinnerLoader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-results">
                <Navbar />
                <div className="error-container">
                    <div>Error: {error.message}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="search-results">
            <div className="search-results-content">
                <h2 className="search-results-title">Search Results for "{decodeURIComponent(query)}"</h2>
                <div className="btn-back">
                    <Link to="/">
                        <button type="button">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    </Link>
                </div>
                {movies.length === 0 ? (
                    <div className="no-results">
                        <p>No results found for "{decodeURIComponent(query)}"</p>
                        <p>Try searching with different keywords</p>
                    </div>
                ) : (
                    <>
                        <MovieGrid movies={movies} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(pageNumber) => navigate(`?page=${pageNumber}`)}
                        />
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default SearchResults;