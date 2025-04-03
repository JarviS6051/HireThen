// src/utils/constants.js
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Try to load environment variables
// Note: For this to work with Expo, you need react-native-dotenv configured
export const API_URL = 'https://hirethen.onrender.com/api';

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

// export const COLORS = {
//     primary: '#4C66EE',
//     secondary: '#5AC8FA',
//     success: '#34C759',
//     danger: '#FF3B30',
//     warning: '#FF9500',
//     info: '#5AC8FA',
//     light: '#F2F2F7',
//     dark: '#1C1C1E',
//     white: '#FFFFFF',
//     black: '#000000',
//     gray: '#8E8E93',
//     lightGray: '#D1D1D6',
//     background: '#F2F2F7'
// };

export const COLORS = {
    primary: '#2C3E50',  // Muted Navy
    secondary: '#BDC3C7', // Light Gray
    success: '#27AE60',  // Soft Green
    danger: '#C0392B',   // Deep Red
    warning: '#E67E22',  // Orange
    info: '#2980B9',     // Deep Blue
    light: '#ECF0F1',    // Soft White
    dark: '#2C3E50',     // Dark Navy
    white: '#FFFFFF',
    black: '#000000',
    gray: '#7F8C8D',     // Neutral Gray
    lightGray: '#D5D8DC',
    background: '#F4F6F7' // Off-White Background
};
