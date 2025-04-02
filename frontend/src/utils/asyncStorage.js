
import AsyncStorage from '@react-native-async-storage/async-storage';

// Token management
export const storeAuthToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
        return true;
    } catch (error) {
        console.error('Error storing auth token:', error);
        return false;
    }
};

export const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

export const removeAuthToken = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
        return true;
    } catch (error) {
        console.error('Error removing auth token:', error);
        return false;
    }
};

// User data management
export const storeUserData = async (userData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Error storing user data:', error);
        return false;
    }
};

export const getUserData = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

export const removeUserData = async () => {
    try {
        await AsyncStorage.removeItem('userData');
        return true;
    } catch (error) {
        console.error('Error removing user data:', error);
        return false;
    }
};

// Cache data for offline support
export const cacheData = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
        await AsyncStorage.setItem(`${key}_timestamp`, Date.now().toString());
        return true;
    } catch (error) {
        console.error(`Error caching data for ${key}:`, error);
        return false;
    }
};

export const getCachedData = async (key, maxAge = 3600000) => { // Default max age: 1 hour
    try {
        const data = await AsyncStorage.getItem(key);
        const timestamp = await AsyncStorage.getItem(`${key}_timestamp`);

        if (!data || !timestamp) {
            return null;
        }

        const age = Date.now() - parseInt(timestamp);
        if (age > maxAge) {
            return null; // Cache expired
        }

        return JSON.parse(data);
    } catch (error) {
        console.error(`Error getting cached data for ${key}:`, error);
        return null;
    }
};

export const clearCache = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key =>
            key !== 'authToken' &&
            key !== 'userData' &&
            !key.endsWith('_timestamp')
        );
        await AsyncStorage.multiRemove(cacheKeys);

        const timestampKeys = keys.filter(key => key.endsWith('_timestamp'));
        await AsyncStorage.multiRemove(timestampKeys);

        return true;
    } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
    }
};

// Clear all app data (for logout)
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }
};