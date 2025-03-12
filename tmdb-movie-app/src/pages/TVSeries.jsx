
import { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import { getLatestTVShows } from '../services/tmdbApi';

const TVSeries = () => {
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        const data = await getLatestTVShows(page);
        setTVShows(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching TV shows:', err);
        setError('Failed to load TV shows');
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [page]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tv-series-page">
      <h1>Latest TV Series</h1>
      
      <MovieList 
        items={tvShows}
        mediaType="tv"
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
    </div>
  );
};

export default TVSeries;