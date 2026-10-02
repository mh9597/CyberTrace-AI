import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('cybertrace_token') || localStorage.getItem('cybertrace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      if (!isAuthEndpoint && window.location.pathname !== '/login' && window.location.pathname !== '/') {
        sessionStorage.removeItem('cybertrace_token');
        sessionStorage.removeItem('cybertrace_user');
        localStorage.removeItem('cybertrace_token');
        localStorage.removeItem('cybertrace_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
