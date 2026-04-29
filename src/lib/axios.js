import axios from 'axios';

/**
 * Unified API client.
 *
 * In development the Vite proxy forwards /api/* → http://localhost:8000/*,
 * so we never need to worry about CORS or setting VITE_API_URL locally.
 *
 * In production set VITE_API_URL to the deployed backend base URL (no /api suffix).
 */
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const api = axios.create({
  baseURL,
  timeout: 45_000, // JSearch + AI analysis can take ~20-30 s
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT when present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pa_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — normalise error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message ||
      'Network error';
    console.error('[API]', message);
    return Promise.reject(new Error(message));
  },
);

export default api;
