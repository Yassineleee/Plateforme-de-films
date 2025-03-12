
import { Link } from 'react-router-dom';
import '../styles/MovieCard.css';

const MovieCard = ({ item, mediaType }) => {
  // Determine if it's a movie or TV show
  const type = mediaType || item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name;
  const id = item.id;
  
  // Base URL for poster images
  const posterBaseUrl = 'https://image.tmdb.org/t/p/w300';
  const posterPath = item.poster_path 
    ? `${posterBaseUrl}${item.poster_path}` 
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="movie-card">
      <Link to={`/${type}/${id}`}>
        <img src={posterPath} alt={title} />
        <h3>{title}</h3>
        {item.release_date && (
          <p>Release Date: {new Date(item.release_date).getFullYear()}</p>
        )}
        {item.first_air_date && (
          <p>First Air Date: {new Date(item.first_air_date).getFullYear()}</p>
        )}
        {item.vote_average > 0 && (
          <p>Rating: {item.vote_average.toFixed(1)}/10</p>
        )}
      </Link>
    </div>
  );
};

export default MovieCard;