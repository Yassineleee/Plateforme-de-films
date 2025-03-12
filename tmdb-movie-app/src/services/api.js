
import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

// Base URLs
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'e6660da8685e0f6ed86c857c3d516056'; 
const AUTH_API_URL = 'http://localhost:8000/api'; 

// TMDB API client
export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Auth API client
export const authClient = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
authClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);