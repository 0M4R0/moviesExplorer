import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import './WatchList.css';


function WatchList() {
    const [watchlist, setWatchlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 12;

    useEffect(() => {
        const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        setWatchlist(savedWatchlist);
    }, []);

    // Calculate current movies to display
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = watchlist.slice(indexOfFirstMovie, indexOfLastMovie);

    const removeFromWatchlist = (movieId) => {
        const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(watchlist.length / moviesPerPage);

    return (
        <div className="watchlist-container">
            <Navbar />

            <main className="watchlist-main">
                <h1>
                    <i className="fa-solid fa-bookmark"></i>
                    My Watchlist
                </h1>

                {watchlist.length === 0 ? (
                    <div className="watchlist-empty">
                        <p>Your watchlist is empty.</p>
                        <button onClick={() => window.location.href = '/'}>Add movies</button>
                    </div>
                ) : (
                    <div>
                        <div className="movie-count">
                            <p>Movies: {watchlist.length}</p>
                        </div>
                        <div className="movie-grid">
                            {currentMovies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    removeFromWatchlist={removeFromWatchlist}
                                />
                            ))}
                        </div>
                        <Pagination
                            totalPages={totalPages}
                            onPageChange={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default WatchList;