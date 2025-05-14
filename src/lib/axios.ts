import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://dan-events-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to include the auth token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('daneventsAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('daneventsCurrentUser');
      localStorage.removeItem('daneventsAuthToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);