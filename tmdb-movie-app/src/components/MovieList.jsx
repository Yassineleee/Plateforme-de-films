
import MovieCard from './MovieCard';
import '../styles/MovieList.css';

const MovieList = ({ items, title, mediaType }) => {
  if (!items || items.length === 0) {
    return <div>No items to display</div>;
  }

  return (
    <div className="movie-list">
      {title && <h2>{title}</h2>}
      <div className="movie-grid">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} mediaType={mediaType} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;