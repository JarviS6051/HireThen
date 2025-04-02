// src/api/budget.js
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getAuthToken, cacheData, getCachedData } from '../utils/asyncStorage';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/budgets`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    const token = await getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Get all budgets
export const getBudgets = async () => {
    try {
        // Try cache first
        const cachedData = await getCachedData('budgets');

        const response = await api.get('/');

        // Cache the response
        await cacheData('budgets', response.data);

        return response.data;
    } catch (error) {
        // If offline, return cached data
        const cachedData = await getCachedData('budgets');
        if (cachedData) {
            return cachedData;
        }

        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Get budget status and alerts
export const getBudgetStatus = async () => {
    try {
        // Try cache first
        const cachedData = await getCachedData('budget_status');

        const response = await api.get('/status');

        // Cache the response
        await cacheData('budget_status', response.data);

        return response.data;
    } catch (error) {
        // If offline, return cached data
        const cachedData = await getCachedData('budget_status');
        if (cachedData) {
            return cachedData;
        }

        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Get a single budget
export const getBudget = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Create a new budget
export const createBudget = async (budgetData) => {
    try {
        const response = await api.post('/', budgetData);

        // Invalidate cache
        await cacheData('budgets', null);
        await cacheData('budget_status', null);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Update a budget
export const updateBudget = async (id, budgetData) => {
    try {
        const response = await api.put(`/${id}`, budgetData);

        // Invalidate cache
        await cacheData('budgets', null);
        await cacheData('budget_status', null);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Delete a budget
export const deleteBudget = async (id) => {
    try {
        console.log('Deleting budget with ID:', id); // Debug logging

        const response = await api.delete(`/${id}`);

        // Invalidate cache
        await cacheData('budgets', null);
        await cacheData('budget_status', null);

        return response.data;
    } catch (error) {
        console.error('Delete budget API error:', error.response || error); // Enhanced error logging
        throw error.response ? error.response.data : new Error('Network error');
    }
};