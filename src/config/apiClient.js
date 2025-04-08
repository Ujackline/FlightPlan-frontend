import axios from 'axios';
import Utils from './utils.js';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: import.meta.env.DEV ? "http://localhost:3029/flight-plan-t9" : "/flight-plan-t9/",
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const user = Utils.getStore('user');
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear user data and redirect to login
                    Utils.clearStore();
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Access forbidden:', error.response.data);
                    break;
                case 404:
                    console.error('Resource not found:', error.response.data);
                    break;
                case 500:
                    console.error('Server error:', error.response.data);
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('No response received:', error.request);
        } else {
            // Error in request configuration
            console.error('Request configuration error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient; 