
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken, getUserData } from '../utils/asyncStorage';
import * as authApi from '../api/auth';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Load token and user data from storage on mount
    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load token and user data from storage
                const token = await getAuthToken();
                const userData = await getUserData();

                if (token && userData) {
                    setUserToken(token);
                    setUser(userData);

                    // Refresh user data
                    try {
                        const freshUserData = await authApi.getCurrentUser(token);
                        setUser(freshUserData);
                    } catch (error) {
                        console.log('Error refreshing user data:', error);
                        // Continue with cached user data
                    }
                }
            } catch (e) {
                console.log('Error loading auth data:', e);
                setError('Failed to load authentication data');
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredAuth();
    }, []);

    // Register a new user
    const register = async (name, email, password) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await authApi.register({ name, email, password });

            setUserToken(result.token);
            setUser(result.user);

            return result;
        } catch (e) {
            setError(e.error || 'Registration failed');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await authApi.login({ email, password });

            setUserToken(result.token);
            setUser(result.user);

            return result;
        } catch (e) {
            setError(e.error || 'Login failed');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout user
    const logout = async () => {
        try {
            setIsLoading(true);
            setError(null);

            await authApi.logout();

            setUserToken(null);
            setUser(null);

            return true;
        } catch (e) {
            setError(e.error || 'Logout failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            isLoading,
            userToken,
            user,
            error,
            register,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);