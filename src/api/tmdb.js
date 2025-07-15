import { API_ROUTES } from '../config/routes';
const API_KEY = "1b64fc34b21d69f6b5469f62bf975c09";
const BASE_URL = "https://api.themoviedb.org/3";

const API_CONFIG = {
    BASE_URL: BASE_URL,
    API_KEY: API_KEY,
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    IMAGE_SIZES: {
        poster: 'w500',
        backdrop: 'w780',
        profile: 'w185'
    }
};

const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

// Fetch popular movies with pagination
export async function fetchPopularMovies(page = 1) {
    const url = `${API_CONFIG.BASE_URL}${API_ROUTES.POPULAR_MOVIES}?api_key=${API_CONFIG.API_KEY}&language=en-US&page=${page}&include_adult=false&include_video=false`;
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    // Limit to 500 movies total
    const totalPages = Math.min(data.total_pages, Math.ceil(500 / 20)); // 20 movies 
    const currentPage = Math.min(page, totalPages);
    
    return {
        ...data,
        total_pages: totalPages,
        page: currentPage,
        results: data.results
    };
}

// Search movies with pagination
export async function searchMovies(query, page = 1) {
    const response = await fetch(
        `${BASE_URL}${API_ROUTES.SEARCH_MOVIES}?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );
    return await response.json();
}

// Fetch movie details
export async function movieDetails(id) {
    const response = await fetch(
        `${BASE_URL}${API_ROUTES.MOVIE_DETAILS.replace(':id', id)}?api_key=${API_KEY}&language=en-US`
    );
    return await response.json();
}

// Fetch movie videos (trailers)
export async function movieVideos(id) {
    const response = await fetch(
        `${BASE_URL}${API_ROUTES.MOVIE_VIDEOS.replace(':id', id)}?api_key=${API_KEY}&language=en-US`
    );
    return await response.json();
}