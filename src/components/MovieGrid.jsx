import React from 'react';
import MovieCard from './MovieCard';
import './MovieGrid.css';

function MovieGrid({ movies }) {
    return (
        <div className="movie-grid">
            {movies && movies.length > 0 ? (
                movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))
            ) : (
                <div>
                    <p>No movies found</p>
                </div>
            )}
        </div>
    );
}

export default MovieGrid;