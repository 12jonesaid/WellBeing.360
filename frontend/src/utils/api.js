import axios from 'axios';

// Dynamic API URL for cross-device compatibility
const getAPIURL = () => {
  // Use environment variable if set
  if (process.env.REACT_APP_API_URL) {
    console.log('📡 Using configured API URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // In production (built app), use relative path to same host
  if (process.env.NODE_ENV === 'production') {
    console.log('📡 Production mode: Using relative API path');
    return '';
  }
  
  // In development, try localhost first, then fallback to current host
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  let url;
  // If accessing from localhost, use localhost:5000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    url = `${protocol}//localhost:5000`;
  } else {
    // If accessing from network IP, use same IP with port 5000
    url = `${protocol}//${hostname}:5000`;
  }
  
  console.log('📡 Auto-detected API URL:', url, '(hostname:', hostname, ')');
  return url;
};

const API_URL = getAPIURL();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000 // 10 second timeout
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error' && !error.response) {
      console.error('❌ Network Error: Cannot reach backend at', API_URL);
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (name, email, password) =>
  api.post('/api/auth/register', { name, email, password });

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

export const googleLogin = (tokenId) =>
  api.post('/api/auth/google', { tokenId });

export const getUserProfile = (userId) =>
  api.get(`/api/auth/profile/${userId}`);

// Workouts
export const addWorkout = (userId, workout) =>
  api.post('/api/workouts', { userId, ...workout });

export const getUserWorkouts = (userId) =>
  api.get(`/api/workouts/${userId}`);

// Nutrition
export const addNutrition = (userId, nutrition) =>
  api.post('/api/nutrition', { userId, ...nutrition });

export const getUserNutrition = (userId) =>
  api.get(`/api/nutrition/${userId}`);

export const getDailyNutrition = (userId, date) =>
  api.get(`/api/nutrition/${userId}/daily`, { params: { date } });

// Mood
export const addMood = (userId, mood) =>
  api.post('/api/mood', { userId, ...mood });

export const getUserMood = (userId) =>
  api.get(`/api/mood/${userId}`);

export const getMoodStats = (userId, days = 7) =>
  api.get(`/api/mood/${userId}/stats`, { params: { days } });

// Stats
export const getUserStats = (userId, days = 7) =>
  api.get(`/api/stats/${userId}`, { params: { days } });

export default api;
