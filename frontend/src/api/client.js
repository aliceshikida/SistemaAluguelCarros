import axios from 'axios';

// Em desenvolvimento, usa o proxy do Vite (mesma origem → /api → backend). Em build, use VITE_API_URL.
const baseURL =
  import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth');
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignora
  }
  return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('auth');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
);

export default api;