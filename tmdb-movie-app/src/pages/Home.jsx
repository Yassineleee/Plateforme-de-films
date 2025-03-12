
import { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import { getTrendingMovies, getTrendingTVShows } from '../services/tmdbApi';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const [moviesData, tvData] = await Promise.all([
          getTrendingMovies(),
          getTrendingTVShows()
        ]);
        
        setTrendingMovies(moviesData);
        setTrendingTV(tvData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trending data:', err);
        setError('Failed to load trending content');
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <h1>Welcome to Movie App</h1>
      
      <MovieList 
        items={trendingMovies}
        title="Trending Movies"
        mediaType="movie"
      />
      
      <MovieList 
        items={trendingTV}
        title="Trending TV Shows"
        mediaType="tv"
      />
    </div>
  );
};

export default Home;