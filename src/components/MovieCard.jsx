import React, { useState, useEffect, useRef } from 'react';
import './MovieCard.css';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes';

function MovieCard({ movie, removeFromWatchlist }) {
    const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
    const [isSaved, setIsSaved] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef(null);

    // Verificar si la película está en la lista de deseos cuando se monta el componente
    useEffect(() => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const isMovieInWatchlist = watchlist.some(m => m.id === movie.id);
        setIsSaved(isMovieInWatchlist);
    }, [movie.id]);

    // Precargar imagen para evitar layout shift
    useEffect(() => {
        if (movie.poster_path) {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
            img.src = `${BASE_IMAGE_URL}${movie.poster_path}`;
        } else {
            setImageError(true);
        }
    }, [movie.poster_path]);

    const handleSaveToWatchlist = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        if (!isSaved) {
            watchlist.push(movie);
        } else {
            const index = watchlist.findIndex(m => m.id === movie.id);
            if (index > -1) {
                watchlist.splice(index, 1);
            }
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        setIsSaved(!isSaved);
    };

    // Función para determinar el color del rating
    const getRatingColor = (rating) => {
        if (rating < 5) return '#e74c3c'; // Rojo
        if (rating < 7) return '#f39c12'; // Amarillo
        return '#27ae60'; // Verde
    };

    // Formatear fecha de manera consistente
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        try {
            const date = new Date(dateString);
            return date.getFullYear().toString();
        } catch {
            return 'Unknown';
        }
    };

    // Formatear rating de manera consistente
    const formatRating = (rating) => {
        if (typeof rating !== 'number' || isNaN(rating)) return '0.0';
        return rating.toFixed(1);
    };

    // Truncar descripción para evitar layout shift
    const truncateDescription = (text, maxLength = 200) => {
        if (!text) return 'No description available.';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    return (
        <div className="movie-card">
            <Link to={`${ROUTES.MOVIE_DETAIL.replace(':id', movie.id)}`} className="movie-card-link">
                <div className="movie-card-content">
                    {/* Contenedor de imagen con placeholder */}
                    <div className="movie-card-img-container">
                        {imageLoaded && !imageError && movie.poster_path ? (
                            <img
                                ref={imgRef}
                                src={`${BASE_IMAGE_URL}${movie.poster_path}`}
                                alt={movie.title || 'Movie poster'}
                                className="movie-poster"
                                loading="lazy"
                                width="275"
                                height="413"
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                            />
                        ) : imageError || !movie.poster_path ? (
                            <div className="movie-poster-placeholder">
                                <i className="fa-solid fa-film"></i>
                            </div>
                        ) : (
                            // Skeleton loading mientras carga la imagen
                            <div className="movie-poster" style={{ background: 'linear-gradient(90deg, #1a1623 0%, #252032 50%, #1a1623 100%)', backgroundSize: '200% 100%' }}></div>
                        )}

                        {/* Overlay gradient para el hover */}
                        <div className="movie-card-overlay"></div>
                    </div>

                    {/* Botón de watchlist - top izquierdo */}
                    <button
                        onClick={(e) => {
                            handleSaveToWatchlist(e);
                            if (removeFromWatchlist && isSaved) {
                                removeFromWatchlist(movie.id);
                            }
                        }}
                        className="save-button"
                        aria-label={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                        <i className={isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                    </button>

                    {/* Rating circular - top derecho */}
                    <div
                        className="rating-circle"
                        style={{
                            '--rating-color': getRatingColor(movie.vote_average || 0)
                        }}
                        aria-label={`Rating: ${formatRating(movie.vote_average)}`}
                    >
                        <svg className="rating-svg" viewBox="0 0 36 36" aria-hidden="true">
                            <path
                                className="rating-bg"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="rating-progress"
                                strokeDasharray={`${((movie.vote_average || 0) / 10) * 100}, 100`}
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <span className="rating-text">{formatRating(movie.vote_average)}</span>
                    </div>

                    {/* Información que aparece en hover */}
                    <div className="movie-info">
                        <h3 className="movie-card-title">
                            {movie.title || 'Unknown Title'}
                        </h3>
                        <div className="movie-card-date">
                            <i className="fa-solid fa-calendar-days" aria-hidden="true"></i>
                            <span>{formatDate(movie.release_date)}</span>
                        </div>
                        <p className="movie-card-description">
                            {truncateDescription(movie.overview)}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default MovieCard;