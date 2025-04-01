// API Configuration
const API_KEY = '6040237f'; // Get from http://www.omdbapi.com/apikey.aspx
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const themeToggle = document.getElementById('theme-toggle');
const resultsContainer = document.getElementById('results-container');
const paginationContainer = document.getElementById('pagination');
const modal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close');

// App State
let currentPage = 1;
let totalResults = 0;
let currentSearchTerm = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load default movies
    fetchMovies('avengers');
});

// Event Listeners
searchBtn.addEventListener('click', () => {
    if (searchInput.value.trim()) {
        currentSearchTerm = searchInput.value.trim();
        currentPage = 1;
        fetchMovies(currentSearchTerm);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        currentSearchTerm = searchInput.value.trim();
        currentPage = 1;
        fetchMovies(currentSearchTerm);
    }
});

themeToggle.addEventListener('click', toggleTheme);
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Fetch Movies from API
async function fetchMovies(searchTerm, page = 1) {
    try {
        const response = await fetch(`${API_URL}&s=${searchTerm}&page=${page}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            totalResults = parseInt(data.totalResults);
            displayMovies(data.Search);
            setupPagination();
        } else {
            resultsContainer.innerHTML = `<p class="no-results">${data.Error || 'No results found'}</p>`;
            paginationContainer.innerHTML = '';
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        resultsContainer.innerHTML = '<p class="no-results">Failed to fetch movies. Please try again.</p>';
    }
}

// Display Movies in Grid
function displayMovies(movies) {
    resultsContainer.innerHTML = movies.map(movie => `
        <div class="movie-card" data-id="${movie.imdbID}">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}" 
                 alt="${movie.Title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${movie.Title}</div>
                <div class="movie-year">${movie.Year}</div>
                <button class="watch-later" data-id="${movie.imdbID}">
                    <i class="far fa-bookmark"></i> Watch Later
                </button>
            </div>
        </div>
    `).join('');

    // Add event listeners to movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => showMovieDetails(card.dataset.id));
    });

    // Add event listeners to watch later buttons
    document.querySelectorAll('.watch-later').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToWatchLater(btn.dataset.id);
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                btn.innerHTML = '<i class="far fa-bookmark"></i> Watch Later';
            }, 2000);
        });
    });
}

// Show Movie Details in Modal
async function showMovieDetails(imdbID) {
    try {
        const response = await fetch(`${API_URL}&i=${imdbID}`);
        const movie = await response.json();
        
        modalDetails.innerHTML = `
            <div class="modal-grid">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" 
                     alt="${movie.Title}" class="modal-poster">
                <div class="modal-info">
                    <h2>${movie.Title} (${movie.Year})</h2>
                    <p><strong>Rated:</strong> ${movie.Rated}</p>
                    <p><strong>Released:</strong> ${movie.Released}</p>
                    <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                    <p><strong>Genre:</strong> ${movie.Genre}</p>
                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <p><strong>Actors:</strong> ${movie.Actors}</p>
                    <p><strong>Plot:</strong> ${movie.Plot}</p>
                    <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}/10</p>
                    <button class="watch-later" data-id="${movie.imdbID}">
                        <i class="far fa-bookmark"></i> Watch Later
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Add event listener to modal watch later button
        document.querySelector('.modal-info .watch-later').addEventListener('click', (e) => {
            addToWatchLater(imdbID);
            e.target.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                e.target.innerHTML = '<i class="far fa-bookmark"></i> Watch Later';
            }, 2000);
        });
    } catch (error) {
        console.error('Error fetching movie details:', error);
        modalDetails.innerHTML = '<p>Failed to load movie details.</p>';
    }
}

// Pagination
function setupPagination() {
    const totalPages = Math.ceil(totalResults / 10);
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous Button
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        prevBtn.addEventListener('click', () => {
            currentPage--;
            fetchMovies(currentSearchTerm, currentPage);
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(prevBtn);
    }
    
    // Page Numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            fetchMovies(currentSearchTerm, currentPage);
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(pageBtn);
    }
    
    // Next Button
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
        nextBtn.addEventListener('click', () => {
            currentPage++;
            fetchMovies(currentSearchTerm, currentPage);
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(nextBtn);
    }
}

// Watch Later Functionality
function addToWatchLater(imdbID) {
    let watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    if (!watchLater.includes(imdbID)) {
        watchLater.push(imdbID);
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
    }
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}