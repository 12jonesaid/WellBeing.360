import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://172.30.3.203:5000';

const api = axios.create({
  baseURL: API_URL
});

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
