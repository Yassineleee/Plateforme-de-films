
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovieDetails, getTVDetails } from '../services/tmdbApi';
import MovieList from '../components/MovieList';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([]);
  
  // Determine if it's a movie or TV show based on the URL
  const mediaType = window.location.pathname.includes('/movie/') ? 'movie' : 'tv';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        
        let data;
        if (mediaType === 'movie') {
          data = await getMovieDetails(id);
        } else {
          data = await getTVDetails(id);
        }
        
        setDetails(data);
        setLoading(false);

        // Check if it's in favorites or watch later
        if (isAuthenticated) {
          // This is just a placeholder - you would normally check against a backend
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
          
          setIsFavorite(favorites.some(item => 
            item.id === parseInt(id) && item.mediaType === mediaType
          ));
          
          setIsWatchLater(watchLater.some(item => 
            item.id === parseInt(id) && item.mediaType === mediaType
          ));
        }

        // Load comments from localStorage
        const storedComments = JSON.parse(localStorage.getItem(`comments-${mediaType}-${id}`) || '[]');
        setComments(storedComments);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load details');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType, isAuthenticated]);

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(
        item => !(item.id === parseInt(id) && item.mediaType === mediaType)
      );
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      const newItem = {
        id: parseInt(id),
        mediaType,
        title: details.title || details.name,
        poster_path: details.poster_path,
        vote_average: details.vote_average,
        release_date: details.release_date || details.first_air_date
      };
      favorites.push(newItem);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleWatchLater = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    
    if (isWatchLater) {
      // Remove from watch later
      const updatedWatchLater = watchLater.filter(
        item => !(item.id === parseInt(id) && item.mediaType === mediaType)
      );
      localStorage.setItem('watchLater', JSON.stringify(updatedWatchLater));
      setIsWatchLater(false);
    } else {
      // Add to watch later
      const newItem = {
        id: parseInt(id),
        mediaType,
        title: details.title || details.name,
        poster_path: details.poster_path,
        vote_average: details.vote_average,
        release_date: details.release_date || details.first_air_date
      };
      watchLater.push(newItem);
      localStorage.setItem('watchLater', JSON.stringify(watchLater));
      setIsWatchLater(true);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!comment.trim()) {
      return;
    }
    
    const newComment = {
      id: Date.now(),
      userId: user.id || 'user-' + Date.now(),
      username: user.username || user.email || 'Anonymous',
      comment,
      rating,
      date: new Date().toISOString()
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    
    // Save to localStorage
    localStorage.setItem(`comments-${mediaType}-${id}`, JSON.stringify(updatedComments));
    
    // Reset form
    setComment('');
    setRating(5);
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`comments-${mediaType}-${id}`, JSON.stringify(updatedComments));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !details) {
    return <div className="error">{error || 'Failed to load details'}</div>;
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const posterPath = details.poster_path 
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';
  
  // Get trailer if available
  const trailer = details.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return (
    <div className="movie-details">
      <div className="movie-header">
        <div className="movie-poster">
          <img src={posterPath} alt={title} />
        </div>
        
        <div className="movie-info">
          <h1>{title}</h1>
          
          {releaseDate && (
            <p>Release Date: {new Date(releaseDate).toLocaleDateString()}</p>
          )}
          
          {details.vote_average > 0 && (
            <p>Rating: {details.vote_average.toFixed(1)}/10</p>
          )}
          
          {details.genres && (
            <div className="genres">
              <p>Genres: {details.genres.map(genre => genre.name).join(', ')}</p>
            </div>
          )}
          
          {details.runtime && (
            <p>Runtime: {Math.floor(details.runtime / 60)}h {details.runtime % 60}m</p>
          )}
          
          {details.number_of_episodes && (
            <p>Episodes: {details.number_of_episodes}</p>
          )}
          
          {details.number_of_seasons && (
            <p>Seasons: {details.number_of_seasons}</p>
          )}
          
          <div className="action-buttons">
            <button onClick={handleFavorite}>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button onClick={handleWatchLater}>
              {isWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="movie-overview">
        <h2>Overview</h2>
        <p>{details.overview || 'No overview available.'}</p>
      </div>
      
      {trailer && (
        <div className="movie-trailer">
          <h2>Trailer</h2>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      
      {details.credits?.cast && details.credits.cast.length > 0 && (
        <div className="movie-cast">
          <h2>Cast</h2>
          <div className="cast-list">
            {details.credits.cast.slice(0, 10).map(person => (
              <div key={person.id} className="cast-item">
                <img 
                  src={person.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
                  } 
                  alt={person.name} 
                />
                <p>{person.name}</p>
                <p className="character">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Comments/Critique Section */}
      <div className="movie-comments">
        <h2>User Reviews</h2>
        
        {isAuthenticated ? (
          <div className="comment-form">
            <h3>Add Your Review</h3>
            <form onSubmit={handleCommentSubmit}>
              <div className="rating-select">
                <label htmlFor="rating">Your Rating:</label>
                <select 
                  id="rating" 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}/10</option>
                  ))}
                </select>
              </div>
              
              <div className="comment-input">
                <label htmlFor="comment">Your Review:</label>
                <textarea
                  id="comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  required
                ></textarea>
              </div>
              
              <button type="submit">Submit Review</button>
            </form>
          </div>
        ) : (
          <div className="login-prompt">
            <p>Please <button onClick={() => navigate('/login')}>login</button> to add a review.</p>
          </div>
        )}
        
        <div className="comments-list">
          <h3>Reviews ({comments.length})</h3>
          
          {comments.length > 0 ? (
            comments.map((item) => (
              <div key={item.id} className="comment-item">
                <div className="comment-header">
                  <span className="username">{item.username}</span>
                  <span className="rating">Rating: {item.rating}/10</span>
                  <span className="date">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                
                <p className="comment-text">{item.comment}</p>
                
                {isAuthenticated && user && (user.id === item.userId || user.email === item.username) && (
                  <button 
                    className="delete-comment" 
                    onClick={() => handleDeleteComment(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
      
      {details.similar?.results && details.similar.results.length > 0 && (
        <div className="similar-movies">
          <h2>Similar {mediaType === 'movie' ? 'Movies' : 'TV Shows'}</h2>
          <MovieList 
            items={details.similar.results.slice(0, 6)} 
            mediaType={mediaType} 
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;