// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to inject the Clerk token
export const setupAxiosInterceptors = (getToken) => {
    api.interceptors.request.use(async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token', error);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
};

export default api;
