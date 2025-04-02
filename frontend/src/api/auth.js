// src/api/auth.js
import axios from 'axios';
import { API_URL } from '../utils/constants';
import {
    storeAuthToken,
    removeAuthToken,
    storeUserData,
    removeUserData,
    clearCache
} from '../utils/asyncStorage';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Register user
export const register = async (userData) => {
    try {
        const response = await api.post('/register', userData);

        // Store token and user data
        await storeAuthToken(response.data.token);
        await storeUserData(response.data.user);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Login user
export const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);

        // Store token and user data
        await storeAuthToken(response.data.token);
        await storeUserData(response.data.user);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Get current user info
export const getCurrentUser = async (token) => {
    try {
        const response = await api.get('/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Update stored user data
        await storeUserData(response.data.data);

        return response.data.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Logout user
export const logout = async () => {
    try {
        // Remove token and user data
        await removeAuthToken();
        await removeUserData();
        await clearCache();

        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};