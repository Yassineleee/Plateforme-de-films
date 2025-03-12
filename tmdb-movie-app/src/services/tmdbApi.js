// src/services/tmdbApi.js
import { tmdbClient } from './api';

// Get trending movies
export const getTrendingMovies = async () => {
  const response = await tmdbClient.get('/trending/movie/week');
  return response.data.results;
};

// Get trending TV shows
export const getTrendingTVShows = async () => {
  const response = await tmdbClient.get('/trending/tv/week');
  return response.data.results;
};

// Get latest movies
export const getLatestMovies = async (page = 1) => {
  const response = await tmdbClient.get('/movie/now_playing', {
    params: { page },
  });
  return response.data;
};

// Get latest TV shows
export const getLatestTVShows = async (page = 1) => {
  const response = await tmdbClient.get('/tv/on_the_air', {
    params: { page },
  });
  return response.data;
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  const response = await tmdbClient.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos,credits,similar',
    },
  });
  return response.data;
};

// Get TV show details
export const getTVDetails = async (tvId) => {
  const response = await tmdbClient.get(`/tv/${tvId}`, {
    params: {
      append_to_response: 'videos,credits,similar',
    },
  });
  return response.data;
};

// Search movies and TV shows
export const searchMulti = async (query, page = 1) => {
  const response = await tmdbClient.get('/search/multi', {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

// Search by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
    },
  });
  return response.data;
};

// Get genres list
export const getGenres = async (type = 'movie') => {
  const response = await tmdbClient.get(`/genre/${type}/list`);
  return response.data.genres;
};