import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import "./Navbar.css";

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Inicializar con el valor guardado en localStorage o false por defecto
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });
    const [isFixed, setIsFixed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const encoded = encodeURIComponent(searchQuery.trim());
            navigate(`/search/${encoded}`);
            if (searchInputRef.current) {
                searchInputRef.current.blur();
            }
        }
    };

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const input = document.querySelector('.search-input');
            if (!input) return;

            if (e.key === '/') {
                e.preventDefault();
                input.focus();
            } else if (e.key === 'Escape') {
                input.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isFixed ? 'navbar-fixed' : ''}`}>
            <div className="navbar-container">
                <Link to={ROUTES.HOME} className="navbar-logo">
                    <i className="logo-icon fa-solid fa-film"></i>
                    <span className="logo-text">Movie Explorer</span>
                </Link>

                <div className="search-bar">
                    <form onSubmit={handleSubmit} className="search-form">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            autoComplete="off"
                        />
                        <div className="search-hint">/</div>
                        <button type="submit" className="search-button">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                </div>

                <div className="nav-buttons">
                    <Link to={ROUTES.WATCHLIST} className={location.pathname === ROUTES.WATCHLIST ? "nav-button active" : "nav-button"}>
                        <i className="fa-solid fa-bookmark"></i>
                        <span>Watchlist</span>
                    </Link>
                    <button className="theme-toggle" onClick={toggleDarkMode}>
                        {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;