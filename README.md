
# Movie Search App

A responsive movie search application built with HTML, CSS, and JavaScript that allows users to:
- Search for movies/series using the OMDb API
- View detailed information about each title
- Toggle between light/dark themes
- Browse paginated results

Features
Real-time movie searching
Detailed movie information (plot, ratings, cast)  
Responsive design(works on mobile & desktop)  
Dark/Light mode toggle
Pagination support
Error handling for API failures  

How to Use1. Get an API Key(free from [OMDb](http://www.omdbapi.com/apikey.aspx))
2. Replace the placeholder in `script.js`:
3. Open `index.html` in any modern browser

Troubleshooting
If you see "No movies found":
1. Verify your API key works by testing in browser:
   https://www.omdbapi.com/?apikey=YOUR_KEY&s=avengers
2. Check browser console (F12) for errors
3. Ensure you've waited 2-3 hours after API key registration

Customization
Easily modify:
- Colors in CSS variables (`:root`)
- Default search term in HTML (`value="avengers"`)
- Number of results per page in JavaScript

Future Enhancements

- [ ] Watchlist functionality
- [ ] YouTube trailer integration
- [ ] Advanced filters (genre, rating)
- [ ] Voice search capability


Enjoy exploring movies! 
For support, open an issue on GitHub.
