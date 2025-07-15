import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Pagination.css';

function Pagination({ 
    totalPages, 
    maxVisiblePages = 5,
    isLoading = false,
    onPageChange,
    className = ''
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = parseInt(location.search.split('=')[1]) || 1;
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);

    // Calculate the range of pages to show
    let startPage = Math.max(1, currentPage - halfMaxVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust the range if necessary
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const handlePageChange = useCallback((page) => {
        if (page <= 0 || page > totalPages || isLoading) return;
        
        navigate(`?page=${page}`);
        onPageChange?.(page);
    }, [navigate, totalPages, isLoading, onPageChange]);

    const handleKeyDown = useCallback((e, page) => {
        if (e.key === 'Enter') {
            handlePageChange(page);
        }
    }, [handlePageChange]);

    if (isLoading) {
        return (
            <div className={`pagination-container ${className}`}>
                <div className="loading-indicator">Loading...</div>
            </div>
        );
    }

    return (
        <div className={`pagination-container ${className}`}>
            <button
                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                aria-label="Previous page"
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            {startPage > 1 && (
                <>
                    <button 
                        href="#" 
                        className="pagination-link" 
                        onClick={() => handlePageChange(1)}
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                        tabIndex="0"
                        aria-label="Go to first page"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="pagination-ellipsis">...</span>}
                </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                <button
                    key={page}
                    href="#"
                    className={`pagination-link ${currentPage === page ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, page)}
                    tabIndex="0"
                    aria-current={currentPage === page ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                    <button 
                        href="#" 
                        className="pagination-link" 
                        onClick={() => handlePageChange(totalPages)}
                        onKeyDown={(e) => handleKeyDown(e, totalPages)}
                        tabIndex="0"
                        aria-label={`Go to last page (${totalPages})`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                aria-label="Next page"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
}

Pagination.defaultProps = {
    maxVisiblePages: 5,
    isLoading: false,
    onPageChange: () => {},
    className: ''
};

export default Pagination;
