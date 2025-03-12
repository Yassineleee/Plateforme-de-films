
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieList from '../components/MovieList';

const WatchLater = () => {
  const [watchLater, setWatchLater] = useState([]);
  
  useEffect(() => {
    // Load watch later items from localStorage
    const savedItems = JSON.parse(localStorage.getItem('watchLater') || '[]');
    setWatchLater(savedItems);
  }, []);
  
  const removeItem = (id, mediaType) => {
    const updatedItems = watchLater.filter(
      item => !(item.id === id && item.mediaType === mediaType)
    );
    setWatchLater(updatedItems);
    localStorage.setItem('watchLater', JSON.stringify(updatedItems));
  };
  
  if (watchLater.length === 0) {
    return (
      <div className="watch-later-page">
        <h1>Watch Later</h1>
        <p>You haven't added any items to your watch later list.</p>
        <Link to="/">Explore Movies and TV Shows</Link>
      </div>
    );
  }
  
  return (
    <div className="watch-later-page">
      <h1>Watch Later</h1>
      
      <div className="watch-later-list">
        {watchLater.map(item => (
          <div key={`${item.mediaType}-${item.id}`} className="watch-later-item">
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
            <button onClick={() => removeItem(item.id, item.mediaType)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchLater;