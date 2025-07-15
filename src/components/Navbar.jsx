import React, { useState, useEffect } from 'react';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const encoded = encodeURIComponent(searchQuery.trim());
            navigate(`/search/${encoded}`);
        }
    };

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        // Guardar el estado en localStorage
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    useEffect(() => {
        // Aplicar el dark mode al body cuando cambia
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

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
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            autoComplete="off"
                        />
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