
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieList from '../components/MovieList';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);
  
  const removeFavorite = (id, mediaType) => {
    const updatedFavorites = favorites.filter(
      item => !(item.id === id && item.mediaType === mediaType)
    );
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  
  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1>Favorites</h1>
        <p>You haven't added any favorites yet.</p>
        <Link to="/">Explore Movies and TV Shows</Link>
      </div>
    );
  }
  
  return (
    <div className="favorites-page">
      <h1>Favorites</h1>
      
      <div className="favorites-list">
        {favorites.map(item => (
          <div key={`${item.mediaType}-${item.id}`} className="favorite-item">
            <Link to={`/${item.mediaType}/${item.id}`}>
              <img 
                src={item.poster_path 
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : 'https://via.placeholder.com/200x300?text=No+Image'
                } 
                alt={item.title} 
              />
              <h3>{item.title}</h3>
            </Link>
            <button onClick={() => removeFavorite(item.id, item.mediaType)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;