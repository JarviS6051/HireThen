// src/api/transaction.js
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getAuthToken, cacheData, getCachedData } from '../utils/asyncStorage';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/transactions`,
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

// Get all transactions with optional filters
export const getTransactions = async (filters = {}) => {
    try {
        // First try to get from cache for offline support
        const cachedData = await getCachedData('transactions');

        // Create query string from filters
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        const query = queryParams.toString();
        const endpoint = query ? `?${query}` : '';

        const response = await api.get(endpoint);

        // Cache the response
        await cacheData('transactions', response.data);

        return response.data;
    } catch (error) {
        // If offline, return cached data
        const cachedData = await getCachedData('transactions');
        if (cachedData) {
            return cachedData;
        }

        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Get transaction summary
export const getTransactionSummary = async (period = 'month') => {
    try {
        // Try cache first
        const cacheKey = `transaction_summary_${period}`;
        const cachedData = await getCachedData(cacheKey);

        const response = await api.get(`/summary?period=${period}`);

        // Cache the response
        await cacheData(cacheKey, response.data);

        return response.data;
    } catch (error) {
        // If offline, return cached data
        const cacheKey = `transaction_summary_${period}`;
        const cachedData = await getCachedData(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Get a single transaction
export const getTransaction = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
    try {
        // Create a copy of the transaction data
        const dataToSend = { ...transactionData };

        // Remove recurringFrequency if it's null
        if (!dataToSend.isRecurring || dataToSend.recurringFrequency === null) {
            delete dataToSend.recurringFrequency;
        }

        const response = await api.post('/', dataToSend);

        // Invalidate cache
        await cacheData('transactions', null);
        await cacheData('transaction_summary_month', null);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Update a transaction
export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await api.put(`/${id}`, transactionData);

        // Invalidate cache
        await cacheData('transactions', null);
        await cacheData('transaction_summary_month', null);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
    try {
        const response = await api.delete(`/${id}`);

        // Invalidate cache
        await cacheData('transactions', null);
        await cacheData('transaction_summary_month', null);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};