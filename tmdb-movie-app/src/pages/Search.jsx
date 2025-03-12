
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import MovieList from '../components/MovieList';
import { searchMulti, getGenres, getMoviesByGenre } from '../services/tmdbApi';
import '../styles/Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Get query and type from URL params
  const query = searchParams.get('query') || '';
  const genreId = searchParams.get('genre') || '';
  const mediaType = searchParams.get('type') || 'multi';

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres(mediaType === 'tv' ? 'tv' : 'movie');
        setGenres(genreData);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, [mediaType]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query && !genreId) {
        // Don't search if no query or genre
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        let data;
        
        if (genreId) {
          // Search by genre
          data = await getMoviesByGenre(genreId, page);
        } else {
          // Search by keyword
          data = await searchMulti(query, page);
        }
        
        setSearchResults(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      } catch (err) {
        console.error('Error searching:', err);
        setError('Search failed. Please try again.');
        setLoading(false);
      }
    };

    if (query || genreId) {
      fetchSearchResults();
    }
  }, [query, genreId, mediaType, page]);

  const handleSearch = (searchQuery) => {
    setPage(1); // Reset to first page on new search
    setSearchParams({ query: searchQuery, type: mediaType });
  };

  const handleGenreChange = (e) => {
    setPage(1); // Reset to first page on genre change
    if (e.target.value) {
      setSearchParams({ genre: e.target.value, type: mediaType });
    } else {
      // Clear genre filter
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('genre');
      setSearchParams(newParams);
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setPage(1); // Reset to first page on type change
    setSearchParams({ 
      ...(query ? { query } : {}),
      ...(genreId ? { genre: genreId } : {}),
      type: newType 
    });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="search-page">
      <h1>Search</h1>
      
      <div className="search-controls">
        <SearchForm onSearch={handleSearch} />
        
        <div className="filter-options">
          <div>
            <label>Media Type:</label>
            <select value={mediaType} onChange={handleTypeChange}>
              <option value="multi">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>
          
          <div>
            <label>Genre:</label>
            <select value={genreId} onChange={handleGenreChange}>
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : searchResults.length > 0 ? (
        <>
          <MovieList 
            items={searchResults}
            title={query ? `Results for "${query}"` : 'Results by Genre'}
          />
          
          <div className="pagination">
            <button 
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : query || genreId ? (
        <div>No results found</div>
      ) : (
        <div>Search for movies or TV shows, or select a genre</div>
      )}
    </div>
  );
};

export default Search;