import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { movieDetails, movieVideos } from '../api/tmdb';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SpinnerLoader from '../components/SpinnerLoader';
import './MovieDetail.css';
import { Link } from 'react-router-dom';


function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // Fetch movie details
                const movieData = await movieDetails(id);
                setMovie(movieData);

                // Fetch movie videos
                const videoData = await movieVideos(id);
                const trailerKey = videoData.results.find(video =>
                    video.type === 'Trailer' && video.site === 'YouTube'
                )?.key;

                if (trailerKey) {
                    setTrailer(`https://www.youtube.com/embed/${trailerKey}`);
                }

                // Check if movie is in watchlist
                const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
                const isMovieInWatchlist = watchlist.some(m => m.id === parseInt(id));
                setIsSaved(isMovieInWatchlist);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleSaveToWatchlist = () => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        if (!isSaved) {
            // Add movie to watchlist
            watchlist.push(movie);
        } else {
            // Remove movie from watchlist
            const index = watchlist.findIndex(m => m.id === movie.id);
            if (index > -1) {
                watchlist.splice(index, 1);
            }
        }

        // Update localStorage and state
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        setIsSaved(!isSaved);
    };

    if (loading) {
        return <div><SpinnerLoader /></div>;
    }

    if (!movie) {
        return <div>Movie not found</div>;
    }

    const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

    return (
        <div className="movie-card-detail">
            <Navbar />

            <div className="btn-back">
                <Link to="/">
                    <button type="button">
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                </Link>
            </div>
            <div className="movie-card-detail-container">
                {/* Background blur */}
                <div
                    className="movie-card-detail-background"
                    style={{
                        backgroundImage: `url(${BACKDROP_URL}${movie.backdrop_path || movie.poster_path})`
                    }}
                ></div>

                <div className="movie-card-poster">
                    {movie.poster_path && (
                        <img
                            src={`${BASE_IMAGE_URL}${movie.poster_path}`}
                            alt={movie.title}
                        />
                    )}
                    <div className="btn-save-watchlist">
                        <button
                            onClick={handleSaveToWatchlist}
                            style={{ color: isSaved ? 'red' : 'white' }}
                        >
                            <i className={isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                        </button>
                    </div>
                </div>

                <div className="movie-card-info">
                    <div className="movie-card-info-container">
                        <h1>{movie.title}</h1>
                        <div className="movie-card-meta">
                            <div className="movie-card-meta-item release-date">
                                <i className="fa-solid fa-calendar"></i>
                                <span>{movie.release_date}</span>
                            </div>
                            <div className="movie-card-meta-item runtime">
                                <i className="fa-solid fa-clock"></i>
                                <span>{movie.runtime}</span> min
                            </div>
                            <div className="movie-card-meta-item">
                                <i className="fa-solid fa-star"></i>
                                <span className="rating-detail-text">
                                    {movie.vote_average.toFixed(1)}
                                </span>
                            </div>
                            <div className="movie-card-meta-item genres">
                                <i className="fa-solid fa-tag"></i>
                                <span>{movie.genres.map(genre => genre.name).join(', ')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="movie-card-overview">
                        <p>{movie.overview}</p>
                    </div>
                    {trailer && (
                        <div className="movie-trailer">
                            <iframe
                                src={trailer}
                                title="Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                width="100%"
                                height="400"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MovieDetail;