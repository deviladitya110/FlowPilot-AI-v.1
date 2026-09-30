import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : (import.meta.env.VITE_API_URL || 'https://flowpilot-ai-v-1-2-6l3n.onrender.com/api'),
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or clear state if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
