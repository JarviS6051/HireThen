// src/utils/constants.js
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Try to load environment variables
// Note: For this to work with Expo, you need react-native-dotenv configured
const API_URL_PROD = 'https://hirethen-full-stack-project-1.onrender.com/api';

// Determine environment
const getEnvironment = () => {
    if (__DEV__) return 'development';
    // You can add logic to determine staging vs production
    return 'production';
};

// Set API URL based on environment
const getApiUrl = () => {
    const environment = getEnvironment();

    if (environment === 'development') {
        // For local development
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:5000/api'; // Android emulator
        } else if (Platform.OS === 'ios') {
            return 'http://localhost:5000/api'; // iOS simulator
        } else {
            return 'http://192.168.1.45:5000/api'; // Physical device - replace with your IP
        }
    } else if (environment === 'staging') {
        return 'https://staging-api.your-finance-app.com/api'; // Replace with your staging URL
    } else {
        // Production URL - your deployed Render backend
        return API_URL_PROD;
    }
};

export const API_URL = getApiUrl();

export const TRANSACTION_TYPES = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' }
];

// Rest of your constants remain the same
export const DEFAULT_CATEGORIES = {
    income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
    expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Education', 'Travel', 'Other']
};

export const RECURRING_FREQUENCIES = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
];

export const BUDGET_PERIODS = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
];

export const COLORS = {
    primary: '#4C66EE',
    secondary: '#5AC8FA',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#8E8E93',
    lightGray: '#D1D1D6',
    background: '#F2F2F7'
};