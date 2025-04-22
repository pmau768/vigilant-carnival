import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with default configs
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // You could add auth tokens here
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle specific error codes if needed
    // if (error.response?.status === 401) {
    //   // Handle unauthorized access
    // }
    return Promise.reject(error);
  }
);

export default api; 