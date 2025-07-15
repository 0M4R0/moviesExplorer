import React, { useState, useEffect } from 'react';
import './SpinnerLoader.css';

const SpinnerLoader = ({ loading = true, message = "Loading..." }) => {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [loading]);

    if (!loading) return null;
    if (!showLoader) return null;

    return (
        <div className="spinner-overlay">
            <div className="spinner-container">
                <div className="spinner"></div>
                {message && <p className="loading-text">{message}</p>}
            </div>
        </div>
    );
}

export default React.memo(SpinnerLoader);
